"use client";

import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className='border-b'>
      <div className='container flex h-16 items-center justify-between px-24'>
        <Link
          href='/'
          className='flex items-center gap-3 hover:opacity-80 transition-opacity'
        >
          <div className='flex items-center justify-center p-1'>
            <Image
              src='/gasless-token-swap.png'
              alt='Gasless Token Swap'
              width={48}
              height={48}
              className='h-12 w-12'
            />
          </div>
          <span className='text-xl font-bold tracking-tight'>Gasless Swap</span>
        </Link>
        <div className='pr-2'>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
