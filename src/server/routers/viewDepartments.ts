// Import necessary utilities for creating procedures and routers in tRPC
import { procedure, router } from "../trpc"; 
import { z } from "zod"; // Import Zod for input validation
import { TRPCError } from "@trpc/server"; // Import TRPCError to handle errors
import { db } from "~/server/prisma"; // Import the Prisma client for database interactions

// Define the router for department-related operations
export const getdepartmentRouter = router({
  
  // Fetch all departments along with manager details
  getDepartments: procedure.query(async ({ ctx }) => {
    
    // Check if the user is logged in by verifying the session
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource.", // Error message for unauthorized access
      });
    }

    // Retrieve the user role from the session
    const userRole = ctx.session.user.role;

    // Check if the user role is one of the allowed roles
    if (!["ADMIN", "MANAGER", "EMPLOYEE"].includes(userRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Access Denied.", // Error message for forbidden access
      });
    }

    try {
      // If the user is an employee, deny access to view all departments
      if (userRole === "EMPLOYEE") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Employees cannot view all departments.", // Specific error for employees
        });
      }

      // If the user is a manager, return only departments managed by that manager
      if (userRole === "MANAGER") {
        return await db.department.findMany({
          where: {
            managerId: ctx.session.user.id, // Filter departments by manager ID
          },
          include: {
            manager: {
              select: {
                id: true, // Select manager ID
                firstName: true, // Select manager's first name
                lastName: true, // Select manager's last name
              },
            },
          },
        });
      }

      // If the user is an admin, return all departments along with manager details
      if (userRole === "ADMIN") {
        return await db.department.findMany({
          include: {
            manager: {
              select: {
                id: true, // Select manager ID
                firstName: true, // Select manager's first name
                lastName: true, // Select manager's last name
              },
            },
          },
        });
      }
    } catch (error: unknown) {
      // Handle errors that may occur during fetching
      if (error instanceof Error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error retrieving departments: ${error.message}`, // Provide specific error message
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred while retrieving departments.", // Fallback error message
      });
    }
  }),

  // Update department status
  updateDepartmentStatus: procedure
    .input(
      z.object({ // Validate the input using Zod
        id: z.number(), // Expected department ID as a number
        status: z.enum(["Active", "Inactive"]), // Status can either be "Active" or "Inactive"
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Ensure the user is logged in for this action
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to perform this action.", // Error message for unauthorized action
        });
      }

      const userRole = ctx.session.user.role;

      // Only allow users with the ADMIN role to update department status
      if (userRole !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only HR Admins can update department status.", // Error message for unauthorized status update
        });
      }

      try {
        // Perform the update operation on the department status
        return await db.department.update({
          where: { id: input.id }, // Specify the department to update using the provided ID
          data: { status: input.status }, // Update the status with the provided value
        });
      } catch (error: unknown) {
        // Handle errors that may occur during the update
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error updating department status: ${error.message}`, // Provide specific error message
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while updating the department status.", // Fallback error message
        });
      }
    }),
});