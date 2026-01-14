"use client"

import { Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function StatsCards() {
  const stats = [
    {
      label: "Total Employees",
      value: "128",
      icon: Users,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Present Today",
      value: "115",
      icon: CheckCircle,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      label: "Absent",
      value: "8",
      icon: AlertCircle,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
    },
    {
      label: "Attendance Rate",
      value: "89.8%",
      icon: TrendingUp,
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
