// const EMPLOYEES_KEY = "employees";
// const ATTENDANCE_KEY = "attendance";

// // ============================================================
// // Storage Helpers
// // ============================================================

// const getStorageData = (key, fallback) => {
//   try {
//     const data = localStorage.getItem(key);

//     if (!data) {
//       return fallback;
//     }

//     return JSON.parse(data);
//   } catch (error) {
//     console.error(`Error reading ${key}:`, error);
//     return fallback;
//   }
// };

// const setStorageData = (key, data) => {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//     return true;
//   } catch (error) {
//     console.error(`Error saving ${key}:`, error);
//     return false;
//   }
// };

// // ============================================================
// // Date Helpers
// // ============================================================

// export const formatDate = (date = new Date()) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// export const getToday = () => {
//   return formatDate(new Date());
// };

// export const getMonthKey = (date = new Date()) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");

//   return `${year}-${month}`;
// };

// export const getDaysInMonth = (monthKey) => {
//   const [year, month] = monthKey.split("-").map(Number);

//   if (!year || !month || month < 1 || month > 12) {
//     return 0;
//   }

//   return new Date(year, month, 0).getDate();
// };

// // ============================================================
// // Employees
// // ============================================================

// export const getEmployees = () => {
//   const employees = getStorageData(
//     EMPLOYEES_KEY,
//     []
//   );

//   return Array.isArray(employees)
//     ? employees
//     : [];
// };

// export const saveEmployees = (employees) => {
//   if (!Array.isArray(employees)) {
//     return false;
//   }

//   return setStorageData(
//     EMPLOYEES_KEY,
//     employees
//   );
// };

// export const addEmployee = (employeeData) => {
//   const employees = getEmployees();

//   const employee = {
//     id:
//       employeeData.id?.trim() ||
//       `EMP-${Date.now()}`,

//     name:
//       employeeData.name?.trim() || "",

//     role:
//       employeeData.role?.trim() || "",

//     phone:
//       employeeData.phone?.trim() || "",

//     aadhar:
//       employeeData.aadhar?.trim() || "",

//     monthlySalary:
//       Number(employeeData.monthlySalary) || 0,

//     createdAt:
//       employeeData.createdAt ||
//       new Date().toISOString(),
//   };

//   employees.push(employee);

//   saveEmployees(employees);

//   return employee;
// };

// export const updateEmployee = (
//   employeeId,
//   updatedData
// ) => {
//   const employees = getEmployees();

//   const index = employees.findIndex(
//     (employee) =>
//       String(employee.id) ===
//       String(employeeId)
//   );

//   if (index === -1) {
//     return null;
//   }

//   const existing = employees[index];

//   const updatedEmployee = {
//     ...existing,

//     name:
//       updatedData.name !== undefined
//         ? String(updatedData.name).trim()
//         : existing.name,

//     role:
//       updatedData.role !== undefined
//         ? String(updatedData.role).trim()
//         : existing.role,

//     phone:
//       updatedData.phone !== undefined
//         ? String(updatedData.phone).trim()
//         : existing.phone,

//     aadhar:
//       updatedData.aadhar !== undefined
//         ? String(updatedData.aadhar).trim()
//         : existing.aadhar,

//     monthlySalary:
//       updatedData.monthlySalary !== undefined
//         ? Number(updatedData.monthlySalary) || 0
//         : existing.monthlySalary,
//   };

//   employees[index] = updatedEmployee;

//   saveEmployees(employees);

//   return updatedEmployee;
// };

// export const deleteEmployee = (employeeId) => {
//   const employees = getEmployees();

//   const filteredEmployees =
//     employees.filter(
//       (employee) =>
//         String(employee.id) !==
//         String(employeeId)
//     );

//   if (
//     filteredEmployees.length ===
//     employees.length
//   ) {
//     return false;
//   }

//   saveEmployees(filteredEmployees);

//   // Remove attendance records
//   // belonging to deleted employee.
//   const attendance = getAttendance();

//   Object.keys(attendance).forEach((date) => {
//     attendance[date] =
//       attendance[date].filter(
//         (record) =>
//           String(record.employeeId) !==
//           String(employeeId)
//       );

//     if (attendance[date].length === 0) {
//       delete attendance[date];
//     }
//   });

//   saveAttendance(attendance);

//   return true;
// };

// export const getEmployeeById = (
//   employeeId
// ) => {
//   const employees = getEmployees();

//   return (
//     employees.find(
//       (employee) =>
//         String(employee.id) ===
//         String(employeeId)
//     ) || null
//   );
// };

// // ============================================================
// // Attendance
// // ============================================================

// export const getAttendance = () => {
//   const attendance = getStorageData(
//     ATTENDANCE_KEY,
//     {}
//   );

//   return attendance &&
//     typeof attendance === "object" &&
//     !Array.isArray(attendance)
//     ? attendance
//     : {};
// };

// export const saveAttendance = (
//   attendance
// ) => {
//   return setStorageData(
//     ATTENDANCE_KEY,
//     attendance
//   );
// };

// export const getAttendanceByDate = (
//   date
// ) => {
//   const attendance = getAttendance();

//   return Array.isArray(attendance[date])
//     ? attendance[date]
//     : [];
// };

// export const saveAttendanceByDate = (
//   date,
//   records
// ) => {
//   const attendance = getAttendance();

//   attendance[date] = records;

//   return saveAttendance(attendance);
// };

// export const setAttendance = (
//   date,
//   employeeId,
//   status
// ) => {
//   const validStatuses = [
//     "Present",
//     "Absent",
//     "Half-Day",
//     "On Leave",
//   ];

//   if (!validStatuses.includes(status)) {
//     return false;
//   }

//   const attendance = getAttendance();

//   if (!Array.isArray(attendance[date])) {
//     attendance[date] = [];
//   }

//   const index =
//     attendance[date].findIndex(
//       (record) =>
//         String(record.employeeId) ===
//         String(employeeId)
//     );

//   const record = {
//     employeeId,
//     status,
//   };

//   if (index >= 0) {
//     attendance[date][index] = record;
//   } else {
//     attendance[date].push(record);
//   }

//   return saveAttendance(attendance);
// };

// export const getEmployeeAttendance = (
//   employeeId,
//   date
// ) => {
//   const records =
//     getAttendanceByDate(date);

//   const record = records.find(
//     (item) =>
//       String(item.employeeId) ===
//       String(employeeId)
//   );

//   return record?.status || null;
// };

// export const deleteAttendance = (
//   date,
//   employeeId
// ) => {
//   const attendance = getAttendance();

//   if (!Array.isArray(attendance[date])) {
//     return false;
//   }

//   attendance[date] =
//     attendance[date].filter(
//       (record) =>
//         String(record.employeeId) !==
//         String(employeeId)
//     );

//   if (attendance[date].length === 0) {
//     delete attendance[date];
//   }

//   return saveAttendance(attendance);
// };

// // ============================================================
// // Attendance Statistics
// // ============================================================

// export const getAttendanceStats = (
//   date = getToday()
// ) => {
//   const employees = getEmployees();
//   const records =
//     getAttendanceByDate(date);

//   const stats = {
//     totalEmployees: employees.length,
//     markedEmployees: records.length,
//     present: 0,
//     absent: 0,
//     halfDay: 0,
//     onLeave: 0,
//   };

//   records.forEach((record) => {
//     switch (record.status) {
//       case "Present":
//         stats.present++;
//         break;

//       case "Absent":
//         stats.absent++;
//         break;

//       case "Half-Day":
//         stats.halfDay++;
//         break;

//       case "On Leave":
//         stats.onLeave++;
//         break;

//       default:
//         break;
//     }
//   });

//   stats.unmarked =
//     Math.max(
//       employees.length -
//         records.length,
//       0
//     );

//   return stats;
// };

// // ============================================================
// // Monthly Attendance
// // ============================================================

// export const getMonthlyAttendance = (
//   monthKey
// ) => {
//   const attendance = getAttendance();

//   const result = {};

//   Object.keys(attendance).forEach(
//     (date) => {
//       if (
//         date.startsWith(
//           `${monthKey}-`
//         )
//       ) {
//         result[date] =
//           attendance[date];
//       }
//     }
//   );

//   return result;
// };

// export const getEmployeeMonthlyAttendance = (
//   employeeId,
//   monthKey
// ) => {
//   const monthlyAttendance =
//     getMonthlyAttendance(
//       monthKey
//     );

//   const records = [];

//   Object.entries(
//     monthlyAttendance
//   ).forEach(
//     ([date, dateRecords]) => {
//       const employeeRecord =
//         dateRecords.find(
//           (record) =>
//             String(record.employeeId) ===
//             String(employeeId)
//         );

//       if (employeeRecord) {
//         records.push({
//           date,
//           status:
//             employeeRecord.status,
//         });
//       }
//     }
//   );

//   return records.sort((a, b) =>
//     a.date.localeCompare(b.date)
//   );
// };

// // ============================================================
// // Payroll
// // ============================================================

// export const calculateMonthlySalary = (
//   employeeId,
//   monthKey = getMonthKey()
// ) => {
//   const employee =
//     getEmployeeById(employeeId);

//   if (!employee) {
//     return null;
//   }

//   const monthlySalary =
//     Number(employee.monthlySalary) || 0;

//   const daysInMonth =
//     getDaysInMonth(monthKey);

//   if (!daysInMonth) {
//     return null;
//   }

//   const attendance =
//     getEmployeeMonthlyAttendance(
//       employeeId,
//       monthKey
//     );

//   let presentDays = 0;
//   let halfDays = 0;
//   let absentDays = 0;
//   let leaveDays = 0;

//   attendance.forEach(
//     (record) => {
//       switch (record.status) {
//         case "Present":
//           presentDays++;
//           break;

//         case "Half-Day":
//           halfDays++;
//           break;

//         case "Absent":
//           absentDays++;
//           break;

//         case "On Leave":
//           leaveDays++;
//           break;

//         default:
//           break;
//       }
//     }
//   );

//   const payableDays =
//     presentDays +
//     halfDays * 0.5;

//   const dailySalary =
//     monthlySalary /
//     daysInMonth;

//   const payableSalary =
//     dailySalary *
//     payableDays;

//   return {
//     employeeId:
//       employee.id,

//     employeeName:
//       employee.name,

//     month: monthKey,

//     monthlySalary,

//     daysInMonth,

//     presentDays,

//     halfDays,

//     absentDays,

//     leaveDays,

//     payableDays,

//     dailySalary,

//     payableSalary,
//   };
// };

// export const calculateMonthlyPayroll = (
//   monthKey = getMonthKey()
// ) => {
//   return getEmployees().map(
//     (employee) =>
//       calculateMonthlySalary(
//         employee.id,
//         monthKey
//       )
//   );
// };

// export const calculateTotalPayroll = (
//   monthKey = getMonthKey()
// ) => {
//   return calculateMonthlyPayroll(
//     monthKey
//   ).reduce(
//     (total, item) =>
//       total +
//       (item?.payableSalary || 0),
//     0
//   );
// };

// // ============================================================
// // Initialize
// // ============================================================

// export const initializeStorage = () => {
//   if (
//     localStorage.getItem(
//       EMPLOYEES_KEY
//     ) === null
//   ) {
//     saveEmployees([]);
//   }

//   if (
//     localStorage.getItem(
//       ATTENDANCE_KEY
//     ) === null
//   ) {
//     saveAttendance({});
//   }
// };

// const payrollService = {
//   getEmployees,
//   saveEmployees,
//   addEmployee,
//   updateEmployee,
//   deleteEmployee,
//   getEmployeeById,

//   getAttendance,
//   saveAttendance,
//   getAttendanceByDate,
//   saveAttendanceByDate,
//   setAttendance,
//   getEmployeeAttendance,
//   deleteAttendance,

//   getAttendanceStats,
//   getMonthlyAttendance,
//   getEmployeeMonthlyAttendance,

//   calculateMonthlySalary,
//   calculateMonthlyPayroll,
//   calculateTotalPayroll,

//   formatDate,
//   getToday,
//   getMonthKey,
//   getDaysInMonth,

//   initializeStorage,
// };

// export default payrollService;










// ============================================================
// Date Helpers
// ============================================================

export const formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getToday = () => {
  return formatDate(new Date());
};

export const getMonthKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

export const getDaysInMonth = (monthKey) => {
  if (!monthKey || !monthKey.includes("-")) {
    return 0;
  }

  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month || month < 1 || month > 12) {
    return 0;
  }

  return new Date(year, month, 0).getDate();
};

// ============================================================
// Attendance Helpers
// ============================================================

export const getEmployeeMonthlyAttendance = (
  employeeId,
  monthKey,
  attendance
) => {
  if (!attendance || typeof attendance !== "object") {
    return [];
  }

  const records = [];

  Object.entries(attendance).forEach(
    ([date, dateRecords]) => {
      if (!date.startsWith(`${monthKey}-`)) {
        return;
      }

      if (!Array.isArray(dateRecords)) {
        return;
      }

      const employeeRecord = dateRecords.find(
        (record) =>
          String(record.employeeId) ===
          String(employeeId)
      );

      if (employeeRecord) {
        records.push({
          date,
          status: employeeRecord.status,
        });
      }
    }
  );

  return records.sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// ============================================================
// Monthly Salary
// ============================================================

export const calculateMonthlySalary = (
  employeeId,
  monthKey = getMonthKey(),
  employees = [],
  attendance = {}
) => {
  const employee = employees.find(
    (item) =>
      String(item.id) === String(employeeId)
  );

  if (!employee) {
    return null;
  }

  const monthlySalary =
    Number(employee.monthlySalary) || 0;

  const daysInMonth =
    getDaysInMonth(monthKey);

  if (!daysInMonth) {
    return null;
  }

  const employeeAttendance =
    getEmployeeMonthlyAttendance(
      employeeId,
      monthKey,
      attendance
    );

  let presentDays = 0;
  let halfDays = 0;
  let absentDays = 0;
  let leaveDays = 0;

  employeeAttendance.forEach((record) => {
    switch (record.status) {
      case "Present":
        presentDays++;
        break;

      case "Half-Day":
        halfDays++;
        break;

      case "Absent":
        absentDays++;
        break;

      case "On Leave":
        leaveDays++;
        break;

      default:
        break;
    }
  });

  const payableDays =
    presentDays + halfDays * 0.5;

  const dailySalary =
    monthlySalary / daysInMonth;

  const payableSalary =
    dailySalary * payableDays;

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    month: monthKey,

    monthlySalary,
    daysInMonth,

    presentDays,
    halfDays,
    absentDays,
    leaveDays,

    payableDays,

    dailySalary,
    payableSalary,
  };
};

// ============================================================
// Monthly Payroll
// ============================================================

export const calculateMonthlyPayroll = (
  monthKey = getMonthKey(),
  employees = [],
  attendance = {}
) => {
  return employees
    .map((employee) =>
      calculateMonthlySalary(
        employee.id,
        monthKey,
        employees,
        attendance
      )
    )
    .filter(Boolean);
};

// ============================================================
// Total Payroll
// ============================================================

export const calculateTotalPayroll = (
  monthKey = getMonthKey(),
  employees = [],
  attendance = {}
) => {
  return calculateMonthlyPayroll(
    monthKey,
    employees,
    attendance
  ).reduce(
    (total, item) =>
      total +
      (Number(item?.payableSalary) || 0),
    0
  );
};

// ============================================================
// Default Export
// ============================================================

const payrollService = {
  formatDate,
  getToday,
  getMonthKey,
  getDaysInMonth,

  getEmployeeMonthlyAttendance,

  calculateMonthlySalary,
  calculateMonthlyPayroll,
  calculateTotalPayroll,
};

export default payrollService;