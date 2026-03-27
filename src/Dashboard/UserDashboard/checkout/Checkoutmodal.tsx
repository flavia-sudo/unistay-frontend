import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  BedDouble,
  Phone,
  ChevronRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard,
  Building2,
  User,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Room = {
  roomId: number;
  roomNumber: string;
  roomType: string;
  price: string;
  capacity: string;
  description: string;
  status: boolean; // false = available
};

type Hostel = {
  hostelId: number;
  hostelName: string;
  location: string;
  price: number;
  image_URL?: string;
  firstName?: string;
  lastName?: string;
  contact_number?: string;
};

type CheckoutModalProps = {
  hostel: Hostel;
  onClose: () => void;
};

type Step = "rooms" | "details" | "payment" | "success";

// ─── Duration options ──────────────────────────────────────────────────────────

const DURATIONS = [
  { label: "1 Month", months: 1 },
  { label: "4 Months (Semester)", months: 4 },
  { label: "8 Months (Year)", months: 8 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://hostel-backend-fyy3.onrender.com";

async function fetchRooms(hostelId: number): Promise<Room[]> {
  const res = await fetch(`${BASE_URL}/room/hostel/${hostelId}`);
  if (!res.ok) throw new Error("Failed to load rooms");

  const text = await res.text();
  if (!text || text.trim() === "") return []; // empty body = no rooms yet

  try {
    const json = JSON.parse(text);
    return Array.isArray(json) ? json : json.data ?? [];
  } catch {
    return [];
  }
}

async function createBooking(payload: object) {
  const res = await fetch(`${BASE_URL}/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to create booking");
  }
  return res.json();
}

async function createPayment(payload: object) {
  const res = await fetch(`${BASE_URL}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to create payment record");
  }
  return res.json();
}

async function triggerStkPush(phoneNumber: string, amount: number, paymentId: number) {
  const res = await fetch(`${BASE_URL}/mpesa/stk-push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber, amount, paymentId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "STK push failed");
  }
  return res.json();
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

const steps: { key: Step; label: string }[] = [
  { key: "rooms", label: "Select Room" },
  { key: "details", label: "Details" },
  { key: "payment", label: "Pay" },
  { key: "success", label: "Done" },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide whitespace-nowrap ${
                  active ? "text-blue-600" : done ? "text-emerald-500" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-500 ${
                  done ? "bg-emerald-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutModal({ hostel, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("rooms");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState("");

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{ bookingId: number; paymentId: number } | null>(null);

  // Get userId from localStorage (adjust key to match your auth setup)
  const userId = Number(localStorage.getItem("userId") ?? 1);

  useEffect(() => {
    fetchRooms(hostel.hostelId)
      .then(setRooms)
      .catch((e) => setRoomsError(e.message))
      .finally(() => setLoadingRooms(false));
  }, [hostel.hostelId]);

  const totalAmount = selectedRoom
    ? Number(selectedRoom.price) * duration.months
    : hostel.price * duration.months;

  // ── Validate phone ──────────────────────────────────────────────────────────
  function validatePhone(raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    // Accept 07xxxxxxxx → 2547xxxxxxxx, or already 2547xxxxxxxx
    if (/^07\d{8}$/.test(cleaned)) return "254" + cleaned.slice(1);
    if (/^2547\d{8}$/.test(cleaned)) return cleaned;
    return null;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handlePay() {
    setError("");
    const normalizedPhone = validatePhone(phoneNumber);
    if (!normalizedPhone) {
      setPhoneError("Enter a valid Safaricom number (07XXXXXXXX)");
      return;
    }
    if (!checkInDate) {
      setError("Please select a check-in date");
      return;
    }
    setProcessing(true);

    try {
      // 1. Create booking
      const bookingPayload = {
        hostelId: hostel.hostelId,
        roomId: selectedRoom!.roomId,
        userId,
        checkInDate,
        duration: duration.label,
        totalAmount: String(totalAmount),
        bookingStatus: false,
      };
      const bookingRes = await createBooking(bookingPayload);
      const bookingId: number = bookingRes.data?.bookingId ?? bookingRes.bookingId;

      // 2. Create payment record (Pending)
      const paymentPayload = {
        bookingId,
        userId,
        amount: String(totalAmount),
        method: "M-Pesa",
        transactionId: `PENDING_${Date.now()}`,
        paymentStatus: "Pending",
      };
      const paymentRes = await createPayment(paymentPayload);
      const paymentId: number = paymentRes.data?.paymentId ?? paymentRes.paymentId;

      // 3. Trigger STK Push
      await triggerStkPush(normalizedPhone, totalAmount, paymentId);

      setSuccessData({ bookingId, paymentId });
      setStep("success");
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} className="text-gray-500" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-tight">
                {hostel.hostelName}
              </h2>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={11} /> {hostel.location}
              </p>
            </div>
          </div>

          {step !== "success" && <StepIndicator current={step} />}
        </div>

        <div className="px-6 py-5">

          {/* ── STEP 1: Room Selection ────────────────────────────────────── */}
          {step === "rooms" && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Choose a Room</h3>

              {loadingRooms ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                </div>
              ) : roomsError ? (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl p-3">
                  <AlertCircle size={16} /> {roomsError}
                </div>
              ) : rooms.filter((r) => !r.status).length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No available rooms at the moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {rooms
                    .filter((r) => !r.status) // status false = available
                    .map((room) => (
                      <button
                        key={room.roomId}
                        onClick={() => setSelectedRoom(room)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                          selectedRoom?.roomId === room.roomId
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:border-gray-300 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                selectedRoom?.roomId === room.roomId
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-400"
                              }`}
                            >
                              <BedDouble size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                Room {room.roomNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {room.roomType} · Capacity: {room.capacity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-700 text-sm">
                              Ksh {Number(room.price).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">/month</p>
                          </div>
                        </div>
                        {room.description && (
                          <p className="text-xs text-gray-400 mt-2 ml-11 line-clamp-2">
                            {room.description}
                          </p>
                        )}
                      </button>
                    ))}
                </div>
              )}

              <button
                disabled={!selectedRoom}
                onClick={() => setStep("details")}
                className="mt-6 w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition hover:bg-blue-700"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Booking Details ───────────────────────────────────── */}
          {step === "details" && selectedRoom && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>

              {/* Selected room summary */}
              <div className="bg-blue-50 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
                    <BedDouble size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      Room {selectedRoom.roomNumber}
                    </p>
                    <p className="text-xs text-gray-500">{selectedRoom.roomType}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep("rooms")}
                  className="text-xs text-blue-500 font-medium hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Check-in date */}
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <Calendar size={14} /> Check-in Date
                </span>
                <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>

              {/* Duration */}
              <label className="block mb-5">
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Duration
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setDuration(d)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                        duration.label === d.label
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </label>

              {/* Cost summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Room rate</span>
                  <span>Ksh {Number(selectedRoom.price).toLocaleString()} × {duration.months} mo.</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>Ksh {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 rounded-xl p-3 mb-4">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                disabled={!checkInDate}
                onClick={() => setStep("payment")}
                className="w-full bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition hover:bg-blue-700"
              >
                Proceed to Payment <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === "payment" && selectedRoom && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Pay with M-Pesa</h3>
              <p className="text-sm text-gray-400 mb-5">
                Enter your Safaricom number to receive an STK push prompt.
              </p>

              {/* Order summary card */}
              <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3">
                  Payment Summary
                </p>
                <div className="space-y-1.5 text-sm text-blue-100 mb-4">
                  <div className="flex justify-between">
                    <span>{hostel.hostelName}</span>
                    <span>Room {selectedRoom.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{duration.label}</span>
                    <span>from {checkInDate}</span>
                  </div>
                </div>
                <div className="border-t border-blue-500 pt-3 flex justify-between items-end">
                  <span className="text-sm text-blue-200">Amount due</span>
                  <span className="text-3xl font-black">
                    Ksh {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Phone input */}
              <label className="block mb-5">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <Phone size={14} /> M-Pesa Phone Number
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                    +254
                  </span>
                  <input
                    type="tel"
                    placeholder="7XXXXXXXX"
                    value={phoneNumber.replace(/^(0|\+?254)/, "")}
                    onChange={(e) => {
                      setPhoneError("");
                      setPhoneNumber(e.target.value);
                    }}
                    className={`w-full border rounded-xl pl-14 pr-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      phoneError
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {phoneError}
                  </p>
                )}
              </label>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex gap-2 mb-5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>
                  A payment prompt will appear on your phone. Enter your M-Pesa PIN to complete the transaction.
                </span>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 rounded-xl p-3 mb-4">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={processing || !phoneNumber}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition text-base"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sending prompt…
                  </>
                ) : (
                  <>
                    <CreditCard size={18} /> Pay Ksh {totalAmount.toLocaleString()}
                  </>
                )}
              </button>

              <button
                onClick={() => setStep("details")}
                className="w-full mt-2 py-3 text-gray-400 text-sm hover:text-gray-600 transition"
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── STEP 4: Success ───────────────────────────────────────────── */}
          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-in zoom-in-50 duration-500">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Booking Initiated!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Check your phone and enter your M-Pesa PIN to complete the payment.
                Your booking will be confirmed automatically.
              </p>

              {successData && (
                <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking ID</span>
                    <span className="font-semibold text-gray-800">#{successData.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment ID</span>
                    <span className="font-semibold text-gray-800">#{successData.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hostel</span>
                    <span className="font-semibold text-gray-800">{hostel.hostelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room</span>
                    <span className="font-semibold text-gray-800">
                      {selectedRoom?.roomNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-emerald-600">
                      Ksh {totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-amber-600 font-semibold">Processing</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 justify-center text-xs text-gray-400 mb-6">
                <User size={12} />
                Payment status updates automatically via M-Pesa callback
              </div>

              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-semibold transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}