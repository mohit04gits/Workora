import { useMemo, useState } from "react";
import { useEmployees } from "./context/EmployeeContext";

const emptyForm = {
  id: "",
  name: "",
  role: "",
  phone: "",
  aadhar: "",
  monthlySalary: "",
};

const EmployeeManager = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getMonthlyPayroll,
  } = useEmployees();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentMonth = useMemo(() => {
    const date = new Date();

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  }, []);

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return employees;

    return employees.filter((employee) => {
      const name = employee.name?.toLowerCase() || "";
      const id = employee.id?.toLowerCase() || "";
      const role = employee.role?.toLowerCase() || "";

      return (
        name.includes(search) ||
        id.includes(search) ||
        role.includes(search)
      );
    });
  }, [employees, searchTerm]);

  const monthlyPayroll = useMemo(() => {
    return getMonthlyPayroll(currentMonth);
  }, [getMonthlyPayroll, currentMonth, employees]);

  const getEmployeePayroll = (employeeId) => {
    return (
      monthlyPayroll.find(
        (item) =>
          String(item.employeeId) === String(employeeId)
      ) || null
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setSelectedEmployee(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEdit = (employee) => {
    setForm({
      id: employee.id,
      name: employee.name || "",
      role: employee.role || "",
      phone: employee.phone || "",
      aadhar: employee.aadhar || "",
      monthlySalary: employee.monthlySalary || "",
    });

    setEditingId(employee.id);
    setShowForm(true);
    setSelectedEmployee(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const id = form.id.trim();
    const name = form.name.trim();
    const role = form.role.trim();
    const phone = form.phone.trim();
    const aadhar = form.aadhar.trim();
    const salary = Number(form.monthlySalary);

    if (!id) {
      alert("Please enter Employee ID.");
      return;
    }

    if (!name) {
      alert("Please enter employee name.");
      return;
    }

    if (!role) {
      alert("Please enter employee role/department.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits.");
      return;
    }

    if (aadhar && !/^[0-9]{12}$/.test(aadhar)) {
      alert("Aadhar number must contain exactly 12 digits.");
      return;
    }

    if (!salary || salary <= 0) {
      alert("Please enter a valid salary.");
      return;
    }

    const employeeData = {
      id,
      name,
      role,
      phone,
      aadhar,
      monthlySalary: salary,
    };

    if (editingId !== null) {
      updateEmployee(editingId, employeeData);
    } else {
      const duplicate = employees.some(
        (employee) =>
          String(employee.id).toLowerCase() ===
          id.toLowerCase()
      );

      if (duplicate) {
        alert("An employee with this ID already exists.");
        return;
      }

      addEmployee(employeeData);
    }

    closeForm();
  };

  const handleDelete = (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    deleteEmployee(employee.id);

    if (
      selectedEmployee &&
      String(selectedEmployee.id) === String(employee.id)
    ) {
      setSelectedEmployee(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const maskAadhar = (aadhar) => {
    if (!aadhar) return "Not provided";

    if (aadhar.length !== 12) {
      return "••••";
    }

    return `XXXX XXXX ${aadhar.slice(-4)}`;
  };

  const selectedPayroll = selectedEmployee
    ? getEmployeePayroll(selectedEmployee.id)
    : null;

  const totalMonthlySalary = employees.reduce(
    (total, employee) =>
      total + (Number(employee.monthlySalary) || 0),
    0
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Workforce
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[34px]">
              Employees
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your people, employee profiles, salaries and
              workforce information from one place.
            </p>

          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>

            Add Employee

          </button>

        </div>
      </section>

      {/* =====================================================
          QUICK STATS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <MiniStat
          label="Total Employees"
          value={employees.length}
          description="Active workforce records"
          icon="users"
          className="text-blue-600 bg-blue-50"
        />

        <MiniStat
          label="Showing"
          value={filteredEmployees.length}
          description={
            searchTerm
              ? "Matching your search"
              : "All employees"
          }
          icon="search"
          className="text-violet-600 bg-violet-50"
        />

        <MiniStat
          label="Monthly Payroll"
          value={formatCurrency(totalMonthlySalary)}
          description="Combined base salaries"
          icon="money"
          className="text-emerald-600 bg-emerald-50"
        />

      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-2xl">

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
              placeholder="Search by name, employee ID or role..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span>
              {filteredEmployees.length} employee
              {filteredEmployees.length !== 1 ? "s" : ""}
              displayed
            </span>

          </div>

        </div>
      </section>

      {/* =====================================================
          ADD / EDIT FORM
      ====================================================== */}

      {showForm && (
        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

                {editingId !== null ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6M22 11h-6" />
                  </svg>
                )}

              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  {editingId !== null
                    ? "Edit Employee"
                    : "Add New Employee"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingId !== null
                    ? "Update the employee information below."
                    : "Create a new employee profile."}
                </p>
              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-7"
          >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <Input
                label="Employee ID"
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="EMP001"
                disabled={editingId !== null}
              />

              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
              />

              <Input
                label="Department / Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Software Developer"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
              />

              <Input
                label="Aadhar Number"
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                placeholder="Optional"
                maxLength={12}
              />

              <Input
                label="Monthly Base Salary"
                name="monthlySalary"
                type="number"
                value={form.monthlySalary}
                onChange={handleChange}
                placeholder="30000"
                min="1"
              />

            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
              >
                {editingId !== null
                  ? "Update Employee"
                  : "Add Employee"}
              </button>

            </div>

          </form>
        </section>
      )}

      {/* =====================================================
          EMPLOYEE LIST
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-base font-bold text-slate-900">
                Employee Directory
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {employees.length}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              View and manage your complete workforce.
            </p>

          </div>

          {searchTerm && (
            <span className="text-xs text-slate-400">
              Searching for{" "}
              <strong className="text-slate-700">
                "{searchTerm}"
              </strong>
            </span>
          )}

        </div>

        {filteredEmployees.length === 0 ? (
          <EmptyEmployees
            searchTerm={searchTerm}
            onClear={() => setSearchTerm("")}
            onAdd={openAddForm}
          />
        ) : (
          <>
            {/* Desktop/tablet */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Role
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Monthly Salary
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredEmployees.map((employee) => (
                    <EmployeeTableRow
                      key={employee.id}
                      employee={employee}
                      formatCurrency={formatCurrency}
                      onProfile={() =>
                        setSelectedEmployee(employee)
                      }
                      onEdit={() =>
                        handleEdit(employee)
                      }
                      onDelete={() =>
                        handleDelete(employee)
                      }
                    />
                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile */}

            <div className="divide-y divide-slate-100 md:hidden">

              {filteredEmployees.map((employee) => (
                <EmployeeMobileCard
                  key={employee.id}
                  employee={employee}
                  formatCurrency={formatCurrency}
                  onProfile={() =>
                    setSelectedEmployee(employee)
                  }
                  onEdit={() =>
                    handleEdit(employee)
                  }
                  onDelete={() =>
                    handleDelete(employee)
                  }
                />
              ))}

            </div>
          </>
        )}

      </section>

      {/* =====================================================
          PROFILE
      ====================================================== */}

      {selectedEmployee && (
        <EmployeeProfile
          employee={selectedEmployee}
          payroll={selectedPayroll}
          currentMonth={currentMonth}
          formatCurrency={formatCurrency}
          maskAadhar={maskAadhar}
          onClose={() => setSelectedEmployee(null)}
          onEdit={() => handleEdit(selectedEmployee)}
          onDelete={() => handleDelete(selectedEmployee)}
        />
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
  icon,
  className,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
        >
          {icon === "users" && (
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

          {icon === "search" && (
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
          )}

          {icon === "money" && (
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
        </div>

      </div>

    </div>
  );
};

/* ============================================================
   TABLE ROW
============================================================ */

const EmployeeTableRow = ({
  employee,
  formatCurrency,
  onProfile,
  onEdit,
  onDelete,
}) => {
  const initial =
    employee.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <tr className="group transition hover:bg-slate-50/70">

      <td className="px-6 py-4">

        <button
          type="button"
          onClick={onProfile}
          className="flex items-center gap-3 text-left"
        >

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
            {initial}
          </div>

          <div>

            <p className="font-semibold text-slate-800 transition group-hover:text-blue-600">
              {employee.name}
            </p>

            <p className="mt-0.5 font-mono text-[11px] text-slate-400">
              {employee.id}
            </p>

          </div>

        </button>

      </td>

      <td className="px-6 py-4">

        <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          {employee.role}
        </span>

      </td>

      <td className="px-6 py-4">

        <div>
          <p className="text-sm font-medium text-slate-700">
            {employee.phone}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Phone
          </p>
        </div>

      </td>

      <td className="px-6 py-4">

        <p className="text-sm font-bold text-slate-800">
          {formatCurrency(employee.monthlySalary)}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">
          Base salary
        </p>

      </td>

      <td className="px-6 py-4">

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={onProfile}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            View
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
};

/* ============================================================
   MOBILE EMPLOYEE CARD
============================================================ */

const EmployeeMobileCard = ({
  employee,
  formatCurrency,
  onProfile,
  onEdit,
  onDelete,
}) => {
  const initial =
    employee.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="p-4">

      <div className="flex items-start gap-3">

        <button
          type="button"
          onClick={onProfile}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600"
        >
          {initial}
        </button>

        <button
          type="button"
          onClick={onProfile}
          className="min-w-0 flex-1 text-left"
        >

          <p className="truncate font-bold text-slate-900">
            {employee.name}
          </p>

          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            {employee.id}
          </p>

          <span className="mt-2 inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {employee.role}
          </span>

        </button>

        <button
          type="button"
          onClick={onProfile}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Phone
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {employee.phone}
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Salary
          </p>

          <p className="mt-1 text-xs font-bold text-slate-800">
            {formatCurrency(employee.monthlySalary)}
          </p>

        </div>

      </div>

      <div className="mt-3 flex gap-2">

        <button
          type="button"
          onClick={onProfile}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-blue-200 px-4 py-2.5 text-xs font-bold text-blue-600"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

/* ============================================================
   EMPTY STATE
============================================================ */

const EmptyEmployees = ({
  searchTerm,
  onClear,
  onAdd,
}) => {
  return (
    <div className="px-6 py-16 text-center sm:px-10">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-7 w-7"
        >
          {searchTerm ? (
            <>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </>
          ) : (
            <>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </>
          )}
        </svg>

      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {searchTerm
          ? "No employees found"
          : "No employees yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {searchTerm
          ? `No employee matches "${searchTerm}". Try another name, ID or role.`
          : "Add your first employee to start managing your workforce."}
      </p>

      {searchTerm ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Clear Search
        </button>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/15 hover:bg-blue-700"
        >
          Add Employee
        </button>
      )}

    </div>
  );
};

/* ============================================================
   INPUT
============================================================ */

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  maxLength,
  min,
}) => {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        min={min}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      />

    </div>
  );
};

/* ============================================================
   PROFILE MODAL
============================================================ */

const EmployeeProfile = ({
  employee,
  payroll,
  currentMonth,
  formatCurrency,
  maskAadhar,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [historyMonth, setHistoryMonth] =
    useState(currentMonth);

  const attendanceData = useMemo(() => {
    try {
      const saved = localStorage.getItem("attendance");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, [historyMonth]);

  const monthAttendance = useMemo(() => {
    return Object.entries(attendanceData).reduce(
      (result, [dateKey, dailyRecords]) => {
        if (!dateKey.startsWith(`${historyMonth}-`)) {
          return result;
        }

        const record = dailyRecords.find(
          (item) =>
            String(item.employeeId) ===
            String(employee.id)
        );

        if (record) {
          result[dateKey] = record.status;
        }

        return result;
      },
      {}
    );
  }, [attendanceData, historyMonth, employee.id]);

  const monthDays = useMemo(() => {
    const [year, month] =
      historyMonth.split("-").map(Number);

    return {
      firstDay: new Date(year, month - 1, 1).getDay(),
      daysInMonth: new Date(year, month, 0).getDate(),
    };
  }, [historyMonth]);

  const historySummary = useMemo(() => {
    const summary = {
      Present: 0,
      "Half-Day": 0,
      Absent: 0,
      "On Leave": 0,
    };

    Object.values(monthAttendance).forEach((status) => {
      if (summary[status] !== undefined) {
        summary[status] += 1;
      }
    });

    const recorded =
      summary.Present +
      summary["Half-Day"] +
      summary.Absent +
      summary["On Leave"];

    const attendancePercentage =
      recorded > 0
        ? Math.round(
            ((summary.Present +
              summary["Half-Day"] * 0.5) /
              recorded) *
              100
          )
        : 0;

    return {
      ...summary,
      recorded,
      attendancePercentage,
    };
  }, [monthAttendance]);

  const changeHistoryMonth = (amount) => {
    const [year, month] =
      historyMonth.split("-").map(Number);

    const next = new Date(
      year,
      month - 1 + amount,
      1
    );

    setHistoryMonth(
      `${next.getFullYear()}-${String(
        next.getMonth() + 1
      ).padStart(2, "0")}`
    );
  };

  const historyMonthLabel = new Date(
    `${historyMonth}-01T00:00:00`
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case "Present":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "Half-Day":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Absent":
        return "border-red-200 bg-red-50 text-red-700";

      case "On Leave":
        return "border-blue-200 bg-blue-50 text-blue-700";

      default:
        return "border-slate-100 bg-slate-50 text-slate-300";
    }
  };

  const getStatusShort = (status) => {
    switch (status) {
      case "Present":
        return "P";

      case "Half-Day":
        return "H";

      case "Absent":
        return "A";

      case "On Leave":
        return "L";

      default:
        return "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >

      <div
        className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* Header */}

        <div className="relative overflow-hidden bg-slate-950 px-5 py-7 text-white sm:px-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-bold shadow-lg shadow-blue-900/30">
              {employee.name
                ?.charAt(0)
                ?.toUpperCase() || "?"}
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Employee Profile
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {employee.name}
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">

                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold">
                  {employee.id}
                </span>

                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold">
                  {employee.role}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="space-y-7 p-5 sm:p-8">

          {/* Personal Information */}

          <ProfileSection
            title="Personal Information"
            description="Employee contact and identification details."
          >

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <ProfileInfo
                label="Employee ID"
                value={employee.id}
              />

              <ProfileInfo
                label="Department / Role"
                value={employee.role}
              />

              <ProfileInfo
                label="Phone Number"
                value={employee.phone}
              />

              <ProfileInfo
                label="Aadhar Number"
                value={maskAadhar(employee.aadhar)}
              />

            </div>

          </ProfileSection>

          {/* Payroll */}

          <ProfileSection
            title="Current Payroll"
            description={`Payroll summary for ${new Date(
              `${currentMonth}-01T00:00:00`
            ).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}.`}
          >

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

              <PayrollCard
                label="Base Salary"
                value={formatCurrency(
                  employee.monthlySalary
                )}
                className="bg-slate-50"
              />

              <PayrollCard
                label="Payable Days"
                value={payroll?.payableDays ?? 0}
                className="bg-blue-50"
                valueClass="text-blue-700"
              />

              <PayrollCard
                label="Payable Salary"
                value={formatCurrency(
                  payroll?.payableSalary || 0
                )}
                className="bg-emerald-50"
                valueClass="text-emerald-700"
              />

            </div>

          </ProfileSection>

          {/* Attendance Summary */}

          <ProfileSection
            title="Attendance Summary"
            description="Attendance recorded during the current month."
          >

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <AttendanceCard
                label="Present"
                value={payroll?.presentDays ?? 0}
                className="bg-emerald-50 text-emerald-700"
              />

              <AttendanceCard
                label="Half-Day"
                value={payroll?.halfDays ?? 0}
                className="bg-amber-50 text-amber-700"
              />

              <AttendanceCard
                label="Absent"
                value={payroll?.absentDays ?? 0}
                className="bg-red-50 text-red-700"
              />

              <AttendanceCard
                label="On Leave"
                value={payroll?.leaveDays ?? 0}
                className="bg-blue-50 text-blue-700"
              />

            </div>

          </ProfileSection>

          {/* History */}

          <ProfileSection
            title="Attendance History"
            description={`Monthly attendance record for ${employee.name}.`}
          >

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-bold text-slate-900">
                    {historyMonthLabel}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {historySummary.recorded} recorded days
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      changeHistoryMonth(-1)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeHistoryMonth(1)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  >
                    →
                  </button>

                </div>

              </div>

              {/* History stats */}

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">

                <HistorySummaryCard
                  label="Present"
                  value={historySummary.Present}
                  className="bg-emerald-50 text-emerald-700"
                />

                <HistorySummaryCard
                  label="Half-Day"
                  value={historySummary["Half-Day"]}
                  className="bg-amber-50 text-amber-700"
                />

                <HistorySummaryCard
                  label="Absent"
                  value={historySummary.Absent}
                  className="bg-red-50 text-red-700"
                />

                <HistorySummaryCard
                  label="Leave"
                  value={historySummary["On Leave"]}
                  className="bg-blue-50 text-blue-700"
                />

                <HistorySummaryCard
                  label="Attendance"
                  value={`${historySummary.attendancePercentage}%`}
                  className="bg-slate-100 text-slate-700"
                />

              </div>

              {/* Calendar */}

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">

                <div className="grid grid-cols-7 gap-1.5 text-center sm:gap-2">

                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map((day) => (
                    <div
                      key={day}
                      className="py-2 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]"
                    >
                      {day}
                    </div>
                  ))}

                  {Array.from({
                    length: monthDays.firstDay,
                  }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square rounded-xl bg-slate-50"
                    />
                  ))}

                  {Array.from({
                    length: monthDays.daysInMonth,
                  }).map((_, index) => {
                    const day = index + 1;

                    const dateKey = `${historyMonth}-${String(
                      day
                    ).padStart(2, "0")}`;

                    const status =
                      monthAttendance[dateKey];

                    return (
                      <div
                        key={dateKey}
                        title={
                          status ||
                          "No attendance recorded"
                        }
                        className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-xs font-bold transition sm:text-sm ${getStatusStyles(
                          status
                        )}`}
                      >
                        <span>{day}</span>

                        {status && (
                          <span className="mt-0.5 text-[8px] font-extrabold sm:text-[9px]">
                            {getStatusShort(status)}
                          </span>
                        )}

                      </div>
                    );
                  })}

                </div>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-500 sm:text-xs">

                  <HistoryLegend
                    label="Present"
                    className="bg-emerald-500"
                  />

                  <HistoryLegend
                    label="Half-Day"
                    className="bg-amber-500"
                  />

                  <HistoryLegend
                    label="Absent"
                    className="bg-red-500"
                  />

                  <HistoryLegend
                    label="Leave"
                    className="bg-blue-500"
                  />

                  <HistoryLegend
                    label="Not Recorded"
                    className="bg-slate-300"
                  />

                </div>

              </div>

            </div>

          </ProfileSection>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Delete Employee
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
            >
              Edit Employee
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

/* ============================================================
   PROFILE SECTION
============================================================ */

const ProfileSection = ({
  title,
  description,
  children,
}) => {
  return (
    <section>

      <div className="mb-4">

        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

      {children}

    </section>
  );
};

/* ============================================================
   PROFILE INFO
============================================================ */

const ProfileInfo = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </p>

    </div>
  );
};

/* ============================================================
   PAYROLL CARD
============================================================ */

const PayrollCard = ({
  label,
  value,
  className,
  valueClass = "text-slate-900",
}) => {
  return (
    <div className={`rounded-xl p-4 ${className}`}>

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   ATTENDANCE CARD
============================================================ */

const AttendanceCard = ({
  label,
  value,
  className,
}) => {
  return (
    <div className={`rounded-xl p-4 ${className}`}>

      <p className="text-xs font-semibold">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   HISTORY SUMMARY
============================================================ */

const HistorySummaryCard = ({
  label,
  value,
  className,
}) => {
  return (
    <div className={`rounded-xl p-3 sm:p-4 ${className}`}>

      <p className="text-[10px] font-bold sm:text-xs">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold sm:text-2xl">
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   HISTORY LEGEND
============================================================ */

const HistoryLegend = ({
  label,
  className,
}) => {
  return (
    <span className="flex items-center gap-2">

      <span
        className={`h-2.5 w-2.5 rounded-full ${className}`}
      />

      {label}

    </span>
  );
};

export default EmployeeManager;