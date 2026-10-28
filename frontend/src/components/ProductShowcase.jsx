import { useEffect, useRef, useState } from "react";

const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const projects = [
    {
      name: "Website Redesign",
      progress: 75,
      tasks: "3 tasks left",
    },
    {
      name: "Mobile App",
      progress: 55,
      tasks: "5 tasks left",
    },
    {
      name: "API Integration",
      progress: 90,
      tasks: "1 task left",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="hidden">

          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Your entire workflow, in one place
          </h2>

          <p className="text-lg text-text-secondary">
            See projects, tasks, team activity, and progress without
            jumping between multiple tools.
          </p>
        </div>

        {/* Dashboard */}
        <div
          className={`
            bg-surface
            rounded-2xl
            border border-border
            shadow-lg
            overflow-hidden
            transition-all duration-700
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
        >
          <div className="p-4 md:p-6">

            <div className="flex flex-col md:flex-row gap-5">

              {/* Sidebar */}
              <div className="md:w-48 bg-surface-muted rounded-xl p-4">

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary text-text-inverse flex items-center justify-center font-bold text-sm">
                    T
                  </div>

                  <span className="font-semibold text-text-primary">
                    TaskFlow
                  </span>
                </div>

                <div className="space-y-1">
                  {["Projects", "Tasks", "Team", "Reports"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`
                          px-3 py-2 rounded-lg text-sm
                          transition-colors cursor-pointer
                          ${
                            index === 0
                              ? "bg-surface text-primary font-medium"
                              : "text-text-secondary hover:bg-surface"
                          }
                        `}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Main */}
              <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      Projects
                    </h3>

                    <p className="text-sm text-text-muted mt-1">
                      Track your team's progress
                    </p>
                  </div>

                  <button
                    className="
                      hidden sm:block
                      px-4 py-2
                      rounded-lg
                      bg-primary
                      hover:bg-primary-hover
                      text-text-inverse
                      text-sm font-medium
                      transition
                    "
                  >
                    + New Project
                  </button>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.name}
                      className="
                        p-4
                        rounded-xl
                        bg-background
                        border border-border
                        hover:border-primary
                        hover:-translate-y-0.5
                        transition-all duration-200
                      "
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-text-primary">
                          {project.name}
                        </span>

                        <span className="text-xs text-text-muted">
                          {project.tasks}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                          <div
                            className="
                              h-full
                              bg-primary
                              rounded-full
                              transition-all
                              duration-1000
                            "
                            style={{
                              width: isVisible
                                ? `${project.progress}%`
                                : "0%",
                            }}
                          />
                        </div>

                        <span className="text-xs font-medium text-text-secondary">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    Recent Activity
                  </h4>

                  <div className="space-y-3">

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-medium">
                        J
                      </div>

                      <span className="text-text-secondary">
                        John completed API Documentation
                      </span>

                      <span className="ml-auto text-xs text-text-muted">
                        2h
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded-full bg-info-light text-info flex items-center justify-center text-xs font-medium">
                        S
                      </div>

                      <span className="text-text-secondary">
                        Sarah created Homepage task
                      </span>

                      <span className="ml-auto text-xs text-text-muted">
                        4h
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p
          className={`
            text-center
            text-sm
            text-text-muted
            mt-6
            transition-all duration-700 delay-200
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }
          `}
        >
          Everything your team needs — without the complexity.
        </p>

      </div>
    </section>
  );
};

export default ProductShowcase;