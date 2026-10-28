import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const DEMO_PROMPTS = [
  {
    prompt: "Setup Stripe Payment Gateway",
    title: "Setup Stripe Payment Gateway",
    priority: "HIGH",
    description: "Configure Stripe webhook listener and build checkout session flow.",
    subtasks: [
      { title: "Define Stripe API secret in .env", done: true },
      { title: "Implement Checkout Session endpoint", done: true },
      { title: "Handle webhook signature verification", done: false },
    ],
  },
  {
    prompt: "OAuth Login with Google",
    title: "Google OAuth 2.0 Authentication",
    priority: "HIGH",
    description: "Implement secure social sign-in with Google Cloud credentials and JWT issuance.",
    subtasks: [
      { title: "Configure Google Cloud Client ID", done: true },
      { title: "Create backend OAuth callback route", done: true },
      { title: "Build frontend Google sign-in button", done: false },
    ],
  },
  {
    prompt: "Export analytics to PDF",
    title: "Automated PDF Report Generator",
    priority: "MEDIUM",
    description: "Generate clean printable PDF summaries of sprint velocity and completed tasks.",
    subtasks: [
      { title: "Draft print-ready HTML layout", done: true },
      { title: "Implement serverless PDF render service", done: false },
      { title: "Add one-click download trigger", done: false },
    ],
  },
];

const AIAssistantSpotlight = () => {
  const [selectedDemo, setSelectedDemo] = useState(0);
  const current = DEMO_PROMPTS[selectedDemo];

  return (
    <section id="ai-spotlight" className="relative py-16 md:py-24 bg-surface-muted/60 border-y border-border overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-light/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Turn Any Ambitious Goal Into an Actionable Sprint Plan
          </h2>

          <p className="mt-3 text-base md:text-lg text-text-secondary">
            Never stare at a blank Kanban board again. Describe what you want to build in plain English, and TaskFlow's Gemini AI engine will decompose it into structured steps, priorities, and checklists in seconds.
          </p>
        </div>

        {/* Interactive Visual Showcase */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xl">
          {/* Quick Demo Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-border">
            <span className="text-xs font-semibold text-text-muted mr-1">
              Try sample prompts:
            </span>
            {DEMO_PROMPTS.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDemo(idx)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  selectedDemo === idx
                    ? "bg-primary text-text-inverse shadow-xs"
                    : "bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-muted/80"
                }`}
              >
                "{d.prompt}"
              </button>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Prompt Simulation */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface-muted/50 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  What feature do you want to accomplish?
                </span>
                <div className="mt-2 rounded-xl border border-primary/40 bg-surface p-3 text-sm font-semibold text-text-primary shadow-xs">
                  {current.prompt}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-light text-success font-bold">
                  ✓
                </span>
                <span>Structured JSON plan generated in 1.4 seconds</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-primary font-bold">
                  ⚡
                </span>
                <span>Directly syncs to MongoDB Atlas & Kanban columns</span>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-text-inverse shadow-xs transition hover:bg-primary-hover active:scale-95"
                >
                  <span>Try It In Your Workspace</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Real Output Card Preview */}
            <div className="rounded-2xl border border-primary/30 bg-primary-light/15 p-5 shadow-sm space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-text-inverse">
                    AI PROPOSED TASK
                  </span>
                  <span className="rounded-full bg-danger-light text-danger border border-danger/20 px-2 py-0.5 text-[10px] font-bold">
                    {current.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-text-muted">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>2-4 hours</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {current.title}
                </h3>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Subtasks Checklist */}
              <div className="rounded-xl border border-border/80 bg-surface p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-text-primary">
                  <span>Generated Subtasks ({current.subtasks.length}):</span>
                  <span className="text-primary font-semibold">Ready for Sprint</span>
                </div>

                {current.subtasks.map((st, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                    <span
                      className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${
                        st.done
                          ? "bg-primary text-text-inverse border-primary"
                          : "border-border bg-surface"
                      }`}
                    >
                      {st.done ? "✓" : ""}
                    </span>
                    <span className={st.done ? "line-through text-text-muted" : "text-text-primary"}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-text-muted">
                <span>TaskFlow Smart Engine</span>
                <span className="font-semibold text-primary">⚡ 100% Agile Aligned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSpotlight;

