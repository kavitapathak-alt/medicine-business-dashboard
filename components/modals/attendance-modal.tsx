"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Users, Calendar, Clock, Building, AlertCircle } from "lucide-react"
import { Employee } from "../attendance-view"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingRecord?: any
  employees: Employee[]
}

type Status = "present" | "absent" | "late"

const DEFAULT_IN = "09:00"
const DEFAULT_OUT = "18:00"

export function AttendanceModal({
  isOpen,
  onClose,
  onSubmit,
  editingRecord,
  employees,
}: AttendanceModalProps) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    date: today,
    status: "present" as Status,
    checkIn: DEFAULT_IN,
    checkOut: DEFAULT_OUT,
  })

  // ✅ edit mode fill / add mode defaults
  useEffect(() => {
    if (!isOpen) return

    if (editingRecord) {
      setFormData({
        employeeId: editingRecord.employeeId || "",
        employeeName: editingRecord.employeeName || "",
        department: editingRecord.department || "",
        date: editingRecord.date || today,
        status: (editingRecord.status as Status) || "present",
        checkIn: editingRecord.checkIn && editingRecord.checkIn !== "-" ? editingRecord.checkIn : DEFAULT_IN,
        checkOut: editingRecord.checkOut && editingRecord.checkOut !== "-" ? editingRecord.checkOut : DEFAULT_OUT,
      })
    } else {
      setFormData({
        employeeId: "",
        employeeName: "",
        department: "",
        date: today,
        status: "present",
        checkIn: DEFAULT_IN,
        checkOut: DEFAULT_OUT,
      })
    }
  }, [isOpen, editingRecord, today])

  const handleSelectEmployee = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId)
    setFormData((prev) => ({
      ...prev,
      employeeId,
      employeeName: emp?.name || "",
      department: emp?.department || "",
    }))
  }

  // ✅ Preset click => auto fill
  const applyPreset = (start: string, end: string) => {
    setFormData((p) => ({ ...p, checkIn: start, checkOut: end }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employeeId) {
      alert("Please select employee")
      return
    }

    onSubmit({
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department || "-",
      date: formData.date || today,
      status: formData.status,
      checkIn: formData.status === "absent" ? "-" : formData.checkIn || DEFAULT_IN,
      checkOut: formData.status === "absent" ? "-" : formData.checkOut || DEFAULT_OUT,
    })

    // ✅ close modal after save
    onClose()
  }

  if (!isOpen) return null

  const presets = [
    { label: "09:00 - 18:00", in: "09:00", out: "18:00" },
    { label: "10:00 - 19:00", in: "10:00", out: "19:00" },
    { label: "08:00 - 17:00", in: "08:00", out: "17:00" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-emerald-900/20 to-cyan-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div
        className="relative w-full sm:max-w-xl bg-gradient-to-b from-white to-gray-50 text-gray-900 shadow-2xl border border-gray-200/80
                   rounded-t-2xl sm:rounded-2xl max-h-[88vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {editingRecord ? "Edit Attendance" : "Add Attendance"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ✅ FORM (important) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Employee Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4 text-emerald-600" />
              Employee
            </label>

            {employees.length === 0 ? (
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-semibold">No employees found</p>
                  <p className="text-xs">Please add employees in Employee Directory first.</p>
                </div>
              </div>
            ) : (
              <select
                value={formData.employeeId}
                onChange={(e) => handleSelectEmployee(e.target.value)}
                className="w-full h-11 rounded-md bg-white border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Auto-filled */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users className="h-4 w-4 text-blue-600" />
                Name
              </label>
              <Input value={formData.employeeName} readOnly className="bg-gray-100 border-gray-300" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Building className="h-4 w-4 text-purple-600" />
                Department
              </label>
              <Input value={formData.department} readOnly className="bg-gray-100 border-gray-300" />
            </div>
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const status = e.target.value as Status
                  setFormData((p) => ({
                    ...p,
                    status,
                    // absent => clear times, back to default otherwise
                    checkIn: status === "absent" ? "" : p.checkIn || DEFAULT_IN,
                    checkOut: status === "absent" ? "" : p.checkOut || DEFAULT_OUT,
                  }))
                }}
                className="w-full h-11 rounded-md bg-white border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          {/* ✅ Presets */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-600" />
              Quick Timings
            </label>

            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const active = formData.checkIn === p.in && formData.checkOut === p.out
                return (
                  <button
                    key={p.label}
                    type="button"
                    disabled={formData.status === "absent"}
                    onClick={() => applyPreset(p.in, p.out)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-all
                      ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-800 border-gray-300 hover:border-emerald-400"}
                      ${formData.status === "absent" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500">Default: 09:00 - 18:00</p>
          </div>

          {/* Check In/Out with clock icon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="h-4 w-4 text-emerald-600" />
                Check In
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Clock className="h-4 w-4" />
                </span>
                <Input
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => setFormData((p) => ({ ...p, checkIn: e.target.value }))}
                  className="pl-10"
                  disabled={formData.status === "absent"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="h-4 w-4 text-cyan-600" />
                Check Out
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Clock className="h-4 w-4" />
                </span>
                <Input
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => setFormData((p) => ({ ...p, checkOut: e.target.value }))}
                  className="pl-10"
                  disabled={formData.status === "absent"}
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer (inside form so submit works) */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 pt-4">
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold"
                disabled={employees.length === 0}
              >
                {editingRecord ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
