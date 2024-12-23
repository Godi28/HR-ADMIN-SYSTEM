import { procedure, router } from "../trpc"; // Import procedure and router from trpc
import { z } from "zod"; // Import zod for schema validation
import { db } from "~/server/prisma"; // Import Prisma client
import argon2 from "argon2"; // Import argon2 for password hashing
import { TRPCError } from "@trpc/server"; // Import TRPCError for error handling
import { roleGuard } from '~/server/routers/roleGuard'; // Import roleGuard for role-based access control

// Define the employeeRouter with create procedure
export const employeeRouter = router({
  // Procedure to create an employee
  createEmployee: procedure
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"), // Validate first name
        lastName: z.string().min(1, "Last name is required"), // Validate last name
        telephone: z.string().min(7, "Telephone number is too short"), // Validate telephone number
        email: z.string().email("Invalid email address"), // Validate email address
        managerId: z.number().optional(), // Validate manager ID (optional)
        departments: z.array(z.number()).optional(), // Validate departments (optional)
        status: z.string().optional().default("ACTIVE"), // Validate status (optional, default to "ACTIVE")
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Restrict to HR-ADMIN only
      roleGuard(['ADMIN'])({ ctx });

      const { firstName, lastName, telephone, email, managerId, departments, status } = input;

      // Check if user already exists
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT", message: "A user with this email already exists" });
      }

      // Validate manager ID and ensure manager exists
      if (managerId) {
        const manager = await db.employee.findUnique({ where: { id: managerId } });
        if (!manager) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Manager not found" });
        }
      }

      // Default password for new employees
      const defaultPassword = "Password123#";
      const hashedPassword = await argon2.hash(defaultPassword);

      // Create the user
      const user = await db.user.create({
        data: { email, password: hashedPassword, role: "EMPLOYEE" },
      });

      // Create the employee and link them to the user and manager
      const employee = await db.employee.create({
        data: {
          firstName,
          lastName,
          telephone,
          email,
          status,
          managerId,
          userId: user.id,
          departmentEmployees: {
            create: departments?.map((departmentId) => ({ departmentId })) ?? [],
          },
        },
      });

      // If managerId is provided, link the employee as a subordinate to the manager
      if (managerId) {
        await db.employee.update({
          where: { id: managerId },
          data: {
            subordinates: {
              connect: { id: employee.id },
            },
          },
        });
      }

      return { message: "Employee and user created successfully", employee };
    }),
});