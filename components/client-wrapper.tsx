"use client";

import { useEffect, useState } from "react";
import LoadingFallback from "@/components/loading-fallback";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
}
