"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeModal } from "@/components/modals/employee-modal"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  salary: string
}

const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: "E001",
    name: "Priya Singh",
    email: "priya@company.com",
    department: "IT",
    position: "Developer",
    salary: "₹45,000",
  },
  {
    id: "E002",
    name: "Amit Patel",
    email: "amit@company.com",
    department: "Creative",
    position: "Designer",
    salary: "₹40,000",
  },
]

export function EmployeeView() {
  const [employees, setEmployees] = useState<Employee[]>(SAMPLE_EMPLOYEES)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = (data: any) => {
    const newEmployee: Employee = {
      id: `E${String(employees.length + 1).padStart(3, "0")}`,
      ...data,
    }
    setEmployees([newEmployee, ...employees])
    setIsModalOpen(false)
  }

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
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
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800">
                  <th className="px-4 py-3 text-left font-semibold text-slate-200">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden md:table-cell">Position</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-200 hidden lg:table-cell">Salary</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{employee.name}</td>
                      <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{employee.email}</td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{employee.position}</td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{employee.department}</td>
                      <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{employee.salary}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="ghost" className="text-cyan-400 hover:bg-cyan-500/20">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteEmployee(employee.id)}
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
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEmployee} />
    </div>
  )
}
