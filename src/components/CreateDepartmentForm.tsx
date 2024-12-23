import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/server/client";

// Zod schema for department validation
const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"), // Department name must be at least 2 characters
  status: z
    .string()
    .refine((val) => val !== "SelectStatus", "Status is required"), // Status must be selected
  managerId: z
    .string()
    .refine((val) => val !== "SelectManager", "Manager is required"), // Manager must be selected
});

// Infer the type of the form values from the schema
type DepartmentFormValues = z.infer<typeof departmentSchema>;

// Define the props for the CreateDepartmentForm component
interface CreateDepartmentFormProps {
  department?: {
    id: number;
    name: string;
    status: string;
    managerId: number | null;
  };
}

// CreateDepartmentForm component
const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({ department, onClose }) => {
  // State to store the list of managers
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);

  // Initialize the form with react-hook-form
  const { control, handleSubmit, formState: { errors }, reset } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema), // Use zod for validation
    defaultValues: {
      name: "",
      status: "SelectStatus",
      managerId: "SelectManager",
    },
  });

  // Fetch managers using tRPC query
  const fetchManagers = trpc.getManagers.getManagers.useQuery();

  // Update managers state when data is fetched
  useEffect(() => {
    if (fetchManagers.data) {
      setManagers(fetchManagers.data);
    }
  }, [fetchManagers.data]);

  // If department is being edited, reset the form values with the department data
  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        status: department.status,
        managerId: (department.managerId ?? 0).toString(),
      });
    }
  }, [department, reset]);

  // Call the tRPC mutation to create or update the department
  const createDepartment = trpc.department.createDepartment.useMutation();
  const updateDepartment = trpc.department.updateDepartment.useMutation();

  // Handle form submission
  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      const selectedManager = managers.find(
        (manager) => manager.id === parseInt(data.managerId, 10)
      );

      if (!selectedManager) {
        alert("Manager not found!");
        return;
      }

      const payload = {
        ...data,
        managerId: parseInt(data.managerId, 10),
      };

      if (department) {
        // If editing an existing department
        await updateDepartment.mutateAsync({ id: department.id, ...payload });
        alert("Department updated successfully!");
      } else {
        // If creating a new department
        await createDepartment.mutateAsync(payload);
        alert("Department created successfully!");
      }

      reset();
    } catch (error) {
      console.error(error);
      alert("Error creating or updating department");
    }
  };

  // Handle form cancellation
  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Department Name */}
      <div className="flex items-center space-x-2">
        <label htmlFor="name" className="font-mono text-sm font-medium w-32">
          Department
        </label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="font-mono bg-gray-400 p-3 border rounded-md w-full sm:w-96"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm ml-2">{errors.name.message}</p>
        )}
      </div>

      {/* Status Dropdown */}
      <div className="flex items-center space-x-2">
        <label htmlFor="status" className="font-mono text-sm font-medium w-32">
          Status 
        </label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <select {...field} className="font-mono bg-gray-400 p-3 border rounded-md w-full sm:w-96">
              <option value="SelectStatus">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          )}
        />
        {errors.status && (
          <p className="text-red-500 text-sm ml-2">{errors.status.message}</p>
        )}
      </div>

      {/* Manager Dropdown */}
      <div className="flex items-center space-x-2">
        <label htmlFor="managerId" className="font-mono text-sm font-medium w-32">
          Manager 
        </label>
        <Controller
          control={control}
          name="managerId"
          render={({ field }) => (
            <select {...field} className="font-mono bg-gray-400 p-3 border rounded-md w-full sm:w-96">
              <option className="font-mono" value="SelectManager">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.managerId && (
          <p className="text-red-500 text-sm ml-2">{errors.managerId.message}</p>
        )}
      </div>

      {/* Save and Cancel buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="font-mono w-auto py-2 px-6 bg-gray-400 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono w-auto py-2 px-6 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateDepartmentForm;