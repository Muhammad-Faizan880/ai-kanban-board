import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProfileDrawer from "../ProfileDrawer";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-text-primary flex">
      {/* Desktop Persistent Left Sidebar */}
      <Sidebar
        user={user}
        onProfileClick={() => setProfileOpen(true)}
      />

      {/* Mobile Drawer (Sidebar on mobile screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Sidebar Panel */}
          <div className="relative z-10 w-72 max-w-[80vw] bg-surface h-full shadow-2xl flex flex-col animate-card-enter">
            <Sidebar
              isMobile
              user={user}
              onCloseMobile={() => setMobileMenuOpen(false)}
              onProfileClick={() => {
                setMobileMenuOpen(false);
                setProfileOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Viewport Column */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Persistent Top Navbar */}
        <Navbar
          user={user}
          onProfileClick={() => setProfileOpen(true)}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>

      <ProfileDrawer
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
