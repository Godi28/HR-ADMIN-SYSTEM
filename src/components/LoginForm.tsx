'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define validation schema with zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'), // Email must be valid
  password: z.string().min(6, 'Password must be at least 6 characters'), // Password must be at least 6 characters
});

// Infer the type of the form values from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

// LoginForm component
const LoginForm: React.FC = () => {
  // Initialize the form with react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // Use zod for validation
  });

  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true); // Set loading state to true
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setIsLoading(false); // Set loading state to false

    if (result?.error) {
      alert('Invalid login credentials'); // Show error message if login fails
    } else {
      // Redirect to the dashboard if login is successful
      router.push('/home/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        <h2 className="font-mono flex justify-center text-white text-2xl font-bold mb-8">Login</h2>
        
        {/* Email field */}
        <div className="mb-4 relative">
          <label htmlFor="email" className="font-mono text-white block mb-2 font-medium">
            Email
          </label>
          <div className="flex items-center border rounded-lg">
            <input
              id="email"
              type="email"
              {...register('email')}
              className="bg-gray-400 font-mono w-full p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="font-mono text-white block mb-2 font-medium">
            Password
          </label>
          <div className="flex items-center border rounded-md">
            <input
              id="password"
              type="password"
              {...register('password')}
              className="bg-gray-400 font-mono w-full p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white transition duration-300 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-400 hover:bg-gray-300'
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; // Export LoginForm component