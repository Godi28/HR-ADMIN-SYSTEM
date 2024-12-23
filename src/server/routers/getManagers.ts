import { procedure, router } from "../trpc"; // Import procedure and router from trpc
import { db } from "~/server/prisma"; // Import Prisma client

// Define the getManagersRouter with a procedure to get managers
export const getManagersRouter = router({
  // Procedure to get managers
  getManagers: procedure.query(async () => {
    // Fetch managers from the employee table where the user role is "MANAGER"
    const managers = await db.employee.findMany({
      where: {
        user: { role: "MANAGER" },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        Department: {
          select: {
            id: true,
            name: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Map the fetched managers to a specific format
    return managers.map(manager => ({
      id: manager.id,
      name: `${manager.firstName} ${manager.lastName}`,
      departments: manager.Department,
      subordinatesStatus: manager.subordinates.length === 0 ? "none" : "some", // Determine subordinates status
      subordinates: manager.subordinates.map(sub => ({
        id: sub.id,
        name: `${sub.firstName} ${sub.lastName}`,
      })),
    }));
  }),
});