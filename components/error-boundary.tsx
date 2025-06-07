"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a ChunkLoadError
      const isChunkError =
        this.state.error?.message?.includes("Loading chunk") ||
        this.state.error?.name === "ChunkLoadError";

      if (isChunkError) {
        // Auto-reload for chunk errors
        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }

        return (
          <div className='min-h-screen flex items-center justify-center bg-background'>
            <div className='text-center space-y-4'>
              <AlertCircle className='h-8 w-8 text-muted-foreground mx-auto' />
              <p className='text-muted-foreground'>Loading application...</p>
            </div>
          </div>
        );
      }

      // For other errors
      return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
          <div className='text-center space-y-4 p-8 border rounded-lg max-w-md'>
            <AlertCircle className='h-12 w-12 text-destructive mx-auto' />
            <h2 className='text-xl font-semibold'>Something went wrong</h2>
            <p className='text-muted-foreground'>
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
