import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../utils/APIDomain";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TStkPushRequest = {
  phoneNumber: string; // Must be in format 2547XXXXXXXX
  amount: number;
  paymentId: number;
};

export type TStkPushResponse = {
  success: boolean;
  data?: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };
  message?: string;
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const mpesaAPI = createApi({
  reducerPath: "mpesaAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("Token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    triggerStkPush: builder.mutation<TStkPushResponse, TStkPushRequest>({
      query: (payload) => ({
        url: "/api/mpesa/stk-push",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useTriggerStkPushMutation } = mpesaAPI;

// ─── Phone Number Normalizer (mirrors backend logic) ─────────────────────────

/**
 * Converts any common Kenyan phone format to 2547XXXXXXXX
 * Returns null if invalid.
 */
export function normalizeKenyanPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (/^07\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^2547\d{8}$/.test(digits)) return digits;
  if (/^7\d{8}$/.test(digits)) return "254" + digits;
  return null;
}