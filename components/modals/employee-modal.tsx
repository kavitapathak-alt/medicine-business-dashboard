"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, User, Mail, Building, Briefcase, Calendar } from "lucide-react"

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function EmployeeModal({ isOpen, onClose, onSubmit }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    joinDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Email optional: only name is required
    if (formData.name.trim()) {
      onSubmit({
        ...formData,
        email: formData.email.trim(), // keep empty if user doesn't enter
      })
      setFormData({ name: "", email: "", department: "", position: "", joinDate: "" })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-blue-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-white to-gray-50 text-gray-900 rounded-2xl shadow-2xl shadow-blue-900/20 border border-gray-200/80">
        {/* Header with gradient */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Employee</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-blue-600" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <User className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Email Field (✅ Optional now) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Mail className="h-4 w-4 text-purple-600" />
              Email Address <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                // ✅ removed required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Building className="h-4 w-4 text-green-600" />
              Department
            </label>
            <div className="relative">
              <Input
                placeholder="Engineering"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Position Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Briefcase className="h-4 w-4 text-amber-600" />
              Position
            </label>
            <div className="relative">
              <Input
                placeholder="Senior Developer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Briefcase className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Join Date Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="h-4 w-4 text-red-600" />
              Join Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="pl-10 bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 hover:scale-[1.02] active:scale-[1.02]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25"
            >
              Add Employee
            </Button>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
