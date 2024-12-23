import { procedure, router } from "../trpc"; // Import procedure and router from trpc
import { z } from "zod"; // Import zod for schema validation
import { db } from "~/server/prisma"; // Import Prisma client
import { TRPCError } from "@trpc/server"; // Import TRPCError for error handling
import { roleGuard } from "~/server/routers/roleGuard"; // Import roleGuard for role-based access control

// Define the departmentRouter with create and update procedures
export const departmentRouter = router({
  // Procedure to create a department
  createDepartment: procedure
    .input(
      z.object({
        name: z.string().min(2, "Department name is required"), // Validate department name
        status: z.string().min(1, "Status is required"), // Validate status
        managerId: z.number(), // Validate manager ID
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, status, managerId } = input;

      // Restrict to HR-ADMIN only
      roleGuard(["ADMIN"])({ ctx });

      // Ensure the manager exists in the employee table
      const manager = await db.employee.findUnique({
        where: { id: managerId },
      });

      if (!manager) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Manager does not exist",
        });
      }

      // Create the department and link the manager
      const department = await db.department.create({
        data: {
          name,
          status,
          managerId,
          departmentEmployees: {
            create: {
              employeeId: managerId, 
            },
          },
        },
      });

      return {
        message: "Department created successfully",
        department,
      };
    }),

  // Procedure to update a department
  updateDepartment: procedure
    .input(
      z.object({
        id: z.number(), // Validate department ID
        name: z.string().min(2, "Department name is required"), // Validate department name
        status: z.string().min(1, "Status is required"), // Validate status
        managerId: z.number(), // Validate manager ID
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, status, managerId } = input;

      // Restrict to HR-ADMIN only
      roleGuard(["ADMIN"])({ ctx });

      // Ensure the department exists
      const department = await db.department.findUnique({
        where: { id },
      });

      if (!department) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Department not found",
        });
      }

      // Ensure the manager exists in the employee table
      const manager = await db.employee.findUnique({
        where: { id: managerId },
      });

      if (!manager) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Manager does not exist",
        });
      }

      // Update the department and maintain the manager's link
      const updatedDepartment = await db.department.update({
        where: { id },
        data: {
          name,
          status,
          managerId,
          departmentEmployees: {
            upsert: {
              where: { employeeId_departmentId: { employeeId: managerId, departmentId: id } },
              update: {},
              create: { employeeId: managerId },
            },
          },
        },
      });

      return {
        message: "Department updated successfully",
        department: updatedDepartment,
      };
    }),
});