"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='outline' size='icon' disabled>
        <Sun className='h-[1.2rem] w-[1.2rem]' />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant='outline' size='icon' onClick={toggleTheme}>
      {resolvedTheme === "dark" ? (
        <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
      ) : (
        <Moon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
