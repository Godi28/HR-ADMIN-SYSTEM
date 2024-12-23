'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider from react-query
import { httpBatchLink } from '@trpc/client'; // Import httpBatchLink from @trpc/client
import { trpc } from '~/server/client'; // Import trpc from the server client

// Provider component to wrap the application with necessary providers
export default function Provider({ children }: { children: React.ReactNode }) {
  // Initialize QueryClient using useState
  const [queryClient] = useState(() => new QueryClient());

  // Initialize trpcClient using useState
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc', // URL for the TRPC API
        }),
      ],
    })
  );

  return (
    // Wrap children with trpc.Provider and QueryClientProvider
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}