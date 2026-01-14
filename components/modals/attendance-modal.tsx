"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingRecord?: any
}

export function AttendanceModal({ isOpen, onClose, onSubmit, editingRecord }: AttendanceModalProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkIn: "",
    checkOut: "",
    department: "",
  })

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        employeeId: editingRecord.employeeId,
        employeeName: editingRecord.employeeName,
        date: editingRecord.date,
        status: editingRecord.status,
        checkIn: editingRecord.checkIn === "-" ? "" : editingRecord.checkIn,
        checkOut: editingRecord.checkOut === "-" ? "" : editingRecord.checkOut,
        department: editingRecord.department === "-" ? "" : editingRecord.department,
      })
    } else {
      setFormData({
        employeeId: "",
        employeeName: "",
        date: new Date().toISOString().split("T")[0],
        status: "present",
        checkIn: "",
        checkOut: "",
        department: "",
      })
    }
  }, [editingRecord, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.employeeName && formData.employeeId) {
      onSubmit(formData)
      setFormData({
        employeeId: "",
        employeeName: "",
        date: new Date().toISOString().split("T")[0],
        status: "present",
        checkIn: "",
        checkOut: "",
        department: "",
      })
    } else {
      alert("Please fill in Employee ID and Name")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-700">
          <h2 className="text-lg md:text-xl font-bold text-white">{editingRecord ? "Edit" : "Add"} Attendance</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Employee ID</label>
              <Input
                placeholder="E001"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Employee Name</label>
            <Input
              placeholder="John Doe"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Department</label>
              <Input
                placeholder="Engineering"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Check In</label>
              <Input
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Check Out</label>
              <Input
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-600 bg-slate-700 hover:bg-slate-600 text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
              {editingRecord ? "Update" : "Save"} Attendance
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
