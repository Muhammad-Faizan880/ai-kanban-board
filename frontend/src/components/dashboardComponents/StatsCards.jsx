import React from "react";

import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const StatsCards = ({ stats = [] }) => {
  const defaultStats = [
    {
      title: "Total Tasks",
      value: 0,
      description: "All your tasks",
      icon: ClipboardDocumentListIcon,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      title: "In Progress",
      value: 0,
      description: "Currently working",
      icon: ClockIcon,
      iconBg: "bg-info-light",
      iconColor: "text-info",
    },
    {
      title: "Completed",
      value: 0,
      description: "Tasks completed",
      icon: CheckCircleIcon,
      iconBg: "bg-success-light",
      iconColor: "text-success",
    },
    {
      title: "Overdue",
      value: 0,
      description: "Need your attention",
      icon: ExclamationTriangleIcon,
      iconBg: "bg-danger-light",
      iconColor: "text-danger",
    },
  ];

  const cards = stats.length ? stats : defaultStats;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>

            </div>

            <p className="mt-3 text-xs text-text-muted">
              {stat.description}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default StatsCards;