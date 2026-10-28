import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../services/auth";
import { updateUser } from "../redux/slices/authSlice";

const ProfileDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const data = await updateProfile({
        name,
        username,
        email,
      });

      dispatch(updateUser(data.user));

      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-surface border-l border-border shadow-xl text-text-primary">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              My Profile
            </h2>

            <p className="text-sm text-text-secondary">
              Manage your account information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-text-muted hover:text-text-primary"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-text-inverse">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h3 className="font-semibold text-text-primary">
                {user?.name}
              </h3>

              <p className="text-sm text-text-secondary">
                @{user?.username}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary outline-none transition focus:border-border-focus focus:ring-2 focus:ring-border-focus/20"
              />
            </div>

            {/* Username */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary outline-none transition focus:border-border-focus focus:ring-2 focus:ring-border-focus/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary outline-none transition focus:border-border-focus focus:ring-2 focus:ring-border-focus/20"
              />
            </div>

            {/* Message */}
            {message && (
              <p className="rounded-lg bg-success-light p-2.5 text-sm text-success">
                {message}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 font-medium text-text-inverse transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
