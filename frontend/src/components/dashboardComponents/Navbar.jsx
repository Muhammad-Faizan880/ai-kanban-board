import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { logout } from "../../redux/slices/authSlice";

const Navbar = ({ onProfileClick, onMobileMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { taskReminders } = useSelector((state) => state.preferences || { taskReminders: true });
  const [navSearch, setNavSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && navSearch.trim()) {
      navigate(`/myTasks?search=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur md:px-8">

      {/* ================= LEFT ================= */}
      <div className="flex min-w-0 flex-1 items-center gap-4">

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden -ml-1 p-2 rounded-lg text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          title="Open Navigation Menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Mobile Logo */}
        <div className="flex items-center gap-3 lg:hidden">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-text-inverse">
            T
          </div>

          <span className="font-bold">
            TaskFlow
          </span>

        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:flex">

          <div className="relative w-full">

            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search tasks (press Enter)..."
              className="w-full rounded-lg border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-border-focus focus:bg-surface"
            />

          </div>

        </div>

      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
          title="Notifications"
        >
          <BellIcon className="h-5 w-5" />

          {/* Notification dot */}
          {taskReminders && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
          )}
        </button>

        {/* Divider */}
        <div className="mx-1 h-7 w-px bg-border" />

        {/* Profile */}
        <button
          type="button"
          onClick={onProfileClick}
          className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-surface-muted"
        >

          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-text-inverse">
            {firstLetter}
          </div>

          {/* User info */}
          <div className="hidden text-left sm:block">

            <p className="max-w-32 truncate text-sm font-semibold text-text-primary">
              {user?.name || "User"}
            </p>

            <p className="max-w-32 truncate text-xs text-text-muted">
              @{user?.username || "username"}
            </p>

          </div>

          <ChevronDownIcon className="hidden h-4 w-4 text-text-muted sm:block" />

        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition hover:bg-danger-light hover:text-danger"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
        </button>

      </div>

    </header>
  );
};

export default Navbar;