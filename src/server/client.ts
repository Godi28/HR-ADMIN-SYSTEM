import { createTRPCReact } from "@trpc/react-query"; // Import createTRPCReact from @trpc/react-query
import type { appRouter } from "."; // Import the type of appRouter

// Create a TRPC React instance with the appRouter type
export const trpc = createTRPCReact<appRouter>({});