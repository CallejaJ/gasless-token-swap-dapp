// contexts/SmartAccountContext.tsx
"use client";

import { createContext, useContext } from "react";
import { useSmartAccount as useOriginalHook } from "@/hooks/use-smart-account";

const SmartAccountContext = createContext<ReturnType<
  typeof useOriginalHook
> | null>(null);

export function SmartAccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useOriginalHook();
  return (
    <SmartAccountContext.Provider value={value}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccount() {
  const context = useContext(SmartAccountContext);
  if (!context) throw new Error("Must be used within SmartAccountProvider");
  return context;
}
