"use client"

import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { cn } from "@/lib/common/utils"

interface HeaderProps {
  className?: string
  title?: string
}

export function Header({ className, title = "Hotel San Miguel" }: HeaderProps) {
  return (
    <header className={cn("bg-white border-b sticky top-0 z-10 shadow-sm", className)}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1">
          <Link href="/dashboard">
            <h1 className="inline text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
              {title}
            </h1>
          </Link>
        </div>
        <UserNav />
      </div>
    </header>
  )
} 