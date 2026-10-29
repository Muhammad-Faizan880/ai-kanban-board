import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const RecentTasks = ({ tasks = [], onViewAll }) => {
  const navigate = useNavigate();
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success-light text-success";

      case "In Progress":
        return "bg-info-light text-info";

      case "Pending":
        return "bg-warning-light text-warning";

      case "Overdue":
        return "bg-danger-light text-danger";

      default:
        return "bg-surface-muted text-text-secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return CheckCircleIcon;

      case "In Progress":
        return ClockIcon;

      case "Overdue":
        return ExclamationCircleIcon;

      default:
        return ClockIcon;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface xl:col-span-2">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-5 py-3 sm:py-4">

        <div>
          <h2 className="font-semibold">
            Recent Tasks
          </h2>

          <p className="mt-0.5 text-xs text-text-muted">
            Your latest activity
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary-hover"
        >
          View all

          <ArrowRightIcon className="h-4 w-4" />
        </button>

      </div>

      {/* Tasks */}
      {tasks.length > 0 ? (
        <div className="divide-y divide-border">

          {tasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status);

            return (
              <div
                key={task._id || task.id}
                onClick={() => navigate(`/projects/${task._id || task.id}`)}
                className="flex cursor-pointer flex-col gap-3 px-4 sm:px-5 py-3 sm:py-4 transition hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between group"
              >

                {/* Task Info */}
                <div className="flex min-w-0 items-start gap-3">

                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-semibold text-text-primary transition group-hover:text-primary">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs text-text-muted">
                      {task.project?.name || task.project || "No project"}
                      {" · "}
                      {task.dueDate || task.date || "No due date"}
                    </p>

                  </div>

                </div>

                {/* Status + Priority */}
                <div className="flex items-center gap-3 pl-11 sm:pl-0">

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  <span className="text-xs font-medium text-text-muted">
                    {task.priority}
                  </span>

                </div>

              </div>
            );
          })}

        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <CheckCircleIcon className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-sm font-semibold">
            No tasks yet
          </h3>

          <p className="mt-1 max-w-xs text-xs text-text-muted">
            Create your first task and start organizing your work.
          </p>

        </div>
      )}

    </div>
  );
};

export default RecentTasks;