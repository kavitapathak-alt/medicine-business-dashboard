"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeModal } from "@/components/modals/employee-modal"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Edit2, Trash2, Mail, Building, Briefcase, DollarSign, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  salary: string
  joinDate?: string
}

const STORAGE_KEY = "employees_records_v1"

const departmentColors: Record<string, string> = {
  IT: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Design: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Marketing: "bg-green-500/10 text-green-400 border-green-500/30",
  HR: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  Finance: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Sales: "bg-red-500/10 text-red-400 border-red-500/30",
  Creative: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
}

export function EmployeeView() {
  // ✅ NO static sample. Load from localStorage (refresh safe)
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Employee[]) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterDepartment, setFilterDepartment] = useState<string>("all")

  // ✅ Save to localStorage whenever employees changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
    } catch (e) {
      console.error("localStorage save error:", e)
    }
  }, [employees])

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment

      return matchesSearch && matchesDepartment
    })
  }, [employees, searchTerm, filterDepartment])

  // ✅ Safer ID generator (avoid duplicate after delete)
  const generateEmployeeId = (list: Employee[]) => {
    const nums = list
      .map((e) => Number(String(e.id || "").replace(/[^\d]/g, "")))
      .filter((n) => Number.isFinite(n) && n > 0)
    const next = (nums.length ? Math.max(...nums) : 0) + 1
    return `E${String(next).padStart(3, "0")}`
  }

  const handleAddEmployee = (data: any) => {
    // data should contain: name, email, department, position, salary, joinDate etc (as your modal sends)
    const newEmployee: Employee = {
      id: data.id?.trim() || generateEmployeeId(employees),
      name: data.name,
      email: data.email,
      department: data.department,
      position: data.position,
      salary: data.salary || "₹0",
      joinDate: data.joinDate,
    }

    // ✅ avoid duplicate IDs
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === newEmployee.id)
      if (exists) {
        // If duplicate, auto-generate another id
        return [{ ...newEmployee, id: generateEmployeeId(prev) }, ...prev]
      }
      return [newEmployee, ...prev]
    })

    setIsModalOpen(false)
  }

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id))
    }
  }

  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getDepartmentColor = (dept: string) => {
    return departmentColors[dept] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
  }

  const departments = useMemo(() => Array.from(new Set(employees.map((emp) => emp.department))).filter(Boolean), [employees])

  // Optional: clear all (debug/help)
  // const clearAll = () => {
  //   if (confirm("Clear all employees?")) {
  //     setEmployees([])
  //     window.localStorage.removeItem(STORAGE_KEY)
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Employee Directory
            </h1>
            <p className="text-gray-400 text-sm md:text-base mt-1">Manage your team members and their details</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden md:block">{employees.length} employees</span>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                <Filter className="h-4 w-4 mr-2" />
                {filterDepartment === "all" ? "All Departments" : filterDepartment}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-gray-700 bg-gray-800">
              <DropdownMenuItem onClick={() => setFilterDepartment("all")} className="text-white hover:bg-gray-700">
                All Departments
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              {departments.map((dept) => (
                <DropdownMenuItem
                  key={dept}
                  onClick={() => setFilterDepartment(dept)}
                  className="text-white hover:bg-gray-700"
                >
                  {dept}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Employees</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-white">{employees.length}</p>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <Building className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Departments</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-white">{departments.length}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Salary</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-white">—</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2 text-white">—</p>
                </div>
                <div className="p-3 bg-pink-500/10 rounded-lg">
                  <Plus className="h-6 w-6 text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table/Grid */}
        <Card className="bg-gradient-to-b from-gray-800/50 to-gray-900/30 border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900">
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Employee</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Department</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Position</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Salary</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">Contact</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-gray-700">
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">{employee.name}</p>
                                <p className="text-sm text-gray-400">ID: {employee.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={getDepartmentColor(employee.department)}>
                              {employee.department}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">{employee.position}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <span className="font-semibold text-white">{employee.salary}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`mailto:${employee.email}`}
                              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="truncate max-w-[180px]">{employee.email}</span>
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="text-red-400 hover:bg-red-500/20 border border-red-500/30"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                              <Search className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-medium">No employees found</p>
                            <p className="text-sm mt-1">Add employees using “Add Employee”</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              <div className="p-4">
                {filteredEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEmployees.map((employee) => (
                      <Card
                        key={employee.id}
                        className="bg-gray-800/30 border-gray-700 hover:border-gray-600 transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-gray-700">
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-white">{employee.name}</p>
                                <p className="text-sm text-gray-400">{employee.position}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={getDepartmentColor(employee.department)}>
                              {employee.department}
                            </Badge>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <a
                                href={`mailto:${employee.email}`}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors truncate"
                              >
                                {employee.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="text-white font-medium">{employee.salary}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEmployee(employee.id)}
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
                    <p className="text-lg font-medium">No employees found</p>
                    <p className="text-sm mt-1 text-center">Add employees using “Add Employee”</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmployee}
      />
    </div>
  )
}
