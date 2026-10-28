import React from "react";
import { NavLink } from "react-router-dom";

import {
  Squares2X2Icon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isMobile = false, onCloseMobile, onProfileClick }) => {
  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={
        isMobile
          ? "w-full h-full flex flex-col bg-surface border-r border-border"
          : "hidden w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col"
      }
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-text-inverse shadow-sm">
            T
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">TaskFlow</h1>
            <p className="text-xs text-text-muted">Manage. Focus. Ship.</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary"
            title="Close menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {/* Workspace */}
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Workspace
        </p>

        <div className="space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`
            }
          >
            <Squares2X2Icon className="h-5 w-5" />
            Dashboard
          </NavLink>

          {/* My Tasks */}
          <NavLink
            to="/myTasks"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`
            }
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
            My Tasks
          </NavLink>

          {/* Projects */}
          <NavLink
            to="/projects"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`
            }
          >
            <FolderIcon className="h-5 w-5" />
            Projects
          </NavLink>
        </div>

        {/* Account */}
        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Account
        </p>

        <div className="space-y-1">
          <NavLink
            to="/settings"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`
            }
          >
            <Cog6ToothIcon className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-surface-muted p-3">
          <p className="text-xs font-medium text-text-secondary">TaskFlow</p>
          <p className="mt-1 text-xs text-text-muted">Stay focused. Ship faster.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
