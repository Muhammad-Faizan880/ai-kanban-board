import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import { logout } from "../../redux/slices/authSlice";

const Navbar = ({ onProfileClick, onMobileMenuToggle, onOpenAiCopilot }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

 

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 md:h-20 items-center justify-between border-b border-border bg-surface/95 px-3.5 sm:px-5 md:px-8 backdrop-blur">

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

      

      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Ask AI Quick Button */}
        <button
          type="button"
          onClick={onOpenAiCopilot}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[#AC4B06] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          title="Ask AI Assistant"
        >
          <SparklesIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

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

            <p className="max-w-52 md:max-w-64 truncate text-sm font-semibold text-text-primary">
              {user?.name || "User"}
            </p>

            <p className="max-w-52 md:max-w-64 truncate text-xs text-text-muted">
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