import React from "react";
import {
  PlusIcon,
  ClipboardDocumentCheckIcon,
  FolderPlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const QuickActions = ({
  onCreateTask,
  onViewTasks,
  onCreateProject,
  onOpenAiCopilot,
}) => {
  const actions = [
    {
      title: "Ask AI Assistant",
      description: "Daily report & smart suggestions",
      icon: SparklesIcon,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
      onClick: onOpenAiCopilot,
    },
    {
      title: "Create new task",
      description: "Add something to your list",
      icon: PlusIcon,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
      onClick: onCreateTask,
    },
    {
      title: "View my tasks",
      description: "See all your tasks",
      icon: ClipboardDocumentCheckIcon,
      iconBg: "bg-info-light",
      iconColor: "text-info",
      onClick: onViewTasks,
    },
    {
      title: "Create project",
      description: "Organize your work",
      icon: FolderPlusIcon,
      iconBg: "bg-success-light",
      iconColor: "text-success",
      onClick: onCreateProject,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface">

      {/* Header */}
      <div className="border-b border-border px-4 sm:px-5 py-3 sm:py-4">
        <h2 className="font-semibold">
          Quick Actions
        </h2>

        <p className="mt-0.5 text-xs text-text-muted">
          Get things done faster
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2 p-3 sm:p-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition hover:border-primary hover:bg-primary-light"
            >
              {/* Icon */}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.iconBg} ${action.iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </span>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {action.title}
                </p>

                <p className="text-xs text-text-muted">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default QuickActions;