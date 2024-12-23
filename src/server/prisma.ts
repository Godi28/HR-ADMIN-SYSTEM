import { PrismaClient } from "@prisma/client"; // Import PrismaClient from @prisma/client

// Initialize a new PrismaClient instance
const db = new PrismaClient();

// Export the PrismaClient instance for use in other parts of the application
export { db };