import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { logout, login } from "../features/login/authSlice";
import type { RootState } from "../app/store";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  // Keep formData in sync if user changes in Redux
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!token || !user?.userId) setShowLoginModal(true);
  }, [token, user]);

  const getInitials = (firstName?: string, lastName?: string) =>
    ((firstName?.trim()?.[0] || "") + (lastName?.trim()?.[0] || "")).toUpperCase() || "NA";

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const initials = getInitials(user?.firstName, user?.lastName);
  const roleMap: Record<string, string> = { admin: "Admin", student: "Student", landlord: "Landlord" };
  const accountType = roleMap[user?.role?.toLowerCase() ?? ""] || "N/A";
  const verified = user?.verified ? "Yes" : "No";

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`http://localhost:4000/users/delete/${user?.userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      dispatch(logout());
      navigate("/login");
    } catch {
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/users/update/${user?.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      const { user: updatedUser } = await res.json();
      // ✅ Use the proper action creator — keeps Redux + localStorage in sync
      dispatch(login({ ...updatedUser, token: token! }));
      setShowEditModal(false);
      alert("Profile updated successfully.");
    } catch {
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  if (showLoginModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-sm p-6 text-center bg-white rounded-md shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-purple-700">Login Required</h2>
          <p className="mb-6 text-gray-700">You must be logged in to view your profile.</p>
          <button onClick={() => navigate("/login")} className="px-6 py-2 text-white bg-purple-600 rounded hover:bg-purple-700">
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl p-6 mx-auto mt-24 bg-white shadow-lg rounded-xl">
      <button onClick={() => navigate(-1)} className="absolute flex items-center gap-2 text-purple-700 top-4 left-4 hover:text-purple-900">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-24 h-24 mb-4 text-3xl font-bold text-white bg-purple-600 rounded-full">
          {initials}
        </div>
        <h2 className="text-2xl font-bold text-purple-700">{fullName}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
        <ProfileField label="Phone Number" value={user?.phoneNumber || "N/A"} />
        <ProfileField label="Address" value={user?.address || "N/A"} />
        <ProfileField label="Account Type" value={accountType} />
        <ProfileField label="Verified" value={verified} />
      </div>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <button onClick={() => setShowEditModal(true)} className="px-6 py-2 font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
          Edit Profile
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Account Deletion</h3>
            <p className="mb-6 text-gray-700">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-700 border rounded hover:border-purple-600">Cancel</button>
              <button onClick={handleDeleteAccount} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-purple-700">Edit Profile</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-2 text-gray-700 border rounded" required />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-2 text-gray-700 border rounded" required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="col-span-2 p-2 text-gray-700 border rounded" required />
              <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="p-2 text-gray-700 border rounded" />
              <div className="flex justify-end col-span-2 gap-4 mt-4">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-700 border rounded hover:border-purple-600">Cancel</button>
                <button onClick={handleUpdateSubmit} className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center w-full">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-lg font-medium text-gray-800">{value}</span>
  </div>
);

export default Profile;