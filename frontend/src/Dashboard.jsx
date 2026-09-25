import { useMemo } from "react";
import { useEmployees } from "./context/EmployeeContext";

const Dashboard = () => {
  const {
    employees,
    getDailyStats,
    loading,
  } = useEmployees();

  const today = new Date();

  const todayKey =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = useMemo(
    () => getDailyStats(todayKey),
    [getDailyStats, todayKey, employees]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your workspace...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching employee data
          </p>
        </div>
      </div>
    );
  }

  const attendancePercentage =
    stats.totalEmployees > 0
      ? Math.round(
          (stats.markedEmployees / stats.totalEmployees) * 100
        )
      : 0;

  const presentPercentage =
    stats.totalEmployees > 0
      ? Math.round(
          (stats.present / stats.totalEmployees) * 100
        )
      : 0;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Decorative background */}

        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-indigo-500/[0.05] blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Daily Overview
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[34px]">
              Good morning, Admin
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Here's a quick overview of your workforce and
              today's attendance activity.
            </p>

          </div>

          {/* Date */}

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>

            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                {formattedDate}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Employees"
          value={employees.length}
          description="Registered in Workora"
          accent="blue"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <StatCard
          label="Present Today"
          value={stats.present}
          description={`${presentPercentage}% of workforce`}
          accent="emerald"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          }
        />

        <StatCard
          label="Absent Today"
          value={stats.absent}
          description="Not present today"
          accent="red"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m15 9-6 6M9 9l6 6" />
            </svg>
          }
        />

        <StatCard
          label="Half-Day"
          value={stats.halfDay}
          description="Partial attendance"
          accent="amber"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v9h9" />
            </svg>
          }
        />

      </div>

      {/* =====================================================
          MAIN DASHBOARD GRID
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">

        {/* ===================================================
            ATTENDANCE BREAKDOWN
        ==================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-base font-bold text-slate-900">
                  Today's Attendance
                </h2>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                  LIVE
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Current attendance breakdown across your workforce.
              </p>

            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>

            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <AttendanceRow
              label="Present"
              description="Full working day"
              count={stats.present}
              dot="bg-emerald-500"
              background="bg-emerald-50/60"
              text="text-emerald-700"
            />

            <AttendanceRow
              label="Half-Day"
              description="Half working day"
              count={stats.halfDay}
              dot="bg-amber-500"
              background="bg-amber-50/60"
              text="text-amber-700"
            />

            <AttendanceRow
              label="Absent"
              description="Not present"
              count={stats.absent}
              dot="bg-red-500"
              background="bg-red-50/60"
              text="text-red-700"
            />

            <AttendanceRow
              label="On Leave"
              description="Approved leave"
              count={stats.onLeave}
              dot="bg-blue-500"
              background="bg-blue-50/60"
              text="text-blue-700"
            />

          </div>

          {/* Bottom total */}

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="9" />
                </svg>

              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Attendance marked
                </p>

                <p className="text-[11px] text-slate-400">
                  {stats.markedEmployees} of {stats.totalEmployees} employees
                </p>
              </div>

            </div>

            <span className="text-sm font-bold text-slate-700">
              {attendancePercentage}%
            </span>

          </div>

        </section>

        {/* ===================================================
            COMPLETION
        ==================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/[0.06] blur-3xl" />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Attendance Completion
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Today's marking progress.
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>

              </div>

            </div>

            {/* Percentage */}

            <div className="mt-8 flex items-center gap-6">

              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">

                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={
                      2 * Math.PI * 48 *
                      (1 - attendancePercentage / 100)
                    }
                    className="transition-all duration-700"
                  />
                </svg>

                <div className="text-center">

                  <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {attendancePercentage}%
                  </p>

                  <p className="text-[10px] font-medium text-slate-400">
                    Complete
                  </p>

                </div>

              </div>

              <div className="min-w-0">

                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {stats.markedEmployees}
                  <span className="text-base font-medium text-slate-400">
                    {" "} / {stats.totalEmployees}
                  </span>
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  employees marked
                </p>

                <div className="mt-4 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-xs font-medium text-slate-500">
                    {stats.markedEmployees} completed
                  </span>

                </div>

              </div>

            </div>

            {/* Progress bar */}

            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[11px] font-semibold text-slate-400">
                  Daily progress
                </span>

                <span className="text-[11px] font-bold text-slate-600">
                  {attendancePercentage}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700"
                  style={{
                    width: `${attendancePercentage}%`,
                  }}
                />

              </div>

            </div>

            {/* Warning */}

            {stats.unmarked > 0 ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.3a2 2 0 0 0-3.4 0Z" />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-bold text-amber-800">
                    Attendance needs attention
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-amber-700">
                    {stats.unmarked} employee
                    {stats.unmarked !== 1 ? "s are" : " is"} still
                    unmarked for today.
                  </p>

                </div>

              </div>
            ) : (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-bold text-emerald-800">
                    Attendance complete
                  </p>

                  <p className="mt-0.5 text-xs text-emerald-700">
                    All employees have been marked for today.
                  </p>

                </div>

              </div>
            )}

          </div>

        </section>

      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {employees.length === 0 && (
        <section className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-3xl" />

          <div className="relative">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-7 w-7"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>

            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No employees yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first employee to start managing
              attendance, employee profiles and payroll from
              Workora.
            </p>

          </div>

        </section>
      )}

    </div>
  );
};

/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({
  icon,
  label,
  value,
  description,
  accent,
}) => {

  const accentStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      glow: "bg-blue-500",
      number: "text-blue-600",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      glow: "bg-emerald-500",
      number: "text-emerald-600",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      glow: "bg-red-500",
      number: "text-red-600",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      glow: "bg-amber-500",
      number: "text-amber-600",
    },
  };

  const style = accentStyles[accent];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">

      {/* Top accent */}

      <div
        className={`absolute left-0 right-0 top-0 h-[3px] ${style.glow} opacity-80`}
      />

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
        >
          {icon}
        </div>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 text-slate-300 transition group-hover:text-slate-400"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>

      </div>

      <div className="mt-5">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="mt-1 flex items-end gap-2">

          <p className="text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          {value > 0 && (
            <span
              className={`mb-1 text-xs font-bold ${style.number}`}
            >
              active
            </span>
          )}

        </div>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
};

/* ============================================================
   ATTENDANCE ROW
============================================================ */

const AttendanceRow = ({
  label,
  description,
  count,
  dot,
  background,
  text,
}) => {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border border-transparent ${background} px-4 py-4 transition hover:border-slate-200 hover:bg-white`}
    >

      <div className="flex min-w-0 items-center gap-3">

        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}
        />

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-800">
            {label}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <span
        className={`ml-3 text-xl font-bold ${text}`}
      >
        {count}
      </span>

    </div>
  );
};

export default Dashboard;