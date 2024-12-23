'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '~/server/client';

// Define validation schema with zod
const employeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  telephone: z.string().min(2, "Telephone is required"),
  employeeManager: z.string().min(1, "Manager is required"),
  status: z.string().min(1, "Status is required"),
  id: z.number().optional(),
});

// Infer the type of the form values from the schema
type EmployeeFormValues = z.infer<typeof employeeSchema>;

// Define the props for the CreateEmployeeForm component
interface EmployeeFormProps {
  employee?: EmployeeFormValues; // Optional employee data for editing
  onSubmit: (data: EmployeeFormValues) => void; // Function to handle form submission
  onCancel: () => void; // Function to handle form cancellation
}

// CreateEmployeeForm component
const CreateEmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onCancel }) => {
  // Initialize the form with react-hook-form
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema), // Use zod for validation
    defaultValues: employee ?? { // Set default values for the form fields
      firstName: '',
      lastName: '',
      telephone: '',
      email: '',
      employeeManager: '',
      status: '',
    },
  });

  // State to store the list of managers
  const [managers, setManagers] = useState<{ id: string, name: string }[]>([]);

  // Fetch managers using TRPC
  const { data: managerData, isLoading, isError } = trpc.getManagers.getManagers.useQuery();

  // Populate form fields if employee data is provided
  useEffect(() => {
    if (employee) {
      setValue('firstName', employee.firstName);
      setValue('lastName', employee.lastName);
      setValue('telephone', employee.telephone);
      setValue('email', employee.email);
      setValue('status', employee.status);
      setValue('employeeManager', employee.employeeManager);
    } else {
      reset();
    }
  }, [employee, setValue, reset]);

  // Format managers data after fetching and update state
  useEffect(() => {
    if (managerData) {
      console.log("Manager data from backend:", managerData);
      const formattedManagers = managerData.map((manager: { id: number; name: string }) => ({
        id: manager.id.toString(),
        name: manager.name,
      }));
      setManagers(formattedManagers);
    }
  }, [managerData]);

  // Use TRPC mutation for creating or updating an employee
  const { mutateAsync: createEmployee } = trpc.employee.createEmployee.useMutation();
  const { mutateAsync: updateEmployee } = trpc.employeelist.updateEmployee.useMutation();

  // Handle form submission
  const handleFormSubmit = async (data: EmployeeFormValues) => {
    const payload = {
      ...data,
      managerId: parseInt(data.employeeManager, 10), // Convert manager ID to number
      departments: [], // Placeholder for departments
    };

    try {
      if (employee?.id) {
        await updateEmployee(payload); // Update existing employee
        alert('Employee updated successfully!');
      } else {
        await createEmployee(payload); // Create new employee
        alert('Employee created successfully!');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Failed to save employee');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="font-mono space-y-4">
      {/* First Name field */}
      <div className="font-mono flex items-center space-x-2">
        <label htmlFor="firstName" className="font-mono text-sm font-medium w-32">
          First Name
        </label>
        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            />
          )}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm ml-2">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name field */}
      <div className="flex items-center space-x-2">
        <label htmlFor="lastName" className="text-sm font-medium w-32">
          Last Name
        </label>
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            />
          )}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm ml-2">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email field */}
      <div className="flex items-center space-x-2">
        <label htmlFor="email" className="text-sm font-medium w-32">
          Email
        </label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm ml-2">{errors.email.message}</p>
        )}
      </div>

      {/* Telephone field */}
      <div className="flex items-center space-x-2">
        <label htmlFor="telephone" className="text-sm font-medium w-32">
          Telephone
        </label>
        <Controller
          control={control}
          name="telephone"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            />
          )}
        />
        {errors.telephone && (
          <p className="text-red-500 text-sm ml-2">{errors.telephone.message}</p>
        )}
      </div>

      {/* Status field */}
      <div className="flex items-center space-x-2">
        <label htmlFor="status" className="text-sm font-medium w-32">
          Status
        </label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <select
              {...field}
              className="bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          )}
        />
        {errors.status && (
          <p className="text-red-500 text-sm ml-2">{errors.status.message}</p>
        )}
      </div>

      {/* Manager field */}
      <div className="flex items-center space-x-2">
        <label htmlFor="employeeManager" className="text-sm font-medium w-32">
          Manager
        </label>
        <Controller
          control={control}
          name="employeeManager"
          render={({ field }) => (
            <select
              {...field}
              className="bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            >
              <option value="">Select Manager</option>
              {isLoading && <option>Loading...</option>}
              {isError && <option>Error loading managers</option>}
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.employeeManager && (
          <p className="text-red-500 text-sm ml-2">{errors.employeeManager.message}</p>
        )}
      </div>

      {/* Save and Cancel buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="w-auto py-2 px-6 bg-gray-400 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-auto py-2 px-6 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
// exporting component
export default CreateEmployeeForm;