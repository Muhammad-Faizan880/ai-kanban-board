import React from "react";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-text-inverse shadow-xs">
                T
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary">
                TaskFlow
              </span>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Agile project management and task tracking for modern developers. Powered by Google Gemini AI for instant goal decomposition.
            </p>

            {/* Operational Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Core Modules */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Workspace
            </h3>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link
                  to="/myTasks"
                  className="transition hover:text-primary hover:underline"
                >
                  Agile Kanban Board
                </Link>
              </li>
              <li>
                <a
                  href="#ai-spotlight"
                  className="inline-flex items-center gap-1.5 transition hover:text-primary hover:underline"
                >
                  <span>Gemini AI Assistant</span>
                </a>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="transition hover:text-primary hover:underline"
                >
                  Projects Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="transition hover:text-primary hover:underline"
                >
                  Live Analytics Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform Tour */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <a
                  href="#features"
                  className="transition hover:text-primary hover:underline"
                >
                  Core Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="transition hover:text-primary hover:underline"
                >
                  3-Step Workflow
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="transition hover:text-primary hover:underline"
                >
                  Why TaskFlow
                </a>
              </li>
              <li>
                <a
                  href="#ai-spotlight"
                  className="transition hover:text-primary hover:underline"
                >
                  Interactive AI Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Access */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Account & Security
            </h3>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-primary hover:underline"
                >
                  Sign In to Workspace
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="transition hover:text-primary hover:underline"
                >
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link
                  to="/forgot-password"
                  className="transition hover:text-primary hover:underline"
                >
                  Password Recovery (OTP)
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="transition hover:text-primary hover:underline"
                >
                  Preferences & Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {currentYear} TaskFlow. Built with React, Node.js & MongoDB.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span>JWT Session Security</span>
            </span>
            <span className="text-text-secondary">
              WCAG 2.1 AA Accessible
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
