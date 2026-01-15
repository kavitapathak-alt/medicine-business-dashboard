"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { AttendanceView } from "@/components/attendance-view"
import { EmployeeView } from "@/components/employee-view"
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("attendance")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen flex-col md:flex-row bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto bg-background">
          <div className="p-4 md:p-6 space-y-6">
        

            {activeTab === "attendance" && <AttendanceView />}
            {activeTab === "employees" && <EmployeeView />}
          </div>
        </main>
      </div>
    </div>
  )
}
