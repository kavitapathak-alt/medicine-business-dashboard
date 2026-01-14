"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden text-white hover:bg-slate-800">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-white">HR Admin Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  )
}
