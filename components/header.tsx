"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Wallet } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="text-xl font-bold">Gasless Swap</span>
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}
