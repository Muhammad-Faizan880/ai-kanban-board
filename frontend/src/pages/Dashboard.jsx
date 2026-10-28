import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import DashboardHeader from "../components/dashboardComponents/DashboardHeader";
import StatsCards from "../components/dashboardComponents/StatsCards";
import RecentTasks from "../components/dashboardComponents/RecentTasks";
import QuickActions from "../components/dashboardComponents/QuickActions";
import { fetchTasks } from "../services/tasks";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

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
    <div className="flex-1 min-h-0 overflow-y-auto px-5 py-8 md:px-8 lg:px-10">
      <DashboardHeader onCreateTask={handleGoToTasks} />

      <StatsCards stats={dynamicStats} />

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <RecentTasks tasks={formattedRecentTasks} onViewAll={handleGoToTasks} />

        <QuickActions
          onViewTasks={handleGoToTasks}
          onCreateTask={handleGoToTasks}
          onCreateProject={handleGoToProjects}
        />
      </div>

      <footer className="mt-8 border-t border-border pt-5 pb-8">
        <div className="flex flex-col justify-between gap-2 text-xs text-text-muted sm:flex-row">
          <p>© 2026 TaskFlow. All rights reserved.</p>
          <p>Stay focused. Ship faster.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
