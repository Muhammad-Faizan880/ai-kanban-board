import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import {
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ListBulletIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ArrowRightIcon,
  XMarkIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import {
  fetchTasks,
  createTaskApi,
  updateTaskStatusApi,
  updateTaskApi,
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

const Projects = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useSnackbar();

  // New Project/Task Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newStatus, setNewStatus] = useState("TODO");
  const [newDueDate, setNewDueDate] = useState(
    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const [subtasksInput, setSubtasksInput] = useState("");

  const showToast = (msg) => showSuccess(msg);
// 1. Fetch exact tasks from backend MongoDB
  const loadWorkspaceTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchTasks();
      if (res?.tasks) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error("Failed to load tasks for Projects page:", err);
      showToast("Failed to fetch live tasks from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceTasks();
  }, []);

  // 2. Calculate Real-Time Metrics directly from the user's tasks
  const totalCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const inReviewCount = tasks.filter((t) => t.status === "REVIEW").length;
  const completedCount = tasks.filter((t) => t.status === "DONE").length;

  const totalSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
  const completedSubtasks = tasks.reduce(
    (acc, t) => acc + (t.subtasks?.filter((s) => s.completed)?.length || 0),
    0
  );
  const overallCompletionRate =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

  // 3. Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter === "ALL") return true;
      return t.status === statusFilter;
    });
  }, [tasks, searchQuery, statusFilter]);

  // 4. Status change handler (Updates DB & syncs with Kanban)
  const handleStatusChange = async (taskId, nextStatus) => {
    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === taskId ? { ...t, status: nextStatus } : t))
    );
    showToast(`Status updated to ${statusBadges[nextStatus]?.label || nextStatus}`);

    try {
      await updateTaskStatusApi(taskId, nextStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Error updating status in database");
      loadWorkspaceTasks();
    }
  };

  // 5. Subtask toggle handler (Updates DB & syncs with Kanban)
  const handleToggleSubtask = async (taskId, subtaskIdx) => {
    const updatedTasks = tasks.map((t) => {
      if ((t._id || t.id) === taskId) {
        const subtasks = [...(t.subtasks || [])];
        if (subtasks[subtaskIdx]) {
          subtasks[subtaskIdx] = {
            ...subtasks[subtaskIdx],
            completed: !subtasks[subtaskIdx].completed,
          };
        }
        return { ...t, subtasks };
      }
      return t;
    });

    setTasks(updatedTasks);

    const target = updatedTasks.find((t) => (t._id || t.id) === taskId);
    if (target?._id) {
      try {
        await updateTaskApi(target._id, { subtasks: target.subtasks });
      } catch (err) {
        console.error("Failed to toggle subtask in DB:", err);
      }
    }
  };

  // 6. Delete handler
  const handleDelete = async (taskId) => {
    setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
    showToast("Project task removed");

    try {
      await deleteTaskApi(taskId);
    } catch (err) {
      console.error("Failed to delete task:", err);
      showToast("Error deleting task");
      loadWorkspaceTasks();
    }
  };

  // 7. Create Task/Project directly in DB
  const handleCreateProjectTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedSubtasks = subtasksInput
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((title) => ({ title, completed: false }));

    const taskPayload = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate || "Sep 30",
      subtasks: parsedSubtasks,
      aiGenerated: false,
    };

    try {
      const res = await createTaskApi(taskPayload);
      if (res?.task) {
        setTasks((prev) => [res.task, ...prev]);
        showToast("New project task created and saved to database!");
      }
      setIsModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setSubtasksInput("");
    } catch (err) {
      console.error("Failed to create task:", err);
      showToast("Failed to create task in DB");
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">
              {totalCount} Total Items in Database
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Projects & Workflows
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Synchronized directly with your live Kanban tasks, MongoDB database, and AI engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/myTasks")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary shadow-xs transition hover:border-primary hover:text-primary"
          >
            <ListBulletIcon className="h-4 w-4 text-primary" />
            Open Kanban Board
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse shadow-xs transition hover:bg-primary-hover active:scale-[0.98]"
          >
            <PlusIcon className="h-4 w-4" />
            New Project Task
          </button>
        </div>
      </div>

      {/* Live Stats Row (Directly from tasks) */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Total Database Tasks */}
        <div className="rounded-2xl border border-border bg-surface p-3.5 sm:p-5 shadow-xs transition hover:border-primary/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Total Tasks
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
              <FolderIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-text-primary">{totalCount}</p>
          <p className="mt-1 text-xs text-text-muted">Live in MongoDB Atlas</p>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-border bg-surface p-3.5 sm:p-5 shadow-xs transition hover:border-warning/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              In Progress
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-light text-warning">
              <ClockIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-text-primary">{inProgressCount}</p>
          <p className="mt-1 text-xs text-text-muted">Active development items</p>
        </div>

        {/* In Review */}
        <div className="rounded-2xl border border-border bg-surface p-3.5 sm:p-5 shadow-xs transition hover:border-info/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              In Review
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-light text-info">
              <EyeIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-text-primary">{inReviewCount}</p>
          <p className="mt-1 text-xs text-text-muted">Pending verification</p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-border bg-surface p-3.5 sm:p-5 shadow-xs transition hover:border-success/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Completed Tasks
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-light text-success">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-text-primary">{completedCount}</p>
          <p className="mt-1 text-xs text-text-muted">
            {overallCompletionRate}% subtasks finished
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search live tasks by title or description..."
            className="w-full rounded-xl border border-border bg-surface-muted py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "ALL", label: "All" },
            { id: "TODO", label: "To Do" },
            { id: "IN_PROGRESS", label: "In Progress" },
            { id: "REVIEW", label: "In Review" },
            { id: "DONE", label: "Done" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? "bg-primary text-text-inverse"
                  : "bg-surface-muted text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Tasks Cards Grid */}
      {loading ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-text-muted">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading live workspace tasks...</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => {
            const subtasks = task.subtasks || [];
            const subtasksDone = subtasks.filter((s) => s.completed).length;
            const progress =
              subtasks.length > 0
                ? Math.round((subtasksDone / subtasks.length) * 100)
                : task.status === "DONE"
                ? 100
                : task.status === "REVIEW"
                ? 75
                : task.status === "IN_PROGRESS"
                ? 50
                : 0;

            const currentStatus = statusBadges[task.status] || statusBadges.TODO;

            return (
              <div
                key={task._id || task.id}
                onClick={() => navigate(`/projects/${task._id || task.id}`)}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          priorityBadges[task.priority] || priorityBadges.MEDIUM
                        }`}
                      >
                        {task.priority}
                      </span>

                      {task.aiGenerated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">
                          <SparklesIcon className="h-3 w-3" />
                          AI Plan
                        </span>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={task.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(task._id || task.id, e.target.value);
                      }}
                      className={`cursor-pointer rounded-lg border px-2 py-0.5 text-xs font-semibold focus:outline-none ${currentStatus.bg}`}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">In Review</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 text-base font-bold text-text-primary transition group-hover:text-primary">
                    {task.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary line-clamp-3">
                    {task.description || "No description provided for this task."}
                  </p>

                  {/* Subtasks Checklist */}
                  {subtasks.length > 0 && (
                    <div className="mt-4 rounded-xl border border-border/60 bg-surface-muted/60 p-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted">
                        <span>
                          Checklist ({subtasksDone}/{subtasks.length})
                        </span>
                        <span className="text-primary font-bold">{progress}%</span>
                      </div>

                      <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {subtasks.map((st, sIdx) => (
                          <label
                            key={sIdx}
                            onClick={(e) => e.stopPropagation()}
                            className="flex cursor-pointer items-start gap-2 text-xs text-text-primary"
                          >
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggleSubtask(task._id || task.id, sIdx);
                              }}
                              className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary accent-primary"
                            />
                            <span
                              className={`leading-tight ${
                                st.completed
                                  ? "text-text-muted line-through"
                                  : "text-text-primary"
                              }`}
                            >
                              {st.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-6 border-t border-border/60 pt-4">
                  {/* Progress Bar */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Task Completion</span>
                    <span className="font-bold text-primary">{progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Date and Delete Action */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>{task.dueDate || "No deadline"}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task._id || task.id);
                      }}
                      title="Delete task"
                      className="rounded-lg p-1.5 text-text-muted transition hover:bg-danger-light hover:text-danger"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${task._id || task.id}`);
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl bg-primary-light py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-text-inverse"
                    >
                      <span>Details</span>
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/myTasks");
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl border border-border bg-surface-muted py-2 text-xs font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                    >
                      <span>Kanban</span>
                      <ListBulletIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <FolderIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-text-primary">
                No tasks found matching filter
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Add a new task or adjust your status search filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-text-inverse hover:bg-primary-hover"
              >
                <ArrowPathIcon className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl animate-card-enter">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <PlusIcon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  Create Project Task
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectTask} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Integrate Stripe Customer Portal"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Task scope and deliverables..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary">
                  Subtasks (one per line)
                </label>
                <textarea
                  rows="3"
                  value={subtasksInput}
                  onChange={(e) => setSubtasksInput(e.target.value)}
                  placeholder="Step 1&#10;Step 2&#10;Step 3"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary">
                  Due Date
                </label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="e.g. Sep 30"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-text-inverse hover:bg-primary-hover shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
