import React, { useState } from "react";
import {
  SparklesIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  FireIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { aiSprintCopilotApi } from "../../services/tasks";
import { useSnackbar } from "../../context/SnackbarContext.jsx";

export default function AICopilotModal({ isOpen, onClose, tasks = [] }) {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [activeTab, setActiveTab] = useState("STANDUP");
  const [customPrompt, setCustomPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prepare concise context summary of live tasks
  const buildTasksSummary = () => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "TODO");
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
    const inReview = tasks.filter((t) => t.status === "REVIEW");
    const done = tasks.filter((t) => t.status === "DONE");

    const highPriority = tasks.filter((t) => t.priority === "HIGH");

    return `Total tasks: ${total}
- TODO (${todo.length}): ${todo.slice(0, 5).map((t) => t.title).join(", ") || "None"}
- IN PROGRESS (${inProgress.length}): ${inProgress.slice(0, 5).map((t) => t.title).join(", ") || "None"}
- IN REVIEW (${inReview.length}): ${inReview.slice(0, 5).map((t) => t.title).join(", ") || "None"}
- DONE (${done.length}): ${done.slice(0, 5).map((t) => t.title).join(", ") || "None"}
- High Priority Items: ${highPriority.map((t) => t.title).join(", ") || "None"}`;
  };

  const handleAction = async (actionType, promptText = "") => {
    try {
      setLoading(true);
      setActiveTab(actionType);
      const summary = buildTasksSummary();

      const res = await aiSprintCopilotApi({
        action: actionType,
        prompt: promptText,
        tasksSummary: summary,
      });

      if (res?.reply) {
        setResult(res.reply);
      }
    } catch (err) {
      console.error("AI Copilot request failed:", err);
      showError(err.response?.data?.message || "Gemini AI response failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showSuccess("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim() || loading) return;
    handleAction("CUSTOM", customPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden animate-card-enter">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#AC4B06] text-white shadow-md">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  AI Assistant
                </h3>
                <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Ask questions, get daily progress reports, and organize tasks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions Tabs */}
        <div className="flex items-center gap-2 border-b border-border bg-surface-muted/50 px-4 py-2.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => handleAction("STANDUP")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
              activeTab === "STANDUP"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted border border-border"
            }`}
          >
            <ClipboardDocumentCheckIcon className="h-3.5 w-3.5" />
            Daily Standup
          </button>

          <button
            type="button"
            onClick={() => handleAction("SPRINT_HEALTH")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
              activeTab === "SPRINT_HEALTH"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted border border-border"
            }`}
          >
            <ChartBarIcon className="h-3.5 w-3.5" />
            Sprint Health & Risks
          </button>

          <button
            type="button"
            onClick={() => handleAction("PRIORITIZE")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
              activeTab === "PRIORITIZE"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted border border-border"
            }`}
          >
            <FireIcon className="h-3.5 w-3.5" />
            Smart Prioritize
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[220px] max-h-[50vh] overflow-y-auto p-5 text-sm leading-relaxed text-text-primary">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 text-text-muted">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-semibold text-text-primary">
                Gemini 3.1 Flash is analyzing your Kanban board...
              </p>
              <p className="text-[11px] text-text-muted">
                Synthesizing priorities, delivery risks, and completion velocity
              </p>
            </div>
          ) : result ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  AI Generated Report
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary-light transition"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-success" />
                      <span className="text-success">Copied!</span>
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Render formatted markdown response */}
              <div className="prose prose-sm max-w-none text-text-primary whitespace-pre-wrap leading-relaxed font-sans">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <CpuChipIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary">
                  Ready to assist your sprint
                </h4>
                <p className="text-xs text-text-muted max-w-sm mt-1">
                  Click one of the quick actions above (like <strong>Daily Standup</strong> or <strong>Sprint Health</strong>) or ask a custom question below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Custom Question Prompt Bar */}
        <form
          onSubmit={handleCustomSubmit}
          className="border-t border-border bg-surface p-3 sm:p-4 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask AI anything (e.g. 'How to start this project?' or 'Suggest test cases')..."
              className="w-full rounded-2xl border border-border bg-surface-muted py-2.5 pl-4 pr-10 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={!customPrompt.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-xs transition hover:bg-primary-hover disabled:opacity-50"
            title="Send to AI Assistant"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

