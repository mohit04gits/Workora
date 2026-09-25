
import { useMemo, useState } from "react";
import { useEmployees } from "./context/EmployeeContext";

const getCurrentMonth = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
};

const Payroll = () => {
  const {
    employees,
    getMonthlyPayroll,
    getTotalPayroll,
  } = useEmployees();

  const [month, setMonth] =
    useState(getCurrentMonth());

  const [searchTerm, setSearchTerm] =
    useState("");

  const payroll = useMemo(
    () => getMonthlyPayroll(month),
    [month, getMonthlyPayroll]
  );

  const totalPayroll = useMemo(
    () => getTotalPayroll(month),
    [month, getTotalPayroll]
  );

  const filteredPayroll = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return payroll;
    }

    return payroll.filter((item) => {
      const name =
        item.employeeName?.toLowerCase() || "";

      const id =
        item.employeeId?.toLowerCase() || "";

      return (
        name.includes(search) ||
        id.includes(search)
      );
    });
  }, [payroll, searchTerm]);

  const payrollStats = useMemo(() => {
    const totalPayableDays =
      payroll.reduce(
        (sum, item) =>
          sum + Number(item.payableDays || 0),
        0
      );

    const totalPresent =
      payroll.reduce(
        (sum, item) =>
          sum + Number(item.presentDays || 0),
        0
      );

    const totalHalfDays =
      payroll.reduce(
        (sum, item) =>
          sum + Number(item.halfDays || 0),
        0
      );

    const totalAbsent =
      payroll.reduce(
        (sum, item) =>
          sum + Number(item.absentDays || 0),
        0
      );

    const totalLeave =
      payroll.reduce(
        (sum, item) =>
          sum + Number(item.leaveDays || 0),
        0
      );

    return {
      totalPayableDays,
      totalPresent,
      totalHalfDays,
      totalAbsent,
      totalLeave,
    };
  }, [payroll]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const formattedMonth = new Date(
    `${month}-01T00:00:00`
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Finance
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[34px]">
              Payroll
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Review monthly salaries and calculate
              payable amounts from attendance.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <label
              htmlFor="payroll-month"
              className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Payroll Month
            </label>

            <input
              id="payroll-month"
              type="month"
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-auto"
            />

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Total Employees"
          value={employees.length}
          description="Employees in payroll"
          icon="users"
          className="bg-slate-950 text-white"
          labelClass="text-slate-400"
        />

        <SummaryCard
          label="Payroll Month"
          value={formattedMonth}
          description="Selected calculation period"
          icon="calendar"
          className="bg-blue-600 text-white"
          labelClass="text-blue-100"
          valueClass="text-xl sm:text-2xl"
        />

        <SummaryCard
          label="Total Payable"
          value={formatCurrency(totalPayroll)}
          description="Combined payable salary"
          icon="money"
          className="bg-emerald-600 text-white"
          labelClass="text-emerald-100"
        />

        <SummaryCard
          label="Payable Days"
          value={payrollStats.totalPayableDays}
          description="Across all employees"
          icon="clock"
          className="bg-violet-600 text-white"
          labelClass="text-violet-100"
        />

      </div>

      {/* =====================================================
          ATTENDANCE SNAPSHOT
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5">

          <h2 className="text-base font-bold text-slate-900">
            Attendance Snapshot
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Attendance totals used for this month's payroll.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <MiniStat
            label="Present"
            value={payrollStats.totalPresent}
            description="Full working days"
            className="bg-emerald-50 text-emerald-700"
          />

          <MiniStat
            label="Half-Day"
            value={payrollStats.totalHalfDays}
            description="Half working days"
            className="bg-amber-50 text-amber-700"
          />

          <MiniStat
            label="Absent"
            value={payrollStats.totalAbsent}
            description="Unpaid days"
            className="bg-red-50 text-red-700"
          />

          <MiniStat
            label="On Leave"
            value={payrollStats.totalLeave}
            description="Leave days"
            className="bg-blue-50 text-blue-700"
          />

        </div>

      </section>

      {/* =====================================================
          SALARY RULE
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:p-6">

        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 10v6" />
              <path d="M12 7h.01" />
            </svg>

          </div>

          <div>

            <h3 className="text-sm font-bold text-blue-900">
              Salary calculation
            </h3>

            <p className="mt-1 text-xs leading-6 text-blue-800 sm:text-sm">

              Present = 1 day, Half-Day = 0.5 day,
              Absent = 0 day and On Leave = 0 day.
              Daily salary is calculated by dividing
              monthly base salary by the number of
              calendar days in the selected month.

            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          PAYROLL DIRECTORY
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5 sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-base font-bold text-slate-900">
                  Monthly Payroll
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                  {payroll.length}
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                {formattedMonth} · Employee-wise salary breakdown
              </p>

            </div>

            {employees.length > 0 && (
              <div className="relative w-full lg:max-w-sm">

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
                  placeholder="Search employee or ID..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    ✕
                  </button>
                )}

              </div>
            )}

          </div>

        </div>

        {employees.length === 0 ? (
          <EmptyPayroll />
        ) : filteredPayroll.length === 0 ? (
          <NoSearchResults
            searchTerm={searchTerm}
            onClear={clearSearch}
          />
        ) : (
          <>
            {/* Desktop */}

            <div className="hidden overflow-x-auto xl:block">

              <table className="w-full min-w-[1150px] text-left">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Employee
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Base Salary
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Present
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Half-Day
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Absent
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Leave
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Payable Days
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Payable Salary
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredPayroll.map((item) => (
                    <PayrollRow
                      key={item.employeeId}
                      item={item}
                      formatCurrency={formatCurrency}
                    />
                  ))}

                </tbody>

                <tfoot>

                  <tr className="bg-slate-950 text-white">

                    <td
                      colSpan="7"
                      className="px-6 py-5 text-right text-sm font-bold"
                    >
                      Total Payroll
                    </td>

                    <td className="px-6 py-5 text-right text-lg font-bold text-emerald-400">
                      {formatCurrency(totalPayroll)}
                    </td>

                  </tr>

                </tfoot>

              </table>

            </div>

            {/* Tablet */}

            <div className="hidden md:block xl:hidden">

              <div className="divide-y divide-slate-100">

                {filteredPayroll.map((item) => (
                  <PayrollTabletCard
                    key={item.employeeId}
                    item={item}
                    formatCurrency={formatCurrency}
                  />
                ))}

              </div>

              <div className="bg-slate-950 p-5 text-white">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-slate-400">
                    Total Payroll
                  </span>

                  <span className="text-lg font-bold text-emerald-400">
                    {formatCurrency(totalPayroll)}
                  </span>

                </div>

              </div>

            </div>

            {/* Mobile */}

            <div className="space-y-3 p-4 md:hidden">

              {filteredPayroll.map((item) => (
                <PayrollMobileCard
                  key={item.employeeId}
                  item={item}
                  formatCurrency={formatCurrency}
                />
              ))}

              <div className="rounded-2xl bg-slate-950 p-5 text-white">

                <p className="text-xs font-medium text-slate-400">
                  Total Payroll
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {formatCurrency(totalPayroll)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formattedMonth}
                </p>

              </div>

            </div>

          </>
        )}

      </section>

    </div>
  );
};

/* ============================================================
   SUMMARY CARD
============================================================ */

const SummaryCard = ({
  label,
  value,
  description,
  icon,
  className,
  labelClass,
  valueClass = "text-3xl",
}) => {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm sm:p-6 ${className}`}
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <p
            className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}
          >
            {label}
          </p>

          <p
            className={`mt-2 font-bold tracking-tight ${valueClass}`}
          >
            {value}
          </p>

          <p
            className={`mt-1 text-xs ${labelClass}`}
          >
            {description}
          </p>

        </div>

        <SummaryIcon type={icon} />

      </div>

    </div>
  );
};

/* ============================================================
   SUMMARY ICON
============================================================ */

const SummaryIcon = ({ type }) => {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">

      {type === "users" && (
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
      )}

      {type === "calendar" && (
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
      )}

      {type === "money" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 9h.01M18 15h.01" />
        </svg>
      )}

      {type === "clock" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )}

    </div>
  );
};

/* ============================================================
   MINI STAT
============================================================ */

const MiniStat = ({
  label,
  value,
  description,
  className,
}) => {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 ${className}`}
    >

      <p className="text-xs font-bold">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] opacity-70 sm:text-xs">
        {description}
      </p>

    </div>
  );
};

/* ============================================================
   DESKTOP PAYROLL ROW
============================================================ */

const PayrollRow = ({
  item,
  formatCurrency,
}) => {
  const initial =
    item.employeeName
      ?.charAt(0)
      ?.toUpperCase() || "?";

  return (
    <tr className="transition hover:bg-slate-50/70">

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
            {initial}
          </div>

          <div>

            <p className="font-semibold text-slate-800">
              {item.employeeName}
            </p>

            <p className="mt-0.5 font-mono text-[11px] text-slate-400">
              {item.employeeId}
            </p>

          </div>

        </div>

      </td>

      <td className="px-5 py-4">

        <p className="text-sm font-semibold text-slate-700">
          {formatCurrency(item.monthlySalary)}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Base
        </p>

      </td>

      <td className="px-5 py-4">
        <StatusBadge
          value={item.presentDays}
          className="bg-emerald-50 text-emerald-700"
        />
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          value={item.halfDays}
          className="bg-amber-50 text-amber-700"
        />
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          value={item.absentDays}
          className="bg-red-50 text-red-700"
        />
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          value={item.leaveDays}
          className="bg-blue-50 text-blue-700"
        />
      </td>

      <td className="px-5 py-4">

        <span className="font-semibold text-slate-700">
          {item.payableDays}
        </span>

      </td>

      <td className="px-6 py-4 text-right">

        <p className="font-bold text-emerald-600">
          {formatCurrency(item.payableSalary)}
        </p>

      </td>

    </tr>
  );
};

/* ============================================================
   TABLET CARD
============================================================ */

const PayrollTabletCard = ({
  item,
  formatCurrency,
}) => {
  return (
    <div className="p-5">

      <div className="flex items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
            {item.employeeName
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0">

            <p className="truncate font-bold text-slate-800">
              {item.employeeName}
            </p>

            <p className="font-mono text-[11px] text-slate-400">
              {item.employeeId}
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Payable
          </p>

          <p className="font-bold text-emerald-600">
            {formatCurrency(item.payableSalary)}
          </p>

        </div>

      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">

        <SmallMetric
          label="Base"
          value={formatCurrency(item.monthlySalary)}
        />

        <SmallMetric
          label="Present"
          value={item.presentDays}
          className="text-emerald-600"
        />

        <SmallMetric
          label="Half"
          value={item.halfDays}
          className="text-amber-600"
        />

        <SmallMetric
          label="Absent"
          value={item.absentDays}
          className="text-red-600"
        />

        <SmallMetric
          label="Days"
          value={item.payableDays}
        />

      </div>

    </div>
  );
};

/* ============================================================
   MOBILE CARD
============================================================ */

const PayrollMobileCard = ({
  item,
  formatCurrency,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
            {item.employeeName
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0">

            <p className="truncate font-bold text-slate-800">
              {item.employeeName}
            </p>

            <p className="font-mono text-[11px] text-slate-400">
              {item.employeeId}
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Payable
          </p>

          <p className="text-sm font-bold text-emerald-600">
            {formatCurrency(item.payableSalary)}
          </p>

        </div>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">

        <MobileMetric
          label="Base Salary"
          value={formatCurrency(item.monthlySalary)}
        />

        <MobileMetric
          label="Payable Days"
          value={item.payableDays}
        />

        <MobileMetric
          label="Present"
          value={item.presentDays}
          valueClass="text-emerald-600"
        />

        <MobileMetric
          label="Half-Day"
          value={item.halfDays}
          valueClass="text-amber-600"
        />

        <MobileMetric
          label="Absent"
          value={item.absentDays}
          valueClass="text-red-600"
        />

        <MobileMetric
          label="On Leave"
          value={item.leaveDays}
          valueClass="text-blue-600"
        />

      </div>

    </div>
  );
};

/* ============================================================
   SMALL METRIC
============================================================ */

const SmallMetric = ({
  label,
  value,
  className = "text-slate-700",
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className={`mt-1 text-xs font-bold ${className}`}>
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   MOBILE METRIC
============================================================ */

const MobileMetric = ({
  label,
  value,
  valueClass = "text-slate-800",
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[10px] font-medium text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   STATUS BADGE
============================================================ */

const StatusBadge = ({
  value,
  className,
}) => {
  return (
    <span
      className={`inline-flex min-w-9 justify-center rounded-lg px-3 py-1.5 text-sm font-bold ${className}`}
    >
      {value ?? 0}
    </span>
  );
};

/* ============================================================
   EMPTY PAYROLL
============================================================ */

const EmptyPayroll = () => {
  return (
    <div className="px-6 py-16 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-7 w-7"
        >
          <rect
            x="2.5"
            y="5"
            width="19"
            height="14"
            rx="2"
          />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 9h.01M18 15h.01" />
        </svg>

      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No employees found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Add employees before calculating payroll.
      </p>

    </div>
  );
};

/* ============================================================
   NO SEARCH RESULTS
============================================================ */

const NoSearchResults = ({
  searchTerm,
  onClear,
}) => {
  return (
    <div className="px-6 py-16 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

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

      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No payroll records found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        No employee matches "{searchTerm}".
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
      >
        Clear Search
      </button>

    </div>
  );
};

export default Payroll;

