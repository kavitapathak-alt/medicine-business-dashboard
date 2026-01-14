"use client"

import { Home, Users, Clock, FileText, DollarSign, BarChart3, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAuth()
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "employees", label: "Employees", icon: Users },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave Requests", icon: FileText },
    { id: "salary", label: "Salary & Payments", icon: DollarSign },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

      <aside
        className={`fixed md:relative z-30 top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">HR Admin</h1>
                <p className="text-xs text-slate-400">Management System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 md:hidden text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-cyan-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
