import React from "react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-background overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-light/40 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight">
              Plan projects.
              <br />
              Manage tasks.
              <br />
              <span
                className="bg-gradient-to-r
    from-primary
    via-primary-hover
    to-primary
    bg-clip-text
    text-transparent"
              >
                Ship faster.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
              TaskFlow brings projects, Kanban boards, and Gemini AI task decomposition into one focused workspace.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                to="/register"
                className="
                  inline-flex items-center justify-center
                  bg-primary
                  hover:bg-primary-hover
                  text-text-inverse
                  px-7 py-3
                  rounded-lg
                  text-base
                  font-semibold
                  shadow-md
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  transition-all duration-300
                  text-center
                "
              >
                Get Started Free
              </Link>

              <Link
                to="/login"
                className="
                  bg-surface
                  text-text-primary
                  px-7 py-3
                  rounded-lg
                  text-base
                  font-semibold
                  border border-border
                  hover:bg-surface-muted
                  hover:-translate-y-0.5
                  transition-all duration-200
                  text-center
                "
              >
                Login
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <div className="flex items-center gap-2 text-sm text-text-muted">
               
                No credit card required
              </div>

              <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />

              <div className="text-sm text-text-muted">Free to get started</div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative animate-float">
            {/* Soft glow behind dashboard */}
            <div className="absolute inset-8 bg-primary-light/50 blur-3xl rounded-full" />

            <div className="relative">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
