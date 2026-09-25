import { useMemo, useState } from "react";
import axios from "axios";
import { useEmployees } from "./context/EmployeeContext";

const ATTENDANCE_API_URL =
  "http://localhost:5000/api/attendance";

const STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half-Day",
  ON_LEAVE: "On Leave",
};

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Attendance = () => {
  const {
    employees,
    attendance,
    markAttendance,
  } = useEmployees();

  // ============================================================
  // DATE HELPERS
  // ============================================================

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateString) => {
    return new Date(
      `${dateString}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString) => {
    return new Date(
      `${dateString}T00:00:00`
    ).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ============================================================
  // STATE
  // ============================================================

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [searchTerm, setSearchTerm] =
    useState("");

  // ============================================================
  // SELECTED DAY ATTENDANCE
  // ============================================================

  const selectedDayAttendance =
    attendance[selectedDate] || [];

  // ============================================================
  // ATTENDANCE MAP
  // ============================================================

  const attendanceMap = useMemo(() => {
    const map = {};

    selectedDayAttendance.forEach((record) => {
      map[String(record.employeeId)] = record.status;
    });

    return map;
  }, [selectedDayAttendance]);

  // ============================================================
  // FILTER EMPLOYEES
  // ============================================================

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return employees;
    }

    return employees.filter((employee) => {
      const name =
        employee.name?.toLowerCase() || "";

      const id =
        employee.id?.toLowerCase() || "";

      const role =
        employee.role?.toLowerCase() || "";

      return (
        name.includes(search) ||
        id.includes(search) ||
        role.includes(search)
      );
    });
  }, [employees, searchTerm]);

  // ============================================================
  // ATTENDANCE SUMMARY
  // ============================================================

  const summary = useMemo(() => {
    const result = {
      present: 0,
      absent: 0,
      halfDay: 0,
      onLeave: 0,
      marked: 0,
    };

    selectedDayAttendance.forEach((record) => {
      if (record.status === STATUS.PRESENT) {
        result.present++;
      }

      if (record.status === STATUS.ABSENT) {
        result.absent++;
      }

      if (record.status === STATUS.HALF_DAY) {
        result.halfDay++;
      }

      if (record.status === STATUS.ON_LEAVE) {
        result.onLeave++;
      }

      result.marked++;
    });

    return result;
  }, [selectedDayAttendance]);

  // ============================================================
  // COMPLETION
  // ============================================================

  const completionPercentage =
    employees.length === 0
      ? 0
      : Math.round(
          (summary.marked / employees.length) * 100
        );

  // ============================================================
  // MARK SINGLE EMPLOYEE ATTENDANCE
  // ============================================================

  const setEmployeeStatus = async (
    employeeId,
    status
  ) => {
    const success = await markAttendance(
      selectedDate,
      employeeId,
      status
    );

    if (!success) {
      console.error(
        "Failed to save attendance"
      );
    }
  };

  // ============================================================
  // MARK ALL PRESENT
  // ============================================================

  const markAllPresent = async () => {
    if (employees.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Mark all ${employees.length} employees as Present for ${formatDate(
        selectedDate
      )}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(
        employees.map((employee) =>
          markAttendance(
            selectedDate,
            employee.id,
            STATUS.PRESENT
          )
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark all employees present:",
        error
      );
    }
  };

  // ============================================================
  // CLEAR ATTENDANCE
  // ============================================================

  const clearAttendance = async () => {
    if (summary.marked === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Clear all attendance for ${formatDate(
        selectedDate
      )}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(
        selectedDayAttendance.map((record) =>
          axios.delete(
            `${ATTENDANCE_API_URL}/${selectedDate}/${record.employeeId}`
          )
        )
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Failed to clear attendance:",
        error.response?.data || error.message
      );
    }
  };

  // ============================================================
  // DATE NAVIGATION
  // ============================================================

  const changeDate = (days) => {
    const date = new Date(
      `${selectedDate}T00:00:00`
    );

    date.setDate(date.getDate() + days);

    setSelectedDate(formatDateKey(date));
  };

  const goToToday = () => {
    setSelectedDate(getToday());
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const isToday =
    selectedDate === getToday();

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Daily Register
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[34px]">
              Attendance
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Track and manage daily attendance across
              your entire workforce.
            </p>

          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <button
              type="button"
              onClick={markAllPresent}
              disabled={employees.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                ✓
              </span>

              Mark All Present
            </button>

            <button
              type="button"
              onClick={clearAttendance}
              disabled={summary.marked === 0}
              className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear Day
            </button>

          </div>

        </div>
      </section>

      {/* =====================================================
          DATE CONTROL
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => changeDate(-1)}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
            >
              ←

              <span className="ml-2 hidden sm:inline">
                Previous
              </span>
            </button>

            <button
              type="button"
              onClick={goToToday}
              className={`h-11 rounded-xl px-5 text-sm font-bold transition ${
                isToday
                  ? "bg-blue-50 text-blue-700"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => changeDate(1)}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
            >
              <span className="mr-2 hidden sm:inline">
                Next
              </span>

              →
            </button>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <div className="hidden text-right sm:block">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Date
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {formatDate(selectedDate)}
              </p>

            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>

        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">

          <span className="h-2 w-2 rounded-full bg-blue-500" />

          <p className="text-sm font-semibold text-slate-700">
            {formatShortDate(selectedDate)}
          </p>

          {isToday && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              TODAY
            </span>
          )}

        </div>

      </section>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <SummaryCard
          label="Present"
          value={summary.present}
          description="Full working day"
          icon="✓"
          className="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          label="Half-Day"
          value={summary.halfDay}
          description="Half working day"
          icon="½"
          className="bg-amber-50 text-amber-700"
        />

        <SummaryCard
          label="Absent"
          value={summary.absent}
          description="Not present"
          icon="!"
          className="bg-red-50 text-red-700"
        />

        <SummaryCard
          label="On Leave"
          value={summary.onLeave}
          description="Leave marked"
          icon="L"
          className="bg-blue-50 text-blue-700"
        />

      </div>

      {/* =====================================================
          COMPLETION
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="p-5 sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-sm font-bold text-slate-900">
                  Attendance Completion
                </h2>

                {completionPercentage === 100 &&
                  employees.length > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      COMPLETE
                    </span>
                  )}

              </div>

              <p className="mt-1 text-xs text-slate-500">
                {summary.marked} of {employees.length}{" "}
                employees marked
              </p>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-3xl font-bold tracking-tight text-slate-950">
                {completionPercentage}%
              </p>

              {summary.marked < employees.length &&
                employees.length > 0 && (
                  <p className="mt-1 text-xs font-semibold text-amber-600">
                    {employees.length - summary.marked}{" "}
                    employees unmarked
                  </p>
                )}

            </div>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
              }}
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-xl">

            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search employee by name, ID or role..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                ✕
              </button>
            )}

          </div>

          <div className="text-xs font-medium text-slate-400">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredEmployees.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {employees.length}
            </strong>{" "}
            employees
          </div>

        </div>

      </section>

      {/* =====================================================
          ATTENDANCE LIST
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-base font-bold text-slate-900">
                  Daily Attendance
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                  {filteredEmployees.length}
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                Select the appropriate attendance status
                for each employee.
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">

              <span className="h-2 w-2 rounded-full bg-blue-500" />

              <span>
                {summary.marked} marked
              </span>

            </div>

          </div>

        </div>

        {employees.length === 0 ? (
          <EmptyState
            icon="users"
            title="No employees available"
            description="Add employees before marking attendance."
          />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            icon="search"
            title="No employees found"
            description="Try another name, employee ID or role."
          />
        ) : (
          <>
            {/* =================================================
                DESKTOP
            ================================================== */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Department / Role
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Attendance Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredEmployees.map((employee) => {

                    const currentStatus =
                      attendanceMap[
                        String(employee.id)
                      ];

                    return (
                      <tr
                        key={employee.id}
                        className="transition hover:bg-slate-50/70"
                      >

                        <td className="px-6 py-4">

                          <EmployeeIdentity
                            employee={employee}
                          />

                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {employee.role || "—"}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <StatusButtons
                            currentStatus={currentStatus}
                            onChange={(status) =>
                              setEmployeeStatus(
                                employee.id,
                                status
                              )
                            }
                          />

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* =================================================
                MOBILE
            ================================================== */}

            <div className="divide-y divide-slate-100 md:hidden">

              {filteredEmployees.map((employee) => {

                const currentStatus =
                  attendanceMap[
                    String(employee.id)
                  ];

                return (
                  <div
                    key={employee.id}
                    className="p-4"
                  >

                    <EmployeeIdentity
                      employee={employee}
                    />

                    <div className="mt-4">

                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Mark Attendance
                      </p>

                      <StatusButtons
                        currentStatus={currentStatus}
                        onChange={(status) =>
                          setEmployeeStatus(
                            employee.id,
                            status
                          )
                        }
                        mobile
                      />

                    </div>

                  </div>
                );
              })}

            </div>
          </>
        )}

      </section>

    </div>
  );
};

// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({
  label,
  value,
  description,
  icon,
  className,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${className}`}
        >
          {icon}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Today
        </span>

      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {description}
      </p>

    </div>
  );
};

// ============================================================
// EMPLOYEE IDENTITY
// ============================================================

const EmployeeIdentity = ({ employee }) => {
  const initial =
    employee.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
        {initial}
      </div>

      <div className="min-w-0">

        <p className="truncate font-semibold text-slate-800">
          {employee.name}
        </p>

        <p className="mt-0.5 font-mono text-[11px] text-slate-400">
          {employee.id}
        </p>

      </div>

    </div>
  );
};

// ============================================================
// STATUS BUTTONS
// ============================================================

const StatusButtons = ({
  currentStatus,
  onChange,
  mobile = false,
}) => {
  const statuses = [
    {
      value: STATUS.PRESENT,
      label: "Present",
      short: "P",
      active:
        "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm",
    },
    {
      value: STATUS.HALF_DAY,
      label: "Half-Day",
      short: "½",
      active:
        "border-amber-500 bg-amber-50 text-amber-700 shadow-sm",
    },
    {
      value: STATUS.ABSENT,
      label: "Absent",
      short: "A",
      active:
        "border-red-500 bg-red-50 text-red-700 shadow-sm",
    },
    {
      value: STATUS.ON_LEAVE,
      label: "On Leave",
      short: "L",
      active:
        "border-blue-500 bg-blue-50 text-blue-700 shadow-sm",
    },
  ];

  return (
    <div
      className={`grid gap-2 ${
        mobile
          ? "grid-cols-4"
          : "w-full max-w-[540px] grid-cols-4"
      }`}
    >
      {statuses.map((status) => {

        const isActive =
          currentStatus === status.value;

        return (
          <button
            key={status.value}
            type="button"
            onClick={() =>
              onChange(status.value)
            }
            className={
              "rounded-xl border px-2 py-2.5 text-xs font-bold transition-all duration-150 active:scale-[0.97] " +
              (isActive
                ? status.active
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50")
            }
          >
            <span className="hidden sm:inline">
              {status.label}
            </span>

            <span className="sm:hidden">
              {status.short}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="px-6 py-16 text-center sm:py-20">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

        {icon === "users" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-7 w-7"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-7 w-7"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        )}

      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
};

export default Attendance;