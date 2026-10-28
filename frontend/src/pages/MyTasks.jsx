"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CalendarDaysIcon,
  Squares2X2Icon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ArrowsRightLeftIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  fetchTasks,
  createTaskApi,
  updateTaskStatusApi,
  updateTaskApi,
  deleteTaskApi,
  generateAITaskBreakdownApi,
} from "../services/tasks";

const COLUMN_CONFIG = [
  {
    id: "TODO",
    title: "TODO",
    icon: Squares2X2Icon,
    iconColor: "text-primary",
    badgeBg: "bg-primary-light",
    badgeText: "text-primary",
  },
  {
    id: "IN_PROGRESS",
    title: "IN PROGRESS",
    icon: ClockIcon,
    iconColor: "text-warning",
    badgeBg: "bg-warning-light",
    badgeText: "text-warning",
  },
  {
    id: "REVIEW",
    title: "IN REVIEW",
    icon: EyeIcon,
    iconColor: "text-info",
    badgeBg: "bg-info-light",
    badgeText: "text-info",
  },
  {
    id: "DONE",
    title: "DONE",
    icon: CheckCircleIcon,
    iconColor: "text-success",
    badgeBg: "bg-success-light",
    badgeText: "text-success",
  },
];

const priorityStyles = {
  HIGH: "bg-danger-light text-danger border border-danger/20",
  MEDIUM: "bg-warning-light text-warning border border-warning/20",
  LOW: "bg-success-light text-success border border-success/20",
};

export default function MyTasks() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { aiAutoSuggestions } = useSelector((state) => state.preferences || { aiAutoSuggestions: true });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearch(query);
    }
    if (searchParams.get("create") === "true") {
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  // Kanban Horizontal Board Ref for Wheel Navigation
  const boardRef = useRef(null);

  // Drag and Drop States
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);

  const { showSnackbar, showSuccess, showError } = useSnackbar();

  // Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // AI Generation States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Manual Task Creation State
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  });

  // Load Tasks from Backend on Mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks from backend:", err);
      showToast("Could not sync with backend", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => showSnackbar(message, type);
// ---------------- Horizontal Wheel Scroll Handler ----------------
  const handleBoardWheel = (e) => {
    if (boardRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const cardList = e.target.closest(".cards-scroll-container");
      if (cardList) {
        const atTop = cardList.scrollTop === 0 && e.deltaY < 0;
        const atBottom =
          cardList.scrollHeight - cardList.scrollTop <= cardList.clientHeight + 1 &&
          e.deltaY > 0;

        if (!atTop && !atBottom) {
          return;
        }
      }

      boardRef.current.scrollLeft += e.deltaY;
    }
  };

  // ---------------- Drag and Drop Handlers ----------------
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task._id || String(task.id));
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumnId === columnId) {
      setDragOverColumnId(null);
    }
  };

  const handleDrop = async (e, destinationColumnId) => {
    e.preventDefault();
    setDragOverColumnId(null);

    if (!draggedTask) return;

    const sourceStatus = draggedTask.status;
    const taskId = draggedTask._id || draggedTask.id;

    if (sourceStatus === destinationColumnId) {
      setDraggedTask(null);
      return;
    }

    // 1. Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        (t._id || t.id) === taskId ? { ...t, status: destinationColumnId } : t
      )
    );

    const friendlyStatusNames = {
      TODO: "TODO",
      IN_PROGRESS: "IN PROGRESS",
      REVIEW: "IN REVIEW",
      DONE: "DONE",
    };

    const targetTitle = friendlyStatusNames[destinationColumnId];
    showToast(
      `"${draggedTask.title}" moved to ${targetTitle}`,
      destinationColumnId === "DONE" ? "success" : "info"
    );

    setDraggedTask(null);

    // 2. Persist to Backend API
    if (draggedTask._id) {
      try {
        await updateTaskStatusApi(draggedTask._id, destinationColumnId);
      } catch (err) {
        console.error("Failed to sync task status to backend:", err);
        showToast("Failed to save changes to server", "error");
        loadTasks();
      }
    }
  };

  // ---------------- Subtask Completion Toggle ----------------
  const handleToggleSubtask = async (taskId, subtaskIndex) => {
    const updated = tasks.map((t) => {
      if ((t._id || t.id) === taskId) {
        const subtasks = [...(t.subtasks || [])];
        if (subtasks[subtaskIndex]) {
          subtasks[subtaskIndex] = {
            ...subtasks[subtaskIndex],
            completed: !subtasks[subtaskIndex].completed,
          };
        }
        return { ...t, subtasks };
      }
      return t;
    });

    setTasks(updated);

    const target = updated.find((t) => (t._id || t.id) === taskId);
    if (target && target._id) {
      try {
        await updateTaskApi(target._id, { subtasks: target.subtasks });
      } catch (err) {
        console.error("Failed to update subtask in backend:", err);
      }
    }
  };

  // ---------------- Delete Task ----------------
  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((t) => (t._id || t.id) === taskId);
    setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));

    showToast("Task deleted", "info");

    if (taskToDelete && taskToDelete._id) {
      try {
        await deleteTaskApi(taskToDelete._id);
      } catch (err) {
        console.error("Failed to delete task from backend:", err);
      }
    }
  };

  // ---------------- AI Breakdown Submission ----------------
  const handleGenerateAi = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    try {
      setAiLoading(true);
      const data = await generateAITaskBreakdownApi(aiPrompt);
      if (data?.breakdown) {
        setAiResult(data.breakdown);
      }
    } catch (err) {
      console.error("AI breakdown request failed:", err);
      showToast("AI generation failed. Please try again.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAiTaskToBoard = async () => {
    if (!aiResult) return;

    const taskPayload = {
      title: aiResult.title,
      description: aiResult.description,
      priority: aiResult.priority || "MEDIUM",
      status: "TODO",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      subtasks: aiResult.subtasks || [],
      aiGenerated: true,
    };

    try {
      const res = await createTaskApi(taskPayload);
      if (res?.task) {
        setTasks((prev) => [res.task, ...prev]);
      } else {
        setTasks((prev) => [{ ...taskPayload, _id: String(Date.now()) }, ...prev]);
      }
      showToast("AI Task added to TODO column", "success");
      setIsAiModalOpen(false);
      setAiPrompt("");
      setAiResult(null);
    } catch (err) {
      console.error("Failed to save AI task:", err);
      setTasks((prev) => [{ ...taskPayload, _id: String(Date.now()) }, ...prev]);
      showToast("AI Task added to board", "success");
      setIsAiModalOpen(false);
      setAiPrompt("");
      setAiResult(null);
    }
  };

  // ---------------- Manual Task Creation ----------------
  const handleCreateManualTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const res = await createTaskApi(newTask);
      if (res?.task) {
        setTasks((prev) => [res.task, ...prev]);
      } else {
        setTasks((prev) => [{ ...newTask, _id: String(Date.now()) }, ...prev]);
      }
      showToast(`Task created in ${newTask.status}`, "success");
      setIsCreateModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    } catch (err) {
      console.error("Failed to create manual task:", err);
      setTasks((prev) => [{ ...newTask, _id: String(Date.now()) }, ...prev]);
      showToast("Task created", "success");
      setIsCreateModalOpen(false);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

    const matchesPriority =
      priorityFilter === "ALL" || t.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-background">

      {/* ----------------- FIXED TOP TOOLBAR (DOES NOT SCROLL) ----------------- */}
      <div className="shrink-0 border-b border-border bg-surface/70 px-6 py-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title & Board Stats */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">
                  • {tasks.length} total tasks
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-0.5">
                My Tasks
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative w-48 sm:w-60">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search board..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-xs text-text-primary outline-none transition placeholder:text-text-muted focus:border-border-focus focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Priority Filter Chips */}
            <div className="flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs">
              {["ALL", "HIGH", "MED", "LOW"].map((p) => {
                const mapPriority = p === "MED" ? "MEDIUM" : p;
                const active =
                  p === "MED"
                    ? priorityFilter === "MEDIUM"
                    : priorityFilter === p;

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityFilter(mapPriority)}
                    className={`rounded-md px-2.5 py-1 font-semibold transition-all duration-200 text-[11px] ${
                      active
                        ? "bg-primary text-text-inverse shadow-xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadTasks}
              title="Refresh board"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-all duration-200"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* AI Task Generator Button */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-3.5 text-xs font-semibold text-text-inverse shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <SparklesIcon className="h-4 w-4" />
              AI Assistant
            </button>

            {/* Manual Create Task Button */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 text-xs font-semibold text-text-primary shadow-xs transition-all duration-200 hover:bg-surface-muted hover:border-border-focus"
            >
              <PlusIcon className="h-4 w-4 text-primary" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- KANBAN HORIZONTAL BOARD CONTAINER ----------------- */}
      <div
        ref={boardRef}
        onWheel={handleBoardWheel}
        className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden p-6 kanban-scrollbar select-none"
      >
        <div className="flex gap-4 items-stretch h-full min-w-max pr-6">
          {COLUMN_CONFIG.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            const isDragOver = dragOverColumnId === col.id;
            const ColumnIcon = col.icon;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-[340px] flex-shrink-0 flex flex-col h-full max-h-full rounded-2xl border transition-all duration-300 ease-out overflow-hidden ${
                  isDragOver
                    ? "border-2 border-dashed border-primary bg-primary-light/40 shadow-xl ring-4 ring-primary/10 scale-[1.01]"
                    : "border-border bg-surface-muted/50 hover:border-border-focus/40"
                }`}
              >
                {/* Column Header (Fixed within Column) */}
                <div className="shrink-0 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-xs">
                  <div className="flex items-center gap-2.5">
                    <ColumnIcon className={`h-4 w-4 ${col.iconColor}`} />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      {col.title}
                    </h2>
                  </div>

                  <span
                    className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-bold shadow-2xs transition-all duration-200 ${col.badgeBg} ${col.badgeText}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards List (Scrolls VERTICALLY inside this column) */}
                <div className="cards-scroll-container flex-1 min-h-0 overflow-y-auto p-3 space-y-3 kanban-scrollbar">
                  {/* Visual Drop Target Highlight ONLY when dragging over */}
                  {isDragOver && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary-light/60 py-4 text-xs font-bold text-primary animate-pulse transition-all duration-200">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Drop to move to {col.title}</span>
                    </div>
                  )}

                  {columnTasks.map((task) => {
                    const isBeingDragged =
                      draggedTask &&
                      (draggedTask._id || draggedTask.id) === (task._id || task.id);

                    const completedSubtasks =
                      task.subtasks?.filter((s) => s.completed).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;

                    return (
                      <div
                        key={task._id || task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        className={`group relative cursor-grab rounded-xl border border-border bg-surface p-4 shadow-xs kanban-card-transition animate-card-enter hover:-translate-y-1 hover:shadow-md hover:border-primary/50 active:cursor-grabbing ${
                          isBeingDragged
                            ? "opacity-25 scale-95 border-2 border-primary ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        {/* Task Card Header */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="space-y-1">
                            {task.aiGenerated && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-primary-light px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                <SparklesIcon className="h-3 w-3" />
                                AI Generated
                              </span>
                            )}

                            <h3 className="text-sm font-semibold text-text-primary leading-snug">
                              {task.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition-all duration-200 ${
                                priorityStyles[task.priority] || priorityStyles.MEDIUM
                              }`}
                            >
                              {task.priority}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/${task._id || task.id}`);
                              }}
                              title="View full details"
                              className="rounded-md p-1 text-text-muted opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary-light hover:text-primary"
                            >
                              <EyeIcon className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task._id || task.id)}
                              title="Delete task"
                              className="rounded-md p-1 text-text-muted opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-danger-light hover:text-danger"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Task Description */}
                        {task.description && (
                          <p className="mt-2 text-xs leading-relaxed text-text-secondary line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Checklist Subtasks */}
                        {totalSubtasks > 0 && (
                          <div className="mt-3 rounded-lg border border-border/60 bg-surface-muted/60 p-2 transition-all duration-200">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-text-secondary mb-1">
                              <span className="flex items-center gap-1">
                                <CheckCircleIcon className="h-3 w-3 text-primary" />
                                Checklist ({completedSubtasks}/{totalSubtasks})
                              </span>
                              <span className="text-[10px] text-text-muted">
                                {Math.round((completedSubtasks / totalSubtasks) * 100)}%
                              </span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="h-1 w-full overflow-hidden rounded-full bg-border/60 mb-1.5">
                              <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{
                                  width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                                }}
                              />
                            </div>

                            {/* Subtask list */}
                            <div className="space-y-1">
                              {task.subtasks.map((st, sIndex) => (
                                <label
                                  key={sIndex}
                                  className="flex items-center gap-2 cursor-pointer text-[11px] text-text-secondary hover:text-text-primary transition-colors duration-150"
                                >
                                  <input
                                    type="checkbox"
                                    checked={st.completed}
                                    onChange={() =>
                                      handleToggleSubtask(task._id || task.id, sIndex)
                                    }
                                    className="h-3 w-3 rounded border-border text-primary focus:ring-primary transition-all duration-150"
                                  />
                                  <span
                                    className={`truncate transition-all duration-150 ${
                                      st.completed ? "line-through text-text-muted" : ""
                                    }`}
                                  >
                                    {st.title}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Card Footer */}
                        <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-border/40 text-[12px] text-text-muted">
                          <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-3.5 w-3.5" />
                            <span>{task.dueDate}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-medium text-primary">
                            <ArrowsRightLeftIcon className="h-3 w-3" />
                            <span>Drag card</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Column Footer (Fixed Button) */}
                <div className="shrink-0 p-3 pt-2 border-t border-border/60 bg-surface/50">
                  <button
                    type="button"
                    onClick={() => {
                      setNewTask((prev) => ({ ...prev, status: col.id }));
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/40 bg-surface py-2 text-xs font-semibold text-primary transition-all duration-200 hover:border-primary hover:bg-primary-light/50"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    Add card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------- AI TASK GENERATOR MODAL ----------------- */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-card-enter">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-text-inverse shadow-xs">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    AI Task Decomposition
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Describe any feature or goal. AI will turn it into structured subtasks.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleGenerateAi} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wider">
                  What feature or task do you want to accomplish?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Integrate Stripe payment gateway with webhook verification and checkout..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-3 text-sm text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-primary-light placeholder:text-text-muted transition-all"
                />
              </div>

              {/* Quick Prompt Ideas (Real-time reactive to Settings preference) */}
              {aiAutoSuggestions ? (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "OAuth Login with Google",
                    "Dark Mode Theme Switcher",
                    "Export analytics to PDF",
                  ].map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => setAiPrompt(idea)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary hover:text-primary transition-all duration-200"
                    >
                      <PlusIcon className="h-3 w-3" />
                      {idea}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-text-muted italic">
                  Quick suggestions are disabled in Settings.
                </p>
              )}

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-text-inverse transition-all duration-200 hover:bg-primary-hover disabled:opacity-60 shadow-sm"
              >
                {aiLoading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    AI is analyzing and decomposing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4" />
                    Generate Plan with AI
                  </>
                )}
              </button>
            </form>

            {/* AI Result Card */}
            {aiResult && (
              <div className="mt-5 rounded-2xl border border-primary/40 bg-primary-light/20 p-4 animate-card-enter">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-md bg-primary text-text-inverse px-2 py-0.5 text-[10px] font-bold">
                      PROPOSED TASK
                    </span>
                    <h4 className="mt-1 text-base font-bold text-text-primary">
                      {aiResult.title}
                    </h4>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      priorityStyles[aiResult.priority] || priorityStyles.MEDIUM
                    }`}
                  >
                    {aiResult.priority}
                  </span>
                </div>

                <p className="mt-2 text-xs text-text-secondary">
                  {aiResult.description}
                </p>

                {/* Subtasks */}
                {aiResult.subtasks?.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-border/40 pt-2.5">
                    <p className="text-xs font-bold text-text-primary">
                      Generated Subtasks ({aiResult.subtasks.length}):
                    </p>
                    {aiResult.subtasks.map((st, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-text-secondary"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{st.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddAiTaskToBoard}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-text-inverse shadow-sm transition-all duration-200 hover:bg-primary-hover"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add to Kanban Board (TODO)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- MANUAL CREATE TASK MODAL ----------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-card-enter">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Create New Task</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Dashboard Components"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-border-focus transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or notes..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-surface p-3 text-sm text-text-primary outline-none focus:border-border-focus transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-border-focus transition-all"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-border-focus transition-all"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="REVIEW">IN REVIEW</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-text-inverse hover:bg-primary-hover shadow-xs transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
