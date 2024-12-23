import { signOut, useSession } from "next-auth/react"; // Import signOut and useSession from next-auth
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

// Navbar component
const Navbar = () => {
  const { data: session, status } = useSession(); // Get session data and status using useSession
  const router = useRouter(); // Initialize router

  // Function to handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Sign out the user and redirect to the home page
    router.push('/'); // Redirect to the home page
  };

  return (
    <nav className="bg-blue-400 py-4 text-white text-sm ">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-mono font-bold text-xl">Human Resource Administration</h1>
        <ul className="flex space-x-4">
          {/* Render Logout button if user is authenticated */}
          {status === "authenticated" ? (
            <li>
              <button
                onClick={handleLogout}
                className="font-mono text-white hover:text-blue-200 transition-colors"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="font-mono text-white-500">You are not logged in</li> // Show message if user is not logged in
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; // Export Navbar component