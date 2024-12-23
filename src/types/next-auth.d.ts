import type NextAuth, { DefaultSession, DefaultUser } from 'next-auth'; // Import types from next-auth

// Extend the next-auth module to include custom properties
declare module 'next-auth' {
  // Extend the Session interface to include user id and role
  interface Session extends DefaultSession {
    user: {
      id: string; // Add user id
      role: string; // Add user role
    } & DefaultSession['user']; // Include default user properties
  }

  // Extend the User interface to include id and role
  interface User extends DefaultUser {
    id: string; // Add user id
    role: string; // Add user role
  }
}