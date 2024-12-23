import { employeeRouter } from "./routers/employees"; // Import employeeRouter
import { departmentRouter } from "./routers/departments"; // Import departmentRouter
import { getEmployeesRouter } from "./routers/viewEmployeelist"; // Import getEmployeesRouter
import { router } from "./trpc"; // Import router from trpc
import { getdepartmentRouter } from "./routers/viewDepartments"; // Import getdepartmentRouter
import { getManagersRouter } from "./routers/getManagers"; // Import getManagersRouter

// Combine all routers into a single appRouter
export const appRouter = router({
  employee: employeeRouter, // Add employeeRouter
  department: departmentRouter, // Add departmentRouter
  employeelist: getEmployeesRouter, // Add getEmployeesRouter
  departmentlists: getdepartmentRouter, // Add getdepartmentRouter
  getManagers: getManagersRouter, // Add getManagersRouter
});

// Export the type of appRouter
export type appRouter = typeof appRouter;