'use client';

import LoginForm from '~/components/LoginForm'; // Import LoginForm component

// HomePage component
export default function HomePage() {
  return (
    <main className="font-mono p-10 border bg-blue-400 flex justify-center items-center h-screen">
      {/* Render the LoginForm component */}
      <LoginForm /> 
    </main>
  );
}