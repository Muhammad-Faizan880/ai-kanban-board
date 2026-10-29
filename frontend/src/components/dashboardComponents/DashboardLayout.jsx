import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SparklesIcon } from "@heroicons/react/24/outline";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProfileDrawer from "../ProfileDrawer";
import AICopilotModal from "./AICopilotModal";
import { fetchTasks } from "../../services/tasks";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasksForCopilot = async () => {
      try {
        const res = await fetchTasks();
        if (res?.tasks) {
          setTasks(res.tasks);
        }
      } catch (err) {
        console.error("DashboardLayout load tasks failed:", err);
      }
    };
    loadTasksForCopilot();
  }, [aiCopilotOpen]);

  return (
    <div className="h-screen w-full max-w-full overflow-hidden bg-background text-text-primary flex">
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
          onOpenAiCopilot={() => setAiCopilotOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
          <Outlet />

          {/* Floating Gemini AI Copilot Trigger */}
          <button
            type="button"
            onClick={() => setAiCopilotOpen(true)}
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-[#AC4B06] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-primary/20 group"
            title="Open Gemini AI Sprint Copilot"
          >
            <SparklesIcon className="h-5 w-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">AI Copilot</span>
          </button>
        </main>
      </div>

      <ProfileDrawer
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {/* Global Gemini AI Sprint Copilot Modal */}
      <AICopilotModal
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
        tasks={tasks}
      />
    </div>
  );
};

export default DashboardLayout;
