"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Pequeño delay para asegurar que todo está cargado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
          <p className='text-muted-foreground'>Loading Gasless Token Swap...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
