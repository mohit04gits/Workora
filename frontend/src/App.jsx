// import { useState } from "react";

// import { EmployeeProvider } from "./context/EmployeeContext";

// import Dashboard from "./Dashboard";
// import EmployeeManager from "./EmployeeManager";
// import Attendance from "./Attendance";
// import Payroll from "./Payroll";

// const PAGE_META = {
//   dashboard: {
//     title: "Dashboard",
//     subtitle: "Overview of your workforce and today's activity.",
//   },
//   employees: {
//     title: "Employees",
//     subtitle: "Manage employee information, profiles and salary details.",
//   },
//   attendance: {
//     title: "Attendance",
//     subtitle: "Track and manage daily workforce attendance.",
//   },
//   payroll: {
//     title: "Payroll",
//     subtitle: "Review monthly salary calculations and payroll records.",
//   },
// };

// function Icon({ name, className = "h-5 w-5" }) {
//   const common = {
//     fill: "none",
//     stroke: "currentColor",
//     strokeWidth: "1.8",
//     strokeLinecap: "round",
//     strokeLinejoin: "round",
//     className,
//     viewBox: "0 0 24 24",
//   };

//   switch (name) {
//     case "dashboard":
//       return (
//         <svg {...common}>
//           <rect x="3" y="3" width="7" height="7" rx="1.5" />
//           <rect x="14" y="3" width="7" height="7" rx="1.5" />
//           <rect x="3" y="14" width="7" height="7" rx="1.5" />
//           <rect x="14" y="14" width="7" height="7" rx="1.5" />
//         </svg>
//       );

//     case "employees":
//       return (
//         <svg {...common}>
//           <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//           <circle cx="9" cy="7" r="4" />
//           <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//           <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//         </svg>
//       );

//     case "attendance":
//       return (
//         <svg {...common}>
//           <rect x="3" y="4" width="18" height="17" rx="2.5" />
//           <path d="M16 2v4M8 2v4M3 10h18" />
//           <path d="m8 15 2 2 5-5" />
//         </svg>
//       );

//     case "payroll":
//       return (
//         <svg {...common}>
//           <rect x="3" y="5" width="18" height="14" rx="2.5" />
//           <path d="M7 15h.01M17 15h.01" />
//           <path d="M7 9h10" />
//           <circle cx="12" cy="15" r="2.5" />
//         </svg>
//       );

//     case "menu":
//       return (
//         <svg {...common}>
//           <path d="M4 7h16M4 12h16M4 17h16" />
//         </svg>
//       );

//     case "close":
//       return (
//         <svg {...common}>
//           <path d="m6 6 12 12M18 6 6 18" />
//         </svg>
//       );

//     case "chevron":
//       return (
//         <svg {...common}>
//           <path d="m9 18 6-6-6-6" />
//         </svg>
//       );

//     case "building":
//       return (
//         <svg {...common}>
//           <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
//           <path d="M2 21h20M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
//         </svg>
//       );

//     case "globe":
//       return (
//         <svg {...common}>
//           <circle cx="12" cy="12" r="9" />
//           <path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" />
//         </svg>
//       );

//     case "shield":
//       return (
//         <svg {...common}>
//           <path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" />
//           <path d="m9 12 2 2 4-4" />
//         </svg>
//       );

//     default:
//       return null;
//   }
// }

// function NavItem({
//   icon,
//   label,
//   active,
//   onClick,
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-200 ${
//         active
//           ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
//           : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
//       }`}
//     >
//       <span
//         className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
//           active
//             ? "bg-white/15"
//             : "bg-white/[0.04] group-hover:bg-white/[0.08]"
//         }`}
//       >
//         <Icon name={icon} className="h-[18px] w-[18px]" />
//       </span>

//       <span className="flex-1 text-sm font-semibold">
//         {label}
//       </span>

//       {active && (
//         <Icon
//           name="chevron"
//           className="h-4 w-4 opacity-70"
//         />
//       )}
//     </button>
//   );
// }

// function AppContent() {
//   const [activePage, setActivePage] =
//     useState("dashboard");

//   const [sidebarOpen, setSidebarOpen] =
//     useState(false);

//   const navigate = (page) => {
//     setActivePage(page);
//     setSidebarOpen(false);
//   };

//   const renderPage = () => {
//     switch (activePage) {
//       case "dashboard":
//         return <Dashboard />;

//       case "employees":
//         return <EmployeeManager />;

//       case "attendance":
//         return <Attendance />;

//       case "payroll":
//         return <Payroll />;

//       default:
//         return <Dashboard />;
//     }
//   };

//   const currentPage =
//     PAGE_META[activePage] || PAGE_META.dashboard;

//   return (
//     <div className="min-h-screen bg-[#f6f8fc]">

//       {/* =====================================================
//           MOBILE OVERLAY
//       ====================================================== */}

//       {sidebarOpen && (
//         <button
//           type="button"
//           aria-label="Close navigation"
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
//         />
//       )}

//       {/* =====================================================
//           SIDEBAR
//       ====================================================== */}

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden bg-[#0b1220] text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full"
//         }`}
//       >

//         {/* Sidebar background decoration */}

//         <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

//         <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

//         {/* =================================================
//             BRAND
//         ================================================== */}

//         <div className="relative flex h-[82px] items-center justify-between border-b border-white/[0.07] px-5">

//           <button
//             type="button"
//             onClick={() => navigate("dashboard")}
//             className="flex items-center gap-3"
//           >

//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">

//               <span className="text-lg font-black tracking-tight">
//                 W
//               </span>

//             </div>

//             <div className="text-left">

//               <h1 className="text-[21px] font-extrabold tracking-tight text-white">
//                 Workora
//               </h1>

//               <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
//                 Workforce Management
//               </p>

//             </div>

//           </button>

//           <button
//             type="button"
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close sidebar"
//             className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/10 hover:text-white lg:hidden"
//           >
//             <Icon
//               name="close"
//               className="h-5 w-5"
//             />
//           </button>

//         </div>

//         {/* =================================================
//             NAVIGATION
//         ================================================== */}

//         <div className="relative flex-1 overflow-y-auto px-4 py-6">

//           <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
//             Workspace
//           </p>

//           <nav className="space-y-1.5">

//             <NavItem
//               icon="dashboard"
//               label="Dashboard"
//               active={activePage === "dashboard"}
//               onClick={() =>
//                 navigate("dashboard")
//               }
//             />

//             <NavItem
//               icon="employees"
//               label="Employees"
//               active={activePage === "employees"}
//               onClick={() =>
//                 navigate("employees")
//               }
//             />

//             <NavItem
//               icon="attendance"
//               label="Attendance"
//               active={activePage === "attendance"}
//               onClick={() =>
//                 navigate("attendance")
//               }
//             />

//             <NavItem
//               icon="payroll"
//               label="Payroll"
//               active={activePage === "payroll"}
//               onClick={() =>
//                 navigate("payroll")
//               }
//             />

//           </nav>

//         </div>

//         {/* =================================================
//             BOTTOM WORKSPACE CARD
//         ================================================== */}

//         <div className="relative border-t border-white/[0.07] p-4">

//           <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">

//             <div className="flex items-center gap-3">

//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
//                 <Icon
//                   name="shield"
//                   className="h-[18px] w-[18px]"
//                 />
//               </div>

//               <div className="min-w-0">

//                 <p className="text-xs font-bold text-slate-200">
//                   Local Workspace
//                 </p>

//                 <div className="mt-1 flex items-center gap-1.5">

//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

//                   <span className="text-[10px] font-medium text-slate-500">
//                     System connected
//                   </span>

//                 </div>

//               </div>

//             </div>

//           </div>

//           <p className="mt-3 text-center text-[10px] font-medium text-slate-700">
//             Workora • Employee Management
//           </p>

//         </div>

//       </aside>

//       {/* =====================================================
//           MAIN AREA
//       ====================================================== */}

//       <div className="lg:pl-[280px]">

//         {/* =================================================
//             TOP BAR
//         ================================================== */}

//         <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

//           <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

//             <div className="flex min-w-0 items-center gap-3">

//               {/* Mobile menu */}

//               <button
//                 type="button"
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open navigation"
//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
//               >
//                 <Icon
//                   name="menu"
//                   className="h-5 w-5"
//                 />
//               </button>

//               <div className="min-w-0">

//                 <div className="flex items-center gap-2">

//                   <h2 className="truncate text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
//                     {currentPage.title}
//                   </h2>

//                 </div>

//                 <p className="mt-0.5 hidden truncate text-xs font-medium text-slate-400 sm:block">
//                   {currentPage.subtitle}
//                 </p>

//               </div>

//             </div>

//             {/* Right side */}

//             <div className="flex shrink-0 items-center gap-2 sm:gap-3">

//               <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 sm:flex">

//                 <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

//                 <span className="text-xs font-semibold text-slate-600">
//                   System Online
//                 </span>

//               </div>

//               <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">

//                 <Icon
//                   name="globe"
//                   className="h-4 w-4 text-slate-400"
//                 />

//                 <span className="text-xs font-bold text-slate-600">
//                   India
//                 </span>

//               </div>

//             </div>

//           </div>

//         </header>

//         {/* =================================================
//             PAGE CONTENT
//         ================================================== */}

//         <main className="min-h-[calc(100vh-76px)] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.045),transparent_28%),#f6f8fc] p-4 sm:p-6 lg:p-8">

//           {renderPage()}

//         </main>

//       </div>

//     </div>
//   );
// }

// function App() {
//   return (
//     <EmployeeProvider>
//       <AppContent />
//     </EmployeeProvider>
//   );
// }

// export default App;


















import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { EmployeeProvider } from "./context/EmployeeContext";

import Dashboard from "./Dashboard";
import EmployeeManager from "./EmployeeManager";
import Attendance from "./Attendance";
import Payroll from "./Payroll";

const PAGE_META = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your workforce and today's activity.",
  },
  employees: {
    title: "Employees",
    subtitle: "Manage employee information, profiles and salary details.",
  },
  attendance: {
    title: "Attendance",
    subtitle: "Track and manage daily workforce attendance.",
  },
  payroll: {
    title: "Payroll",
    subtitle: "Review monthly salary calculations and payroll records.",
  },
};

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "employees":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "attendance":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2.5" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="m8 15 2 2 5-5" />
        </svg>
      );

    case "payroll":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M7 15h.01M17 15h.01" />
          <path d="M7 9h10" />
          <circle cx="12" cy="15" r="2.5" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "building":
      return (
        <svg {...common}>
          <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
          <path d="M2 21h20M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
        </svg>
      );

    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    default:
      return null;
  }
}

function NavItem({ icon, label, to, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
            : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
              isActive
                ? "bg-white/15"
                : "bg-white/[0.04] group-hover:bg-white/[0.08]"
            }`}
          >
            <Icon name={icon} className="h-[18px] w-[18px]" />
          </span>

          <span className="flex-1 text-sm font-semibold">
            {label}
          </span>

          {isActive && (
            <Icon
              name="chevron"
              className="h-4 w-4 opacity-70"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const location = useLocation();

  const activePage =
    location.pathname.replace("/", "") || "dashboard";

  const currentPage =
    PAGE_META[activePage] || PAGE_META.dashboard;

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden bg-[#0b1220] text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Sidebar background decoration */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="relative flex h-[82px] items-center justify-between border-b border-white/[0.07] px-5">

          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">

              <span className="text-lg font-black tracking-tight">
                W
              </span>

            </div>

            <div className="text-left">

              <h1 className="text-[21px] font-extrabold tracking-tight text-white">
                Workora
              </h1>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Workforce Management
              </p>

            </div>

          </NavLink>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Icon
              name="close"
              className="h-5 w-5"
            />
          </button>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="relative flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
            Workspace
          </p>

          <nav className="space-y-1.5">

            <NavItem
              icon="dashboard"
              label="Dashboard"
              to="/dashboard"
              onNavigate={() => setSidebarOpen(false)}
            />

            <NavItem
              icon="employees"
              label="Employees"
              to="/employees"
              onNavigate={() => setSidebarOpen(false)}
            />

            <NavItem
              icon="attendance"
              label="Attendance"
              to="/attendance"
              onNavigate={() => setSidebarOpen(false)}
            />

            <NavItem
              icon="payroll"
              label="Payroll"
              to="/payroll"
              onNavigate={() => setSidebarOpen(false)}
            />

          </nav>

        </div>

        {/* =================================================
            BOTTOM WORKSPACE CARD
        ================================================== */}

        <div className="relative border-t border-white/[0.07] p-4">

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Icon
                  name="shield"
                  className="h-[18px] w-[18px]"
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold text-slate-200">
                  Local Workspace
                </p>

                <div className="mt-1 flex items-center gap-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[10px] font-medium text-slate-500">
                    System connected
                  </span>

                </div>

              </div>

            </div>

          </div>

          <p className="mt-3 text-center text-[10px] font-medium text-slate-700">
            Workora • Employee Management
          </p>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="lg:pl-[280px]">

        {/* =================================================
            TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            <div className="flex min-w-0 items-center gap-3">

              {/* Mobile menu */}

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
              >
                <Icon
                  name="menu"
                  className="h-5 w-5"
                />
              </button>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h2 className="truncate text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    {currentPage.title}
                  </h2>

                </div>

                <p className="mt-0.5 hidden truncate text-xs font-medium text-slate-400 sm:block">
                  {currentPage.subtitle}
                </p>

              </div>

            </div>

            {/* Right side */}

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 sm:flex">

                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

                <span className="text-xs font-semibold text-slate-600">
                  System Online
                </span>

              </div>

              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">

                <Icon
                  name="globe"
                  className="h-4 w-4 text-slate-400"
                />

                <span className="text-xs font-bold text-slate-600">
                  India
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main className="min-h-[calc(100vh-76px)] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.045),transparent_28%),#f6f8fc] p-4 sm:p-6 lg:p-8">

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeManager />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

        </main>

      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <AppContent />
      </EmployeeProvider>
    </BrowserRouter>
  );
}

export default App;