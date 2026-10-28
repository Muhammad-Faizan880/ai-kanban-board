import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 bg-gradient-primary"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <span className="inline-block px-3 py-1 mb-4 rounded-full bg-surface text-primary text-xs font-semibold">
          Get started today
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-text-inverse mb-4">
          Ready to take control of your projects?
        </h2>

        <p className="text-lg text-text-inverse/80 mb-8 max-w-2xl mx-auto">
          Create your workspace and start managing your team's work with
          TaskFlow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          <Link
            to="/register"
            className="
              bg-surface
              text-primary
              px-8 py-3
              rounded-lg
              text-base
              font-semibold
              shadow-sm
              hover:bg-surface-muted
              hover:-translate-y-0.5
              transition-all
              duration-200
            "
          >
            Get Started Free
          </Link>

          <span className="text-sm text-text-inverse/75">
            No credit card required
          </span>

        </div>

      </div>
    </section>
  );
};

export default CTA;