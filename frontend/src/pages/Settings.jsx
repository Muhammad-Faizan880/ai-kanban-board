import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  PaintBrushIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  CheckIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import { updateProfile } from "../services/auth";
import { updateUser, logout } from "../redux/slices/authSlice";
import { togglePreference } from "../redux/slices/preferencesSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext.jsx";

const Settings = () => {
  const { showSuccess, showError } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const preferences = useSelector((state) => state.preferences);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [loading, setLoading] = useState(false);

  const showToast = (msg) => showSuccess(msg);
const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await updateProfile({ name, username, email });
      if (data?.user) {
        dispatch(updateUser(data.user));
      }
      showToast("Profile settings saved successfully");
    } catch (err) {
      console.error("Profile update failed:", err);
      showToast(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceToggle = (key, label) => {
    dispatch(togglePreference(key));
    const nextState = !preferences[key];
    showToast(`${label} ${nextState ? "turned ON" : "turned OFF"}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Settings & Preferences
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account profile, notification alerts, and workspace configurations in real-time.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Profile & Preferences */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Details Form */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <UserCircleIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">Profile Information</h2>
                <p className="text-xs text-text-muted">Update your display name, username, and email</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Faizan"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="e.g. faizan123"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-text-inverse shadow-xs transition hover:bg-primary-hover disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Notifications & AI Preferences (Real-time reactive) */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-light text-info">
                <BellIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">Workspace Preferences</h2>
                <p className="text-[12px] text-text-muted">Instant real-time controls that apply across all pages</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">Email Notifications</p>
                  <p className="text-[12px] text-text-muted">Receive email digests for overdue tasks and sprint milestones</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle("emailNotifications", "Email Notifications")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    preferences.emailNotifications ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 mt-[2px] ml-[1px] transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out ${
                      preferences.emailNotifications ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Task Reminders */}
              <div className="flex items-center justify-between border-t border-border/60 py-2">
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">Task Reminders</p>
                  <p className="text-[12px] text-text-muted">Controls the red notification badge on the top navbar</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle("taskReminders", "Task Reminders")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    preferences.taskReminders ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 mt-[2px] ml-[1px] transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out ${
                      preferences.taskReminders ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Gemini AI Auto-Suggestions */}
              <div className="flex items-center justify-between border-t border-border/60 py-2">
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">Gemini AI Auto-Suggestions</p>
                  <p className="text-[12px] text-text-muted">Show one-click feature suggestions inside the AI Task modal</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle("aiAutoSuggestions", "Gemini AI Auto-Suggestions")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    preferences.aiAutoSuggestions ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 mt-[2px] ml-[1px] transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out ${
                      preferences.aiAutoSuggestions ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Theme & Security Overview */}
        <div className="space-y-6">
          {/* Design System Preview */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5">
              <PaintBrushIcon className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">Active Design System</h3>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Standardized terracotta theme token (#da721e) configured across the application.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-primary-light p-2.5 text-xs">
                <span className="font-semibold text-primary">Primary Token</span>
                <span className="font-mono text-[11px] text-primary">#da721e</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-muted p-2.5 text-xs text-text-secondary">
                <span>Contrast Ratio</span>
                <span className="font-semibold text-success">WCAG 2.1 AA Compliant</span>
              </div>
            </div>
          </div>

          {/* Official Avatar Logo & Brand Assets */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5">
              <SparklesIcon className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">TaskFlow Avatar Logo</h3>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Download high-resolution official avatar logos for social profiles, GitHub, and app icons.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <img
                src="/taskflow-avatar.svg"
                alt="TaskFlow Avatar"
                className="h-16 w-16 rounded-2xl shadow-md border border-border"
              />
              <img
                src="/taskflow-avatar-3d.jpg"
                alt="TaskFlow 3D Avatar"
                className="h-16 w-16 rounded-2xl shadow-md object-cover border border-border"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href="/taskflow-avatar.svg"
                download="taskflow-avatar.svg"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-text-inverse shadow-xs transition hover:bg-primary-hover"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download Vector (SVG)</span>
              </a>

              <a
                href="/taskflow-avatar-3d.jpg"
                download="taskflow-avatar-3d.jpg"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary shadow-xs transition hover:bg-surface-muted hover:border-primary"
              >
                <ArrowDownTrayIcon className="h-4 w-4 text-primary" />
                <span>Download 3D Render (JPG)</span>
              </a>

              <a
                href="/download-logo.html"
                target="_blank"
                rel="noreferrer"
                className="mt-1 text-center text-[11px] font-medium text-primary hover:underline"
              >
                Open Full Brand Kit & PNG Exporter →
              </a>
            </div>
          </div>

          {/* Account Security */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheckIcon className="h-5 w-5 text-success" />
              <h3 className="text-sm font-bold text-text-primary">Session Security</h3>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              JWT token rotation and auto-logout active on 401 unauthorized responses.
            </p>

            <div className="mt-6 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger-light py-2.5 text-xs font-semibold text-danger transition hover:bg-danger hover:text-text-inverse"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Log Out of TaskFlow</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
