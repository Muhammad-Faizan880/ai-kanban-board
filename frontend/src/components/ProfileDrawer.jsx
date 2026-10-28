import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { updateProfile } from "../services/auth";
import { updateUser } from "../redux/slices/authSlice";
import { useSnackbar } from "../context/SnackbarContext.jsx";

const ProfileDrawer = ({ isOpen, onClose }) => {
  const { showSuccess, showError } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state whenever drawer opens or user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
    setMessage("");
    setErrorMsg("");
  }, [user, isOpen]);

  // Close smoothly on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setErrorMsg("");

      const data = await updateProfile({
        name,
        username,
        email,
      });

      dispatch(updateUser(data.user));
      setMessage("Profile updated successfully");
      showSuccess("Profile updated successfully");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update profile";
      setErrorMsg(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop with smooth fade transition */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel with smooth slide-in from right */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface text-text-primary shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-primary">
              My Profile
            </h2>
            <p className="text-xs text-text-muted">
              Manage your personal credentials and identity
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-text-muted transition hover:bg-surface-muted hover:text-text-primary cursor-pointer"
            title="Close Drawer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Avatar Section */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border/80 bg-surface-muted/50 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-text-inverse shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-bold text-text-primary">
                {user?.name || "User"}
              </h3>
              <p className="truncate text-xs text-text-muted">
                @{user?.username || "username"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Success Message */}
            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-success-light p-3 text-xs font-semibold text-success animate-card-enter">
                <CheckIcon className="h-4 w-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl bg-danger-light p-3 text-xs font-semibold text-danger animate-card-enter">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3 text-xs font-semibold text-text-inverse shadow-xs transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {loading ? "Updating Profile..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
