// Indicate that this is a client-side React component
'use client';

// Import React and useState for component creation and state management
import React, { useState } from 'react';

// Import various components for different functionalities
import CreateDepartmentForm from '~/components/CreateDepartmentForm';
import CreateEmployeeForm from '~/components/CreateEmployeeForm';
import EmployeeList from '~/components/EmployeeList';
import DepartmentList from '~/components/DepartmentList';

// Import the next-auth hook to manage session data
import { useSession } from 'next-auth/react';

// Define the links for the sidebar navigation
const sidebarLinks = [
  { label: 'Home Page' },
  { label: 'Create Employee' },
  { label: 'Employee List' },
  { label: 'Create Department' },
  { label: 'Department List' },
];

// Define the main Home component
const Home: React.FC = () => {
  // Get the current session data and loading status using next-auth
  const { data: session, status } = useSession();

  // State to keep track of the currently active view in the sidebar
  const [activeView, setActiveView] = useState<string>('Home Page');

  // Function to render content dynamically based on the active view
  const renderHeading = () => {
    switch (activeView) {
      case 'Employee List':
        return <EmployeeList />; // Render the Employee List view
      case 'Create Employee':
        return <CreateEmployeeForm />; // Render the Create Employee form
      case 'Department List':
        return <DepartmentList />; // Render the Department List view
      case 'Create Department':
        return <CreateDepartmentForm />; // Render the Create Department form
      default:
        // Render the default home page content
        return <div className='font-mono text-white'>Welcome to the Human Resource Administration Home Page</div>;
    }
  };

  // Show a loading indicator while session data is being fetched
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Render the main layout of the Home page
  return (
    <div className="text-white flex min-h-screen flex-col">
      {/* Main container with a sidebar and content area */}
      <div className="bg-blue-400 p-3 border flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-400 rounded-md text-white p-4">
          {/* Display the role of the logged-in user */}
          <h2 className="font-mono text-xl font-bold mb-8">
            Role: {session?.user?.role ?? 'N/A'}
          </h2>

          {/* Sidebar navigation links */}
          <ul>
            {sidebarLinks.map((link, index) => {
              // Restrict "Create Employee" to ADMIN role
              if (link.label === 'Create Employee' && session?.user?.role !== 'ADMIN') {
                return null;
              }

              // Restrict "Create Department" to ADMIN role
              if (link.label === 'Create Department' && session?.user?.role !== 'ADMIN') {
                return null; 
              }

              // Restrict "Department List" for EMPLOYEE role
              if (link.label === 'Department List' && session?.user?.role === 'EMPLOYEE') {
                return null;
              }

              // Render each sidebar link as a clickable list item
              return (
                <li
                  key={index}
                  onClick={() => setActiveView(link.label)} // Update active view on click
                  className="font-mono flex items-center py-2 px-4 mb-4 rounded hover:bg-gray-300 cursor-pointer"
                >          
                  {link.label}
                  <br/><br/> 
                </li>
              );
            })}
          </ul>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Heading for the active view */}
          <div className="flex justify-between items-center mb-8">
            <div className="font-mono text-2xl font-semibold">{activeView}</div>
          </div>

          {/* Render the dynamic content based on the active view */}
          <div className="space-y-8">{renderHeading()}</div>
        </div>
      </div>
    </div>
  );
};

// Export the Home component as the default export
export default Home;
