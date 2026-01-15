"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Download,
  Trash2,
  Edit2,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Users,
} from "lucide-react"
import { AttendanceModal } from "@/components/modals/attendance-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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

export interface Employee {
  id: string
  name: string
  department: string
  email?: string
  position?: string
  salary?: string
  joinDate?: string
}

const ATT_STORAGE_KEY = "attendance_records_v1"
const EMP_STORAGE_KEY = "employees_records_v1"

export function AttendanceView() {
  // ✅ Attendance (refresh safe)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = window.localStorage.getItem(ATT_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as AttendanceRecord[]) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  // ✅ Employees (dropdown ke liye)
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = window.localStorage.getItem(EMP_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Employee[]) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("today")

  // ✅ Save attendance on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(ATT_STORAGE_KEY, JSON.stringify(attendance))
    } catch (e) {
      console.error("localStorage save error:", e)
    }
  }, [attendance])

  // ✅ Keep employees updated (same tab + other tab)
  useEffect(() => {
    const reloadEmployees = () => {
      try {
        const raw = window.localStorage.getItem(EMP_STORAGE_KEY)
        const parsed = raw ? (JSON.parse(raw) as Employee[]) : []
        setEmployees(Array.isArray(parsed) ? parsed : [])
      } catch {
        setEmployees([])
      }
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === EMP_STORAGE_KEY) reloadEmployees()
    }

    // other tab update => storage
    window.addEventListener("storage", onStorage)
    // same tab me employee add karke yaha aao => focus
    window.addEventListener("focus", reloadEmployees)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("focus", reloadEmployees)
    }
  }, [])

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || record.status === statusFilter

      // date filter
      let matchesDate = true
      if (dateFilter === "today") {
        matchesDate = record.date === todayStr
      } else if (dateFilter === "week") {
        const now = new Date()
        const d = new Date(record.date)
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
        matchesDate = diff >= 0 && diff <= 7
      } else if (dateFilter === "month") {
        const now = new Date()
        const d = new Date(record.date)
        matchesDate = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [attendance, searchTerm, statusFilter, dateFilter, todayStr])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 border border-green-500/30"
      case "absent":
        return "bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 border border-red-500/30"
      case "late":
        return "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30"
      default:
        return "bg-gray-700 text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-3 w-3 mr-1" />
      case "absent":
        return <XCircle className="h-3 w-3 mr-1" />
      case "late":
        return <AlertCircle className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const getStatusStats = () => {
    const total = attendance.length
    const present = attendance.filter((r) => r.status === "present").length
    const absent = attendance.filter((r) => r.status === "absent").length
    const late = attendance.filter((r) => r.status === "late").length
    return { total, present, absent, late }
  }

  const stats = getStatusStats()

  const handleAddAttendance = (data: any) => {
    if (editingRecord) {
      setAttendance((prev) =>
        prev.map((rec) => (rec.id === editingRecord.id ? { ...rec, ...data } : rec))
      )
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
      setAttendance((prev) => [newRecord, ...prev])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      setAttendance((prev) => prev.filter((rec) => rec.id !== id))
    }
  }

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // ✅ Export CSV
  const handleExport = () => {
    const headers = ["EmployeeId", "EmployeeName", "Department", "Date", "Status", "CheckIn", "CheckOut"]
    const rows = attendance.map((r) => [
      r.employeeId,
      r.employeeName,
      r.department,
      r.date,
      r.status,
      r.checkIn,
      r.checkOut,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-gray-400 text-sm md:text-base mt-1">
              Track and manage employee attendance records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden md:block">{filteredAttendance.length} records</span>

            <Button
              onClick={() => {
                setEditingRecord(null)
                setIsModalOpen(true)
              }}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>

            <Button
              onClick={handleExport}
              variant="outline"
              className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Present</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-emerald-400">{stats.present}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Late</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-amber-400">{stats.late}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Absent</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-red-400">{stats.absent}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Search by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-gray-700 bg-gray-800">
                <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-white hover:bg-gray-700">
                  All Status
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={() => setStatusFilter("present")} className="text-white hover:bg-gray-700">
                  Present
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("late")} className="text-white hover:bg-gray-700">
                  Late
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("absent")} className="text-white hover:bg-gray-700">
                  Absent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date: {dateFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-gray-700 bg-gray-800">
                <DropdownMenuItem onClick={() => setDateFilter("today")} className="text-white hover:bg-gray-700">
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter("week")} className="text-white hover:bg-gray-700">
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter("month")} className="text-white hover:bg-gray-700">
                  This Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Attendance Records */}
        <Card className="bg-gradient-to-b from-gray-800/50 to-gray-900/30 border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900/50 border-b border-gray-700/50">
            <CardTitle className="text-lg md:text-xl text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              Attendance ({filteredAttendance.length} records)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Desktop */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900">
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Employee</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Department</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Check In</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Check Out</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Hours</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-gray-700 group-hover:border-emerald-500/50 transition-colors">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-600">
                                  {getInitials(record.employeeName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">{record.employeeName}</p>
                                <p className="text-sm text-gray-400">ID: {record.employeeId}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{record.department}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-emerald-400" />
                              <span className={`font-medium ${record.checkIn === "-" ? "text-gray-400" : "text-white"}`}>
                                {record.checkIn}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-cyan-400" />
                              <span className={`font-medium ${record.checkOut === "-" ? "text-gray-400" : "text-white"}`}>
                                {record.checkOut}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-gray-300 font-medium">
                              {record.status === "absent" ? "-" : "8.5h"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <Badge className={`flex items-center w-fit ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              <span className="capitalize">{record.status}</span>
                            </Badge>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record)}
                                className="text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 hover:scale-105 transition-all"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(record.id)}
                                className="text-red-400 hover:bg-red-500/20 border border-red-500/30 hover:scale-105 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                              <Search className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-medium">No attendance records found</p>
                            <p className="text-sm mt-1">Add records using “Add Record”</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden">
              <div className="p-4">
                {filteredAttendance.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAttendance.map((record) => (
                      <Card
                        key={record.id}
                        className="bg-gray-800/30 border-gray-700 hover:border-gray-600 transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-gray-700">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-600">
                                  {getInitials(record.employeeName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-white">{record.employeeName}</p>
                                <p className="text-sm text-gray-400">ID: {record.employeeId}</p>
                              </div>
                            </div>
                            <Badge className={`flex items-center ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              <span className="capitalize">{record.status}</span>
                            </Badge>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                Department
                              </p>
                              <p className="text-sm text-white">{record.department}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Date
                              </p>
                              <p className="text-sm text-white">{record.date}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-emerald-400" />
                                Check In
                              </p>
                              <p className={`text-sm ${record.checkIn === "-" ? "text-gray-400" : "text-white"}`}>
                                {record.checkIn}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-cyan-400" />
                                Check Out
                              </p>
                              <p className={`text-sm ${record.checkOut === "-" ? "text-gray-400" : "text-white"}`}>
                                {record.checkOut}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(record)}
                              className="flex-1 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(record.id)}
                              className="flex-1 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                      <Search className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-medium">No attendance records found</p>
                    <p className="text-sm mt-1 text-center">Add records using “Add Record”</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ PASS employees */}
      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRecord(null)
        }}
        onSubmit={handleAddAttendance}
        editingRecord={editingRecord}
        employees={employees}
      />
    </div>
  )
}
