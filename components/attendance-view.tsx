"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Trash2, Edit2 } from "lucide-react"
import { AttendanceModal } from "@/components/modals/attendance-modal"

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  status: "present" | "absent" | "late"
  checkIn: string
  checkOut: string
  department: string
}

const SAMPLE_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "E001",
    employeeName: "Rajesh Kumar",
    date: "2025-01-14",
    status: "present",
    checkIn: "09:05 AM",
    checkOut: "06:30 PM",
    department: "Engineering",
  },
  {
    id: "2",
    employeeId: "E002",
    employeeName: "Priya Singh",
    date: "2025-01-14",
    status: "present",
    checkIn: "08:58 AM",
    checkOut: "06:15 PM",
    department: "HR",
  },
  {
    id: "3",
    employeeId: "E003",
    employeeName: "Amit Patel",
    date: "2025-01-14",
    status: "late",
    checkIn: "10:30 AM",
    checkOut: "06:45 PM",
    department: "Sales",
  },
]

export function AttendanceView() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SAMPLE_ATTENDANCE)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)

  const filteredAttendance = attendance.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500/20 text-green-400 border border-green-500/50"
      case "absent":
        return "bg-red-500/20 text-red-400 border border-red-500/50"
      case "late":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  const handleAddAttendance = (data: any) => {
    if (editingRecord) {
      setAttendance(attendance.map((rec) => (rec.id === editingRecord.id ? { ...rec, ...data } : rec)))
      setEditingRecord(null)
    } else {
      const newRecord: AttendanceRecord = {
        id: String(Date.now()),
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        date: data.date || new Date().toISOString().split("T")[0],
        status: data.status,
        checkIn: data.checkIn || "-",
        checkOut: data.checkOut || "-",
        department: data.department || "-",
      }
      setAttendance([newRecord, ...attendance])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setAttendance(attendance.filter((rec) => rec.id !== id))
  }

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              setEditingRecord(null)
              setIsModalOpen(true)
            }}
            className="flex-1 sm:flex-none bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Attendance
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-slate-900/50 border-b border-slate-700">
          <CardTitle className="text-lg md:text-xl text-white">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800">
                  <th className="px-4 py-3 text-left font-semibold text-slate-200">Employee</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden sm:table-cell">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200">Check In</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden lg:table-cell">Check Out</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr key={record.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{record.employeeName}</td>
                      <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{record.employeeId}</td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{record.department}</td>
                      <td className="px-4 py-3 text-slate-400">{record.date}</td>
                      <td className="px-4 py-3 text-slate-400">{record.checkIn}</td>
                      <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{record.checkOut}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(record)}
                            className="text-cyan-400 hover:bg-cyan-500/20"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(record.id)}
                            className="text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRecord(null)
        }}
        onSubmit={handleAddAttendance}
        editingRecord={editingRecord}
      />
    </div>
  )
}
