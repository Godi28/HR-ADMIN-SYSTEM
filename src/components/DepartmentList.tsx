// Import React and useState hook for managing component state
import React, { useState } from "react";
// Import TRPC client for API communication
import { trpc } from "~/server/client";
// Import the form component for creating/editing departments
import CreateDepartmentForm from "~/components/CreateDepartmentForm";
// Import useSession hook for authentication state management
import { useSession } from "next-auth/react";

// Define the DepartmentList component as a Function Component
const DepartmentList: React.FC = () => {
  // State to track which department is being edited (null means no editing in progress)
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
  
  // Get authentication session status
  const { status: sessionStatus } = useSession();

  // Fetch departments data using TRPC query
  const { data: departments, isLoading: isDepartmentsLoading } = trpc.departmentlists.getDepartments.useQuery();

  // Handler function to start editing a department
  const handleEdit = (id: number) => {
    setEditingDepartmentId(id);
  };

  // Show loading state while session is being fetched
  if (sessionStatus === "loading") return <div>Loading session...</div>;

  // Render the component
  return (
    // Main container with padding and max width
    <div className="p-8 max-w-7xl mx-auto">
      {/* Conditional rendering based on whether we're editing */}
      {editingDepartmentId ? (
        // Show edit form when a department is being edited
        <CreateDepartmentForm
          // Find and pass the department being edited
          department={departments?.find((dept) => dept.id === editingDepartmentId)}
          // Handler to close the edit form
          onClose={() => setEditingDepartmentId(null)}
        />
      ) : (
        // Show department list when not editing
        <>
          {/* Table container with styling */}
          <div className="overflow-x-auto bg-white shadow-sm rounded-lg mb-8">
            {/* Department list table */}
            <table className="min-w-full table-fixed text-m text-center">
              {/* Table header */}
              <thead>
                <tr className="border-b bg-blue-100">
                  <th className="font-mono px-4 py-2 bg-gray-400">Department</th>
                  <th className="font-mono px-4 py-2 bg-gray-400">Manager</th>
                  <th className="font-mono px-4 py-2 bg-gray-400">Status</th>
                  <th className="font-mono px-4 py-2 bg-gray-400">Actions</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {/* Show loading state or department data */}
                {isDepartmentsLoading ? (
                  // Loading state row
                  <tr>
                    <td colSpan={4} className="font-mono text-center py-4 text-gray-500">Loading...</td>
                  </tr>
                ) : (
                  // Map through departments to create table rows
                  departments.map((department) => (
                    <tr key={department.id} className="font-mono hover:bg-gray-50">
                      {/* Department name cell */}
                      <td className="bg-gray-300 px-6 py-4">{department.name}</td>
                      {/* Manager name cell - combines first and last name */}
                      <td className="bg-gray-300 px-6 py-4">
                        {department.manager?.firstName} {department.manager?.lastName}
                      </td>
                      {/* Department status cell */}
                      <td className="bg-gray-300 px-6 py-4">{department.status}</td>
                      {/* Actions cell with edit button */}
                      <td className="bg-gray-300 px-6 py-4">
                        <button
                          onClick={() => handleEdit(department.id)}
                          className="font-mono text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Export the component to be used in app
export default DepartmentList; 