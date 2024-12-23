import { getSession } from 'next-auth/react'; // Import getSession from next-auth
import { initTRPC } from '@trpc/server'; // Import initTRPC from @trpc/server
import { type NextApiRequest } from 'next'; // Import NextApiRequest type from next

// Define the createContext function to create the context for TRPC
export const createContext = async ({ req }: { req: NextApiRequest }) => {
  const session = await getSession({ req }); // Get the session from the request
  console.log('Session in createContext:', session); // Log the session for debugging
  
  return { session }; // Return the session as part of the context
};

// Define the Context type based on the return type of createContext
export type Context = ReturnType<typeof createContext> extends Promise<infer T> ? T : never;

// Initialize TRPC with the context type
const trpc = initTRPC.context<Context>().create();

// Export the router and procedure from TRPC
export const router = trpc.router;
export const procedure = trpc.procedure;