

'use client'

import React, { useState } from "react";
import { trpc } from "~/server/client";
import CreateEmployeeForm from "~/components/CreateEmployeeForm";

// Define the Employee type
type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  status: "Active" | "Inactive";
  manager?: {
    firstName: string;
    lastName: string;
  } | null;
};

const EmployeeList: React.FC = () => {


  // State for employees, pagination, search, and filter
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);

  // Fetch employees and managers data
  const { data: employees, isLoading } = trpc.employeelist.getEmployees.useQuery();

  // Start editing an employee
  const startEditing = (employee: Employee) => {
    setEditingEmployeeId(employee.id);
    setEditedEmployee(employee);
  };
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Render CreateEmployeeForm only when editing */}
      {editingEmployeeId ? (
        <CreateEmployeeForm employee={editedEmployee} cancelEdit={() => setEditingEmployeeId(null)} />
      ) : (
        <>
          {/* Employees Table */}
          {isLoading ? (
            <p className="font-mono">Loading...</p>
          ) : (
            <div className="overflow-x-auto rounded-s shadow-md">
              <table className=" font-mono min-w-full table-fixed text-m text-center">
                <thead>
                  <tr>
                    <th className="font-mono px-4 py-2 bg-gray-400">First Name</th>
                    <th className="font-mono px-4 py-2 bg-gray-400">Last Name</th>
                    <th className="font-mono px-4 py-2 bg-gray-400">Email</th>
                    <th className="font-mono px-4 py-2 bg-gray-400">Telephone</th>
                    <th className="font-mono px-4 py-2 bg-gray-400">Manager</th>
                    <th className="font-mono px-4 py-2 bg-gray-400">Status</th>
                    <th className="font-mono px-4 py-2 bg-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="font-mono bg-gray-300 px-4 py-2">{employee.firstName}</td>
                      <td className="font-mono bg-gray-300 px-4 py-2">{employee.lastName}</td>
                      <td className="font-mono bg-gray-300 px-4 py-2">{employee.email}</td>
                      <td className="font-mono bg-gray-300 px-4 py-2">{employee.telephone}</td>
                      <td className="font-mono bg-gray-300 px-4 py-2">{employee.manager?.firstName} {employee.manager?.lastName}</td>
                      <td className="font-mono bg-gray-300 px-4 py-2">{employee.status}</td>
                      <td className="font-mono bg-gray-300 px-4 py-2 space-x-2">
                        <button
                          onClick={() => startEditing(employee)}
                          className=" font-mono px-4 py-2 text-blue-500 underline bg-transparent border-0 cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 flex justify-e items-center ml-auto">
            <div className="flex space-x-2">
            </div>
          </div>
        </>
      )}
    </div>
  );
};
// exporting component
export default EmployeeList;
