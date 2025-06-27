"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleChunkError = (error: Event | string) => {
      const errorMessage = typeof error === "string" ? error : error.type;
      if (/chunk/i.test(errorMessage)) {
        console.error("Chunk load error detected, reloading page");
        setTimeout(() => window.location.reload(), 2000);
      }
    };

    // Listen for runtime errors
    window.addEventListener("error", (event) => handleChunkError(event));

    // Listen for unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) =>
      handleChunkError(event.reason.message)
    );

    return () => {
      window.removeEventListener("error", handleChunkError as any);
      window.removeEventListener("unhandledrejection", handleChunkError as any);
    };
  }, []);

  if (hasError) {
    return (
      <div className='fixed inset-0 bg-background flex items-center justify-center'>
        <div className='text-center p-6 rounded-lg'>
          <h2 className='text-xl font-bold mb-2'>Theme Loading Error</h2>
          <p className='mb-4'>Reinitializing application...</p>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto'></div>
        </div>
      </div>
    );
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
