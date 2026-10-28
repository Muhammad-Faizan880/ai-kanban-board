import React from "react";

const DashboardPreview = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[460px]">

      {/* Background glow */}
      <div className="absolute inset-0 bg-primary-light/20 blur-3xl rounded-full" />

      {/* Main canvas */}
      <div
        className="
          absolute inset-0
          bg-surface/90
          backdrop-blur-sm
          border border-border
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* Subtle grid */}
        <div
          className="
            absolute inset-0 opacity-40
            bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)]
            bg-[size:32px_32px]
          "
        />

        {/* Header */}
        <div className="relative z-10 h-14 px-5 flex items-center justify-between border-b border-border bg-surface/90">

          <div className="flex items-center gap-3">

            <div className="w-8 h-8 rounded-lg bg-primary text-text-inverse flex items-center justify-center font-bold text-sm shadow-sm">
              T
            </div>

            <div>
              <p className="text-xs font-semibold text-text-primary">
                TaskFlow Workspace
              </p>

              <p className="text-[9px] text-text-muted">
                Product Development
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[9px] text-text-secondary">
                All systems active
              </span>
            </div>

            <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[9px] font-bold">
              JD
            </div>

          </div>

        </div>

        {/* Diagram Area */}
        <div className="relative h-[calc(100%-56px)]">

          {/* Connection lines */}

          <div className="absolute left-[25%] top-[35%] w-[18%] h-px bg-border">
            <span className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-primary animate-flow-right" />
          </div>

          <div className="absolute left-[57%] top-[35%] w-[18%] h-px bg-border">
            <span className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-primary animate-flow-right" />
          </div>

          <div className="absolute left-1/2 top-[43%] h-[18%] w-px bg-border" />

          <div className="absolute left-[35%] top-[60%] w-[15%] h-px bg-border rotate-[20deg]" />

          <div className="absolute left-[50%] top-[60%] w-[15%] h-px bg-border -rotate-[20deg]" />

          {/* LEFT TASK CARD */}

          <div className="absolute left-[5%] top-[21%] w-36 animate-float-slow">

            <div className="bg-surface border border-border rounded-xl shadow-lg p-3">

              <div className="flex items-center justify-between mb-3">

                <div className="flex items-center gap-2">

                  <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                    ✓
                  </div>

                  <span className="text-[9px] text-text-muted">
                    Tasks
                  </span>

                </div>

                <span className="text-[9px] font-semibold text-primary">
                  48
                </span>

              </div>

              <div className="space-y-2">

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded border border-border bg-primary" />
                  <span className="text-[9px] text-text-secondary">
                    Landing page
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded border border-border" />
                  <span className="text-[9px] text-text-secondary">
                    API integration
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded border border-border" />
                  <span className="text-[9px] text-text-secondary">
                    Authentication
                  </span>
                </div>

              </div>

              <div className="mt-3 pt-2 border-t border-border">
                <span className="text-[8px] text-success">
                  36 completed
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT TEAM CARD */}

          <div className="absolute right-[5%] top-[21%] w-36 animate-float-slow-reverse">

            <div className="bg-surface border border-border rounded-xl shadow-lg p-3">

              <div className="flex items-center justify-between mb-3">

                <span className="text-[9px] text-text-muted">
                  Team
                </span>

                <span className="text-[9px] text-success">
                  7 active
                </span>

              </div>

              <div className="flex -space-x-2 mb-3">

                {["A", "B", "C", "D", "E"].map((item) => (
                  <div
                    key={item}
                    className="
                      w-7 h-7
                      rounded-full
                      bg-primary-light
                      border-2 border-surface
                      text-primary
                      text-[9px]
                      font-semibold
                      flex items-center justify-center
                    "
                  >
                    {item}
                  </div>
                ))}

              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[8px] text-text-muted">
                  Team is collaborating
                </span>
              </div>

            </div>

          </div>

          {/* CENTER PROJECT */}

          <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-10">

            <div className="relative w-52 bg-surface border border-primary/30 rounded-2xl shadow-xl p-4">

              {/* Glow */}
              <div className="absolute -inset-1 bg-primary-light/20 rounded-2xl blur-md -z-10" />

              <div className="flex items-start justify-between mb-4">

                <div>

                  <span className="text-[8px] font-semibold tracking-wider text-primary">
                    ACTIVE PROJECT
                  </span>

                  <h3 className="text-sm font-bold text-text-primary mt-1">
                    Website Redesign
                  </h3>

                </div>

                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />

              </div>

              <div className="space-y-3">

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[8px] text-text-muted">
                      Project progress
                    </span>

                    <span className="text-[9px] font-semibold text-primary">
                      78%
                    </span>
                  </div>

                  <div className="h-2 bg-surface-muted rounded-full overflow-hidden">

                    <div
                      className="h-full bg-primary rounded-full animate-progress"
                      style={{ width: "78%" }}
                    />

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">

                  <div className="bg-background rounded-lg p-2">
                    <p className="text-[8px] text-text-muted">
                      Completed
                    </p>

                    <p className="text-xs font-bold text-text-primary">
                      36
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-2">
                    <p className="text-[8px] text-text-muted">
                      Remaining
                    </p>

                    <p className="text-xs font-bold text-text-primary">
                      10
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ACTIVITY CARD */}

          <div className="absolute left-[9%] bottom-[9%] w-40">

            <div className="bg-surface border border-border rounded-xl shadow-lg p-3">

              <div className="flex items-center justify-between mb-3">

                <span className="text-[9px] font-semibold text-text-primary">
                  Activity
                </span>

                <span className="text-[8px] text-text-muted">
                  This week
                </span>

              </div>

              <div className="flex items-end gap-1.5 h-12">

                {[35, 50, 42, 68, 55, 78, 90].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-primary-light rounded-t-sm"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="w-full h-full bg-primary rounded-t-sm opacity-70"
                    />
                  </div>
                ))}

              </div>

              <div className="flex items-center gap-2 mt-2">

                <span className="text-[8px] text-success font-medium">
                  +24%
                </span>

                <span className="text-[8px] text-text-muted">
                  productivity
                </span>

              </div>

            </div>

          </div>

          {/* COMPLETION CARD */}

          <div className="absolute right-[8%] bottom-[9%]">

            <div className="bg-surface border border-border rounded-xl shadow-lg p-3 w-44">

              <div className="flex items-center gap-3">

                <div className="w-8 h-8 rounded-full bg-success-light text-success flex items-center justify-center font-bold text-sm">
                  ✓
                </div>

                <div>
                  <p className="text-[9px] font-semibold text-text-primary">
                    Project on track
                  </p>

                  <p className="text-[8px] text-text-muted mt-0.5">
                    Updated just now
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Floating status pills */}

          <div className="absolute left-[42%] top-[8%] px-3 py-1.5 bg-surface border border-border shadow-md rounded-full">
            <span className="text-[8px] text-text-secondary">
              12 projects active
            </span>
          </div>

          <div className="absolute right-[25%] bottom-[3%] px-3 py-1.5 bg-primary text-text-inverse shadow-md rounded-full">
            <span className="text-[8px] font-medium">
              Everything in sync
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;