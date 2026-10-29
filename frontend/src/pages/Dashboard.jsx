import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import DashboardHeader from "../components/dashboardComponents/DashboardHeader";
import StatsCards from "../components/dashboardComponents/StatsCards";
import RecentTasks from "../components/dashboardComponents/RecentTasks";
import QuickActions from "../components/dashboardComponents/QuickActions";
import { fetchTasks, createTaskApi } from "../services/tasks";
import { useSnackbar } from "../context/SnackbarContext.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  });

  useEffect(() => {
    const loadDashboardTasks = async () => {
      try {
        const data = await fetchTasks();
        if (data?.tasks) {
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error("Dashboard fetch tasks failed:", err);
      }
    };

    loadDashboardTasks();
  }, []);

  const handleGoToTasks = () => {
    navigate("/myTasks");
  };

  const handleGoToProjects = () => {
    navigate("/projects");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      setCreating(true);
      const res = await createTaskApi(newTask);
      const created = res?.task || { ...newTask, _id: String(Date.now()) };
      setTasks((prev) => [created, ...prev]);
      showSuccess(`Task "${created.title}" created successfully!`);
      setIsCreateModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    } catch (err) {
      console.error("Dashboard create task error:", err);
      showError(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  // Format tasks for RecentTasks
  const formattedRecentTasks = tasks.slice(0, 5).map((t) => ({
    ...t,
    status:
      t.status === "DONE"
        ? "Completed"
        : t.status === "IN_PROGRESS"
        ? "In Progress"
        : t.status === "REVIEW"
        ? "In Review"
        : "Pending",
  }));

  // Calculate live stats
  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const overdue = tasks.filter((t) => t.priority === "HIGH" && t.status !== "DONE").length;

  const dynamicStats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      description: "All active & completed tasks",
      icon: ClipboardDocumentListIcon,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      title: "In Progress",
      value: inProgress,
      description: "Currently being worked on",
      icon: ClockIcon,
      iconBg: "bg-warning-light",
      iconColor: "text-warning",
    },
    {
      title: "Completed",
      value: completed,
      description: "Shipped & finished tasks",
      icon: CheckCircleIcon,
      iconBg: "bg-success-light",
      iconColor: "text-success",
    },
    {
      title: "Priority Attention",
      value: overdue,
      description: "High priority remaining",
      icon: ExclamationTriangleIcon,
      iconBg: "bg-danger-light",
      iconColor: "text-danger",
    },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10">
      <DashboardHeader onCreateTask={() => setIsCreateModalOpen(true)} />

      <StatsCards stats={dynamicStats} />

      <div className="mt-6 sm:mt-8 grid gap-4 xl:grid-cols-3">
        <RecentTasks tasks={formattedRecentTasks} onViewAll={handleGoToTasks} />

        <QuickActions
          onViewTasks={handleGoToTasks}
          onCreateTask={() => setIsCreateModalOpen(true)}
          onCreateProject={handleGoToProjects}
        />
      </div>

      <footer className="mt-8 border-t border-border pt-5 pb-8">
        <div className="flex flex-col justify-between gap-2 text-xs text-text-muted sm:flex-row">
          <p>© 2026 TaskFlow. All rights reserved.</p>
          <p>Stay focused. Ship faster.</p>
        </div>
      </footer>

      {/* ================= CREATE TASK MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-card-enter">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <PlusIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Create New Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTask} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Design Landing Page Hero"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add details, instructions or objectives..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-surface p-3 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oct 30"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTask.title.trim()}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-text-inverse hover:bg-primary-hover shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {creating ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
