'use client';

import type { ReactNode } from 'react'; // Import ReactNode type for typing children prop
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider from next-auth
import '../styles/globals.css'; // Import global CSS styles
import Navbar from '~/components/Navbar'; // Import Navbar component
import Provider from '~/components/provider'; // Import custom Provider component

// RootLayout component to wrap the entire application
const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      {/* Wrap the layout with the custom Provider */}
      <Provider>
        <html lang="en">
          <head>
            <meta charSet="UTF-8" /> {/* Set character encoding */}
            <meta name="viewport" content="width=device-width, initial-scale=1" /> {/* Set viewport for responsive design */}
            <title>Human Resource Administration System</title> {/* Set the title of the document */}
          </head>
          <body>
            <Navbar /> {/* Render the Navbar component */}
            {children} {/* Render the children components */}
          </body>
        </html>
      </Provider>
    </SessionProvider>
  );
};

export default RootLayout; // Export RootLayout component
