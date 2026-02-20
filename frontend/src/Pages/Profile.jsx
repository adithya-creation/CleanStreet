import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("details");

  // Editable personal details state
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("User"); // default role

  // Save handler
  const handleSave = () => {
    console.log("Saved details:", { location, role });
    alert("Profile saved!");
    // TODO: Connect to API
  };

  // Cancel handler
  const handleCancel = () => {
    setLocation("");
    setRole("User");
  };

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }
    if (!passwordMatch) {
      alert("Passwords do not match");
      return;
    }
    console.log("Password updated:", { currentPassword, newPassword });
    alert("Password updated!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-profile relative min-h-screen">
      {/* Overlay */}
     

      <div className="relative z-10 p-8">
        <h1 className="text-2xl font-bold mb-1 text-black">Account Settings</h1>
        <p className="text-black-200 mb-6">
          Manage your profile details and security.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT CARD */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-teal-500 text-white flex items-center justify-center text-3xl mx-auto">
              {user?.name?.[0]}
            </div>
            {/* Name, Email, Role below profile */}
            <h2 className="mt-4 font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm">
              {role}
            </span>
          </div>

          {/* RIGHT CARD */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-6">
              <button
                onClick={() => setTab("details")}
                className={`pb-2 ${
                  tab === "details"
                    ? "border-b-2 border-teal-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setTab("security")}
                className={`pb-2 ${
                  tab === "security"
                    ? "border-b-2 border-teal-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Security
              </button>
            </div>

            {/* PERSONAL DETAILS */}
            {tab === "details" && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={user?.name}
                  disabled
                  className="border p-3 rounded bg-gray-100 cursor-not-allowed"
                  placeholder="Full Name"
                />
                <input
                  value={user?.email}
                  disabled
                  className="border p-3 rounded bg-gray-100 cursor-not-allowed col-span-2"
                  placeholder="Email"
                />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="border p-3 rounded col-span-2"
                />

                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role"
                  className="border p-3 rounded col-span-2"
                />

                <div className="flex justify-end col-span-2 gap-3">
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {tab === "security" && (
              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="border p-3 rounded w-full"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="border p-3 rounded w-full"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="border p-3 rounded w-full"
                />
                {newPassword && confirmPassword && (
                  <p
                    className={`text-sm ${
                      passwordMatch ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {passwordMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded"
                  onClick={handlePasswordUpdate}
                  disabled={!passwordMatch || !currentPassword || !newPassword || !confirmPassword}
                >
                  Update Password
                </button>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="mt-6 text-red-500 underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;