import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ListBulletIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import {
  fetchTasks,
  fetchTaskById,
  updateTaskApi,
  updateTaskStatusApi,
  deleteTaskApi,
} from "../services/tasks";

const priorityBadges = {
  HIGH: "bg-danger-light text-danger border-danger/20",
  MEDIUM: "bg-warning-light text-warning border-warning/20",
  LOW: "bg-success-light text-success border-success/20",
};

const statusBadges = {
  TODO: { label: "To Do", bg: "bg-surface-muted text-text-secondary border-border" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-warning-light text-warning border-warning/30" },
  REVIEW: { label: "In Review", bg: "bg-info-light text-info border-info/30" },
  DONE: { label: "Done", bg: "bg-success-light text-success border-success/30" },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentTask, setCurrentTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const { showSuccess, showError } = useSnackbar();
  const [taskFilter, setTaskFilter] = useState("ALL");

  const showToast = (msg) => showSuccess(msg);

  // Load single task and workspace tasks with smooth instant switching
  useEffect(() => {
    if (!id) return;

    // 1. Instant optimistic switch if task already exists in allTasks cache (0ms, 0 glitch)
    const cachedTask = allTasks.find((t) => t._id === id);
    if (cachedTask) {
      setCurrentTask(cachedTask);
    }

    const loadDetails = async () => {
      // Only show full-screen loader on initial mount if no task data exists yet
      if (!cachedTask && !currentTask) {
        setInitialLoading(true);
      }

      try {
        const promises = [fetchTaskById(id)];
        if (allTasks.length === 0) {
          promises.push(fetchTasks());
        }

        const [taskRes, allRes] = await Promise.all(promises);

        if (taskRes?.task) {
          setCurrentTask(taskRes.task);
        }
        if (allRes?.tasks) {
          setAllTasks(allRes.tasks);
        }
      } catch (err) {
        console.error("Failed to load task details:", err);
        if (!cachedTask && !currentTask) {
          showToast("Error loading task details");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (initialLoading && !currentTask) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="flex-1 p-8">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <h2 className="text-lg font-bold text-text-primary">Task not found</h2>
          <p className="mt-1 text-sm text-text-muted">
            The project task you are looking for does not exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-text-inverse hover:bg-primary-hover"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const subtasks = currentTask.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const progress =
    subtasks.length > 0
      ? Math.round((completedSubtasks / subtasks.length) * 100)
      : currentTask.status === "DONE"
      ? 100
      : currentTask.status === "REVIEW"
      ? 75
      : currentTask.status === "IN_PROGRESS"
      ? 50
      : 0;

  // 1. Toggle Subtask completion
  const handleToggleSubtask = async (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      completed: !updatedSubtasks[index].completed,
    };

    const updatedTask = { ...currentTask, subtasks: updatedSubtasks };
    setCurrentTask(updatedTask);

    // Sync allTasks list in state
    setAllTasks((prev) =>
      prev.map((t) => (t._id === currentTask._id ? updatedTask : t))
    );

    try {
      await updateTaskApi(currentTask._id, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error("Failed to update subtask:", err);
      showToast("Failed to save subtask update");
    }
  };

  // 2. Add New Subtask
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const updatedSubtasks = [
      ...subtasks,
      { title: newSubtaskTitle.trim(), completed: false },
    ];

    const updatedTask = { ...currentTask, subtasks: updatedSubtasks };
    setCurrentTask(updatedTask);
    setNewSubtaskTitle("");

    setAllTasks((prev) =>
      prev.map((t) => (t._id === currentTask._id ? updatedTask : t))
    );

    try {
      await updateTaskApi(currentTask._id, { subtasks: updatedSubtasks });
      showToast("Subtask added");
    } catch (err) {
      console.error("Failed to add subtask:", err);
      showToast("Failed to add subtask");
    }
  };

  // 3. Remove Subtask
  const handleRemoveSubtask = async (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    const updatedTask = { ...currentTask, subtasks: updatedSubtasks };
    setCurrentTask(updatedTask);

    setAllTasks((prev) =>
      prev.map((t) => (t._id === currentTask._id ? updatedTask : t))
    );

    try {
      await updateTaskApi(currentTask._id, { subtasks: updatedSubtasks });
      showToast("Subtask removed");
    } catch (err) {
      console.error("Failed to remove subtask:", err);
    }
  };

  // 4. Change Status
  const handleStatusChange = async (newStatus) => {
    const updatedTask = { ...currentTask, status: newStatus };
    setCurrentTask(updatedTask);

    setAllTasks((prev) =>
      prev.map((t) => (t._id === currentTask._id ? updatedTask : t))
    );

    showToast(`Status updated to ${statusBadges[newStatus]?.label}`);

    try {
      await updateTaskStatusApi(currentTask._id, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Failed to update status");
    }
  };

  // 5. Change Priority
  const handlePriorityChange = async (newPriority) => {
    const updatedTask = { ...currentTask, priority: newPriority };
    setCurrentTask(updatedTask);

    setAllTasks((prev) =>
      prev.map((t) => (t._id === currentTask._id ? updatedTask : t))
    );

    try {
      await updateTaskApi(currentTask._id, { priority: newPriority });
      showToast(`Priority set to ${newPriority}`);
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  // 6. Delete Task
  const handleDeleteCurrent = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTaskApi(currentTask._id);
      navigate("/projects");
    } catch (err) {
      console.error("Failed to delete task:", err);
      showToast("Error deleting task");
    }
  };

  // Filter sidebar task list
  const filteredSidebarTasks = allTasks.filter((t) => {
    if (taskFilter === "ALL") return true;
    return t.status === taskFilter;
  });

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10">

      {/* Top Navigation Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 sm:pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/projects")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition hover:border-primary hover:text-primary"
            title="Back to Projects"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Link to="/projects" className="hover:text-primary hover:underline">
                Projects
              </Link>
              <span>/</span>
              <span className="font-semibold text-text-primary truncate max-w-xs sm:max-w-md">
                {currentTask.title}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Task Details
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/myTasks")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary shadow-xs transition hover:border-primary hover:text-primary"
          >
            <ListBulletIcon className="h-4 w-4 text-primary" />
            Open in Kanban
          </button>

          <button
            onClick={handleDeleteCurrent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger-light px-3.5 py-2 text-xs font-semibold text-danger transition hover:bg-danger hover:text-text-inverse"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Details on Left, All Tasks on Right */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Main Task Overview & Subtasks */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Card */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={currentTask.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className={`cursor-pointer rounded-lg border px-3 py-1 text-xs font-bold focus:outline-none ${
                    priorityBadges[currentTask.priority] || priorityBadges.MEDIUM
                  }`}
                >
                  <option value="HIGH">HIGH PRIORITY</option>
                  <option value="MEDIUM">MEDIUM PRIORITY</option>
                  <option value="LOW">LOW PRIORITY</option>
                </select>

                {currentTask.aiGenerated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    AI Decomposition
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Status:</span>
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`cursor-pointer rounded-xl border px-3.5 py-1.5 text-xs font-bold focus:outline-none ${
                    statusBadges[currentTask.status]?.bg || statusBadges.TODO.bg
                  }`}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            {/* Task Title */}
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-text-primary">
              {currentTask.title}
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
              {currentTask.description || "No description provided for this task."}
            </p>

            {/* Meta Info */}
            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-border pt-4 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-4 w-4 text-primary" />
                <span>Due Date: <strong className="text-text-primary">{currentTask.dueDate || "N/A"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-primary" />
                <span>Status: <strong className="text-text-primary">{statusBadges[currentTask.status]?.label}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="h-4 w-4 text-primary" />
                <span>Completed: <strong className="text-text-primary">{progress}%</strong></span>
              </div>
            </div>
          </div>

          {/* Subtasks / Checklist Card */}
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Subtask Checklist ({completedSubtasks} of {subtasks.length} Completed)
                </h3>
                <p className="text-xs text-text-muted">
                  Check off items as you make progress. Updates automatically in Kanban.
                </p>
              </div>
              <span className="text-base font-bold text-primary">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="mt-6 space-y-2.5">
              {subtasks.map((st, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-xl border border-border/80 bg-surface px-4 py-3 transition hover:border-primary/50 hover:bg-surface-muted/40"
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(index)}
                      className="h-4 w-4 rounded border-border text-primary accent-primary"
                    />
                    <span
                      className={`text-sm leading-normal transition ${
                        st.completed
                          ? "text-text-muted line-through"
                          : "font-medium text-text-primary"
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>

                  <button
                    onClick={() => handleRemoveSubtask(index)}
                    className="opacity-0 transition group-hover:opacity-100 p-1 text-text-muted hover:text-danger"
                    title="Remove item"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {subtasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-text-muted">
                  No subtasks added yet. Add steps below to break down this work.
                </div>
              )}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a new step or deliverable..."
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-text-inverse hover:bg-primary-hover shadow-xs active:scale-95"
              >
                <PlusIcon className="h-4 w-4" />
                Add Step
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: All Workspace Tasks List */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  All Tasks ({allTasks.length})
                </h3>
                <p className="text-xs text-text-muted">
                  Switch between workspace tasks
                </p>
              </div>

              <button
                onClick={() => navigate("/myTasks")}
                className="rounded-lg bg-surface-muted p-1.5 text-text-muted hover:text-primary"
                title="Open Kanban Board"
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Filter */}
            <div className="mt-4 flex gap-1 overflow-x-auto border-b border-border pb-3">
              {[
                { id: "ALL", label: "All" },
                { id: "TODO", label: "To Do" },
                { id: "IN_PROGRESS", label: "Active" },
                { id: "DONE", label: "Done" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTaskFilter(f.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                    taskFilter === f.id
                      ? "bg-primary text-text-inverse"
                      : "text-text-secondary hover:bg-surface-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="mt-4 space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredSidebarTasks.map((t) => {
                const isCurrent = t._id === currentTask._id;
                const tSubtasks = t.subtasks || [];
                const tDone = tSubtasks.filter((s) => s.completed).length;

                return (
                  <div
                    key={t._id}
                    onClick={() => {
                      if (t._id !== currentTask?._id) {
                        setCurrentTask(t);
                        navigate(`/projects/${t._id}`);
                      }
                    }}
                    className={`cursor-pointer rounded-xl border p-3.5 transition ${
                      isCurrent
                        ? "border-primary bg-primary-light/40 shadow-xs"
                        : "border-border/80 bg-surface hover:border-primary/50 hover:bg-surface-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          priorityBadges[t.priority] || priorityBadges.MEDIUM
                        }`}
                      >
                        {t.priority}
                      </span>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                          statusBadges[t.status]?.bg || statusBadges.TODO.bg
                        }`}
                      >
                        {statusBadges[t.status]?.label || t.status}
                      </span>
                    </div>

                    <h4
                      className={`mt-2 text-xs font-bold leading-tight line-clamp-2 ${
                        isCurrent ? "text-primary" : "text-text-primary"
                      }`}
                    >
                      {t.title}
                    </h4>

                    {tSubtasks.length > 0 && (
                      <p className="mt-1.5 text-[12px] text-text-muted">
                        {tDone}/{tSubtasks.length} steps completed
                      </p>
                    )}
                  </div>
                );
              })}

              {filteredSidebarTasks.length === 0 && (
                <div className="py-8 text-center text-xs text-text-muted">
                  No tasks found in this view.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

