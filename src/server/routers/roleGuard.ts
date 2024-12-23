// Import the TRPCError class for handling errors in tRPC
import { TRPCError } from '@trpc/server';
// Import the Context type, which represents the contextual information for tRPC procedures
import { type Context } from '~/server/trpc';

// Define a role guard function that restricts access based on user roles
export function roleGuard(roles: string[]) {
  // Return a function that takes an object containing the context
  return ({ ctx }: { ctx: Context }) => {
    // Check if there is no user in the session or if the user's role is not included in the allowed roles
    if (!ctx.session?.user || !roles.includes(ctx.session.user.role)) {
      // Log the session context to help with debugging if access is denied
      console.log("ctx session ", ctx.session);
      // Throw a TRPCError with a FORBIDDEN code and an access denied message
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Access Denied' });
    }
  };
}