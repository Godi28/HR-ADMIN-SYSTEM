// Import the appRouter from the server module. This router defines the tRPC API endpoints.
import { appRouter } from "~/server";

// Import the fetchRequestHandler, which allows handling tRPC requests using the Fetch API.
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// Import getServerSession from next-auth to fetch the session details for authenticated users.
import { getServerSession } from "next-auth";

// Import the authentication options used by next-auth.
import { authOptions } from "~/app/api/auth/[...nextauth]/handler";

// Import the Context type, which defines the structure of the context object for tRPC procedures.
import { type Context } from "~/server/trpc";

// Function to create a tRPC context, which is passed to each procedure.
const createContext = async (req: Request): Promise<Context> => { 
  // Fetch the session using next-auth's getServerSession, utilizing the provided auth options.
  const session = await getServerSession(authOptions); 

  // Log the session for debugging purposes to ensure it's being fetched correctly.
  console.log("Session in createContext:", session); 

  // Return the session object as part of the tRPC context.
  return { 
    session, 
  };
};

// Define the handler function that processes incoming requests.
const handler = async (req: Request) => { 
  // Use the fetchRequestHandler to process the tRPC requests.
  return fetchRequestHandler({ 
    // Specify the endpoint for the tRPC API.
    endpoint: "/api/trpc", 

    // Use the appRouter to handle the tRPC requests.
    router: appRouter, 

    // Pass the incoming request to the handler.
    req, 

    // Use the createContext function to generate the context for the tRPC procedures.
    createContext: async () => await createContext(req), 
  });
};

// Export the handler function for both GET and POST HTTP methods.
// This enables handling tRPC requests via these methods.
export { handler as GET, handler as POST }; 
