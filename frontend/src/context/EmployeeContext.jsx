// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import axios from "axios";

// import {
//   calculateMonthlyPayroll,
//   calculateTotalPayroll,
// } from "../payrollService";

// const EmployeeContext = createContext(null);

// const EMPLOYEE_API_URL =
//   "http://localhost:5000/api/employees";

// const ATTENDANCE_API_URL =
//   "http://localhost:5000/api/attendance";

// export const EmployeeProvider = ({ children }) => {
//   const [employees, setEmployees] = useState([]);

//   const [attendance, setAttendance] = useState({});

//   const [loading, setLoading] = useState(true);

//   // ==========================================================
//   // Initial Data Loading
//   // ==========================================================

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Load employees from MongoDB
//         const employeeResponse = await axios.get(
//           EMPLOYEE_API_URL
//         );

//         setEmployees(employeeResponse.data);

//         // Load attendance from MongoDB
//         const attendanceResponse = await axios.get(
//           ATTENDANCE_API_URL
//         );

//         const attendanceData = {};

//         attendanceResponse.data.forEach((record) => {
//           if (!attendanceData[record.date]) {
//             attendanceData[record.date] = [];
//           }

//           attendanceData[record.date].push({
//             employeeId: record.employeeId,
//             status: record.status,
//           });
//         });

//         setAttendance(attendanceData);
//       } catch (error) {
//         console.error(
//           "Failed to load data:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // ==========================================================
//   // Employees
//   // ==========================================================

//   const addEmployee = async (employeeData) => {
//     try {
//       const response = await axios.post(
//         EMPLOYEE_API_URL,
//         employeeData
//       );

//       setEmployees((previous) => [
//         ...previous,
//         response.data,
//       ]);

//       return response.data;
//     } catch (error) {
//       console.error(
//         "Failed to add employee:",
//         error.response?.data || error.message
//       );

//       return null;
//     }
//   };

//   const updateEmployee = async (
//     employeeId,
//     employeeData
//   ) => {
//     try {
//       const response = await axios.put(
//         `${EMPLOYEE_API_URL}/${employeeId}`,
//         employeeData
//       );

//       setEmployees((previous) =>
//         previous.map((employee) =>
//           String(employee.id) ===
//           String(employeeId)
//             ? response.data
//             : employee
//         )
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         "Failed to update employee:",
//         error.response?.data || error.message
//       );

//       return null;
//     }
//   };

//   const deleteEmployee = async (employeeId) => {
//     try {
//       await axios.delete(
//         `${EMPLOYEE_API_URL}/${employeeId}`
//       );

//       setEmployees((previous) =>
//         previous.filter(
//           (employee) =>
//             String(employee.id) !==
//             String(employeeId)
//         )
//       );

//       // Remove employee's attendance from local state
//       setAttendance((previous) => {
//         const updated = {};

//         Object.keys(previous).forEach((date) => {
//           updated[date] = previous[date].filter(
//             (record) =>
//               String(record.employeeId) !==
//               String(employeeId)
//           );
//         });

//         return updated;
//       });

//       return true;
//     } catch (error) {
//       console.error(
//         "Failed to delete employee:",
//         error.response?.data || error.message
//       );

//       return false;
//     }
//   };

//   // ==========================================================
//   // Attendance
//   // ==========================================================

//   const markAttendance = async (
//     date,
//     employeeId,
//     status
//   ) => {
//     try {
//       const response = await axios.post(
//         ATTENDANCE_API_URL,
//         {
//           date,
//           employeeId,
//           status,
//         }
//       );

//       const savedAttendance = response.data;

//       setAttendance((previous) => {
//         const updated = {
//           ...previous,
//         };

//         if (!updated[date]) {
//           updated[date] = [];
//         }

//         const existingIndex = updated[
//           date
//         ].findIndex(
//           (record) =>
//             String(record.employeeId) ===
//             String(employeeId)
//         );

//         const newRecord = {
//           employeeId:
//             savedAttendance.employeeId,
//           status: savedAttendance.status,
//         };

//         if (existingIndex !== -1) {
//           updated[date] = [
//             ...updated[date],
//           ];

//           updated[date][existingIndex] =
//             newRecord;
//         } else {
//           updated[date] = [
//             ...updated[date],
//             newRecord,
//           ];
//         }

//         return updated;
//       });

//       return true;
//     } catch (error) {
//       console.error(
//         "Failed to mark attendance:",
//         error.response?.data || error.message
//       );

//       return false;
//     }
//   };

//   const getAttendanceForDate = (date) => {
//     return attendance[date] || [];
//   };

//   const getDailyStats = (date) => {
//     const records = attendance[date] || [];

//     return {
//       present: records.filter(
//         (record) => record.status === "Present"
//       ).length,

//       absent: records.filter(
//         (record) => record.status === "Absent"
//       ).length,

//       halfDay: records.filter(
//         (record) => record.status === "Half-Day"
//       ).length,

//       onLeave: records.filter(
//         (record) => record.status === "On Leave"
//       ).length,
//     };
//   };

//   // ==========================================================
//   // Payroll
//   // ==========================================================

//   const getMonthlyPayroll = (monthKey) => {
//     return calculateMonthlyPayroll(monthKey);
//   };

//   const getTotalPayroll = (monthKey) => {
//     return calculateTotalPayroll(monthKey);
//   };

//   // ==========================================================
//   // Context Value
//   // ==========================================================

//   const value = {
//     employees,
//     attendance,
//     loading,

//     addEmployee,
//     updateEmployee,
//     deleteEmployee,

//     markAttendance,
//     getAttendanceForDate,
//     getDailyStats,

//     getMonthlyPayroll,
//     getTotalPayroll,
//   };

//   return (
//     <EmployeeContext.Provider value={value}>
//       {children}
//     </EmployeeContext.Provider>
//   );
// };

// // ==========================================================
// // Custom Hook
// // ==========================================================

// export const useEmployees = () => {
//   const context = useContext(EmployeeContext);

//   if (!context) {
//     throw new Error(
//       "useEmployees must be used inside EmployeeProvider"
//     );
//   }

//   return context;
// };

// export default EmployeeContext;

import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

import {
  calculateMonthlyPayroll,
  calculateTotalPayroll,
} from "../payrollService";

const EmployeeContext = createContext(null);

const EMPLOYEE_API_URL = "http://localhost:5000/api/employees";

const ATTENDANCE_API_URL = "http://localhost:5000/api/attendance";





export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);

  // ==========================================================
  // Initial Data Loading
  // ==========================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        // ------------------------------------------------------
        // Load employees from MongoDB
        // ------------------------------------------------------

        const employeeResponse = await axios.get(EMPLOYEE_API_URL);

        setEmployees(employeeResponse.data);

        // ------------------------------------------------------
        // Load attendance from MongoDB
        // ------------------------------------------------------

        const attendanceResponse = await axios.get(ATTENDANCE_API_URL);

        const attendanceData = {};

        attendanceResponse.data.forEach((record) => {
          if (!attendanceData[record.date]) {
            attendanceData[record.date] = [];
          }

          attendanceData[record.date].push({
            employeeId: record.employeeId,
            status: record.status,
          });
        });

        setAttendance(attendanceData);
      } catch (error) {
        console.error(
          "Failed to load data:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================================================
  // Employees
  // ==========================================================

  // ----------------------------------------------------------
  // Add Employee
  // ----------------------------------------------------------

  const addEmployee = async (employeeData) => {
    try {
      const response = await axios.post(EMPLOYEE_API_URL, employeeData);

      setEmployees((previous) => [...previous, response.data]);

      return response.data;
    } catch (error) {
      console.error(
        "Failed to add employee:",
        error.response?.data || error.message,
      );

      return null;
    }
  };

  // ----------------------------------------------------------
  // Update Employee
  // ----------------------------------------------------------

  const updateEmployee = async (employeeId, employeeData) => {
    try {
      const response = await axios.put(
        `${EMPLOYEE_API_URL}/${employeeId}`,
        employeeData,
      );

      setEmployees((previous) =>
        previous.map((employee) =>
          String(employee.id) === String(employeeId) ? response.data : employee,
        ),
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to update employee:",
        error.response?.data || error.message,
      );

      return null;
    }
  };

  // ----------------------------------------------------------
  // Delete Employee
  // ----------------------------------------------------------

  const deleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${EMPLOYEE_API_URL}/${employeeId}`);

      setEmployees((previous) =>
        previous.filter(
          (employee) => String(employee.id) !== String(employeeId),
        ),
      );

      // Remove this employee's attendance
      // from the current frontend state.

      setAttendance((previous) => {
        const updated = {};

        Object.keys(previous).forEach((date) => {
          updated[date] = previous[date].filter(
            (record) => String(record.employeeId) !== String(employeeId),
          );
        });

        return updated;
      });

      return true;
    } catch (error) {
      console.error(
        "Failed to delete employee:",
        error.response?.data || error.message,
      );

      return false;
    }
  };

  // ==========================================================
  // Attendance
  // ==========================================================

  // ----------------------------------------------------------
  // Mark / Update Attendance
  // ----------------------------------------------------------

  const markAttendance = async (date, employeeId, status) => {
    try {
      const response = await axios.post(ATTENDANCE_API_URL, {
        date,
        employeeId,
        status,
      });

      const savedAttendance = response.data;

      setAttendance((previous) => {
        const updated = {
          ...previous,
        };

        if (!updated[date]) {
          updated[date] = [];
        }

        const existingIndex = updated[date].findIndex(
          (record) => String(record.employeeId) === String(employeeId),
        );

        const newRecord = {
          employeeId: savedAttendance.employeeId,
          status: savedAttendance.status,
        };

        if (existingIndex !== -1) {
          updated[date] = [...updated[date]];

          updated[date][existingIndex] = newRecord;
        } else {
          updated[date] = [...updated[date], newRecord];
        }

        return updated;
      });

      return true;
    } catch (error) {
      console.error(
        "Failed to mark attendance:",
        error.response?.data || error.message,
      );

      return false;
    }
  };

  // ----------------------------------------------------------
  // Get Attendance For Date
  // ----------------------------------------------------------

  const getAttendanceForDate = (date) => {
    return attendance[date] || [];
  };

  // ----------------------------------------------------------
  // Get Daily Stats
  // ----------------------------------------------------------

  const getDailyStats = (date) => {
    const records = attendance[date] || [];

    const present = records.filter(
      (record) => record.status === "Present",
    ).length;

    const absent = records.filter(
      (record) => record.status === "Absent",
    ).length;

    const halfDay = records.filter(
      (record) => record.status === "Half-Day",
    ).length;

    const onLeave = records.filter(
      (record) => record.status === "On Leave",
    ).length;

    const markedEmployees = records.length;

    const totalEmployees = employees.length;

    const unmarked = Math.max(totalEmployees - markedEmployees, 0);

    return {
      present,
      absent,
      halfDay,
      onLeave,
      markedEmployees,
      totalEmployees,
      unmarked,
    };
  };

  // ==========================================================
  // Payroll
  // ==========================================================

  const getMonthlyPayroll = (monthKey) => {
    return calculateMonthlyPayroll(monthKey, employees, attendance);
  };

  const getTotalPayroll = (monthKey) => {
    return calculateTotalPayroll(monthKey, employees, attendance);
  };

  // ==========================================================
  // Context Value
  // ==========================================================

  const value = {
    employees,
    attendance,
    loading,

    // Employees
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Attendance
    markAttendance,
    getAttendanceForDate,
    getDailyStats,

    // Payroll
    getMonthlyPayroll,
    getTotalPayroll,
  };

  // ==========================================================
  // Provider
  // ==========================================================

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

// ==========================================================
// Custom Hook
// ==========================================================

export const useEmployees = () => {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error("useEmployees must be used inside EmployeeProvider");
  }

  return context;
};

export default EmployeeContext;
