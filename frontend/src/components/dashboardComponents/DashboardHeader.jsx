import React from "react";
import { useSelector } from "react-redux";
import { PlusIcon } from "@heroicons/react/24/outline";

const DashboardHeader = ({ onCreateTask }) => {
  const { user } = useSelector((state) => state.auth);

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <section className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:gap-5 md:flex-row md:items-center">

      {/* Welcome */}
      <div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>

        <p className="mt-2 text-sm text-text-secondary sm:text-base">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Create Task */}
      <button
        type="button"
        onClick={onCreateTask}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-text-inverse shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto"
      >
        <PlusIcon className="h-5 w-5" />

        Create Task
      </button>

    </section>
  );
};

export default DashboardHeader;