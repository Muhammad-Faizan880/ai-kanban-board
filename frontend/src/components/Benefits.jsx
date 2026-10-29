import { useEffect, useRef, useState } from "react";

const Benefits = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const benefits = [
    "One place for every project",
    "Clear task ownership",
    "Better team visibility",
    "Faster decision making",
    "Organized workflows",
    "Less context switching",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="py-16 md:py-24 bg-surface overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Content */}
          <div
            className={`
              transition-all duration-700
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }
            `}
          >

            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-5">
              Built to reduce the noise around your work
            </h2>

            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              TaskFlow eliminates the chaos of managing multiple tools.
              Everything your team needs is organized in one focused
              workspace.
            </p>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className={`
                    flex items-center gap-3
                    text-text-secondary
                    group
                    transition-all duration-500
                    ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }
                  `}
                  style={{
                    transitionDelay: `${index * 80}ms`,
                  }}
                >
                  <span className="relative flex h-7 w-6 items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ">
                    <span
                      className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-hover)]"
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      }}
                    />
                    <svg
                      className="relative z-10 w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>

                  <span className="text-sm font-medium group-hover:text-text-primary transition-colors">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Productivity Card */}
          <div
            className={`
              transition-all duration-700 delay-200
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }
            `}
          >
            <div className="relative bg-background rounded-2xl border border-border p-6 md:p-8 shadow-sm">

              {/* Card Header */}
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Team Overview
                  </h3>

                  <p className="text-xs text-text-muted mt-1">
                    Current workspace activity
                  </p>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Live
                </span>
              </div>

              {/* Productivity */}
              <div className="bg-surface rounded-xl border border-border p-5 mb-4">

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-text-muted">
                      Team Productivity
                    </p>

                    <p className="text-3xl font-bold text-text-primary mt-1">
                      86%
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-success">
                    +24%
                  </span>
                </div>

                <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? "86%" : "0%",
                    }}
                  />
                </div>

                <p className="text-xs text-text-muted mt-2">
                  24% higher than last month
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">

                <div className="bg-surface rounded-xl border border-border p-4">
                  <p className="text-xs text-text-muted">
                    Members
                  </p>

                  <p className="text-xl font-bold text-text-primary mt-1">
                    12
                  </p>

                  <p className="text-[11px] text-success mt-1">
                    Active
                  </p>
                </div>

                <div className="bg-surface rounded-xl border border-border p-4">
                  <p className="text-xs text-text-muted">
                    Projects
                  </p>

                  <p className="text-xl font-bold text-text-primary mt-1">
                    8
                  </p>

                  <p className="text-[11px] text-primary mt-1">
                    In progress
                  </p>
                </div>

                <div className="bg-surface rounded-xl border border-border p-4">
                  <p className="text-xs text-text-muted">
                    Tasks
                  </p>

                  <p className="text-xl font-bold text-text-primary mt-1">
                    142
                  </p>

                  <p className="text-[12px] text-text-muted mt-1">
                    This month
                  </p>
                </div>

              </div>

              {/* Small bottom message */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Everything is on track
                  </p>

                  <p className="text-xs text-text-muted">
                    Your team is staying productive.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Benefits;