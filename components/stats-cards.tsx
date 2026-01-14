"use client"

import { Users, CheckCircle, AlertCircle, TrendingUp, Clock, DollarSign, Calendar, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface StatCard {
  label: string
  value: string
  icon: any
  subtext?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  gradient: string
  iconColor: string
  shimmerColor: string
}

export function StatsCards() {
  const [animatedValues, setAnimatedValues] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absent: 0,
    attendanceRate: 0
  })

  useEffect(() => {
    const targetValues = {
      totalEmployees: 156,
      presentToday: 142,
      absent: 9,
      attendanceRate: 91.2
    }

    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps

    const startValues = {
      totalEmployees: 0,
      presentToday: 0,
      absent: 0,
      attendanceRate: 0
    }

    const increments = {
      totalEmployees: targetValues.totalEmployees / steps,
      presentToday: targetValues.presentToday / steps,
      absent: targetValues.absent / steps,
      attendanceRate: targetValues.attendanceRate / steps
    }

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      
      setAnimatedValues({
        totalEmployees: Math.min(startValues.totalEmployees + (increments.totalEmployees * currentStep), targetValues.totalEmployees),
        presentToday: Math.min(startValues.presentToday + (increments.presentToday * currentStep), targetValues.presentToday),
        absent: Math.min(startValues.absent + (increments.absent * currentStep), targetValues.absent),
        attendanceRate: Math.min(startValues.attendanceRate + (increments.attendanceRate * currentStep), targetValues.attendanceRate)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats: StatCard[] = [
    {
      label: "Total Employees",
      value: Math.floor(animatedValues.totalEmployees).toString(),
      icon: Users,
      subtext: "+12 this month",
      trend: {
        value: "+8%",
        isPositive: true
      },
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      iconColor: "text-blue-400",
      shimmerColor: "via-blue-500/20"
    },
    {
      label: "Present Today",
      value: Math.floor(animatedValues.presentToday).toString(),
      icon: CheckCircle,
      subtext: "On-time: 132 | Late: 10",
      trend: {
        value: "+5%",
        isPositive: true
      },
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      iconColor: "text-emerald-400",
      shimmerColor: "via-emerald-500/20"
    },
    {
      label: "Absent Today",
      value: Math.floor(animatedValues.absent).toString(),
      icon: AlertCircle,
      subtext: "Leave: 6 | Sick: 3",
      trend: {
        value: "-3%",
        isPositive: false
      },
      gradient: "from-rose-500 via-red-500 to-pink-500",
      iconColor: "text-rose-400",
      shimmerColor: "via-rose-500/20"
    },
    {
      label: "Attendance Rate",
      value: `${animatedValues.attendanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      subtext: "Monthly average",
      trend: {
        value: "+2.3%",
        isPositive: true
      },
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      iconColor: "text-amber-400",
      shimmerColor: "via-amber-500/20"
    },
    {
      label: "Avg Work Hours",
      value: "8.7h",
      icon: Clock,
      subtext: "Daily average",
      trend: {
        value: "+0.3h",
        isPositive: true
      },
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      iconColor: "text-violet-400",
      shimmerColor: "via-violet-500/20"
    },
    {
      label: "Avg Salary",
      value: "₹48.5k",
      icon: DollarSign,
      subtext: "Monthly average",
      trend: {
        value: "+4.2%",
        isPositive: true
      },
      gradient: "from-cyan-500 via-sky-500 to-blue-500",
      iconColor: "text-cyan-400",
      shimmerColor: "via-cyan-500/20"
    },
    {
      label: "This Month",
      value: "22 days",
      icon: Calendar,
      subtext: "Working days",
      trend: {
        value: "On track",
        isPositive: true
      },
      gradient: "from-lime-500 via-green-500 to-emerald-500",
      iconColor: "text-lime-400",
      shimmerColor: "via-lime-500/20"
    },
    {
      label: "Departments",
      value: "8",
      icon: Building,
      subtext: "Active teams",
      trend: {
        value: "+2",
        isPositive: true
      },
      gradient: "from-pink-500 via-rose-500 to-red-500",
      iconColor: "text-pink-400",
      shimmerColor: "via-pink-500/20"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="relative group">
          {/* Shimmer Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
          
          {/* Main Card */}
          <Card className="relative border-gray-700/50 bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/30">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl`} />
            </div>

            {/* Inner Card Content */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-2xl">
              <CardContent className="p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 tracking-wide">{stat.label}</p>
                  </div>
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.gradient}/10 backdrop-blur-sm border border-gray-700/50`}>
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>

                {/* Main Value with Animation */}
                <div className="mb-3">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    {stat.trend && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        stat.trend.isPositive 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {stat.trend.value}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtext */}
                {stat.subtext && (
                  <p className="text-sm text-gray-400 mb-4">
                    {stat.subtext}
                  </p>
                )}

                {/* Progress Bar for some stats */}
                {(stat.label === "Attendance Rate" || stat.label === "Avg Work Hours") && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: stat.label === "Attendance Rate" 
                            ? `${Math.min(animatedValues.attendanceRate, 100)}%` 
                            : '87%'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{stat.label === "Attendance Rate" ? "100%" : "12h"}</span>
                    </div>
                  </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-full blur-xl`} />
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} blur-lg`} />
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Floating Particles on Hover */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-gradient-to-r ${stat.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-${i * 100}`}
                style={{
                  top: `${20 + i * 30}%`,
                  left: `${10 + i * 40}%`,
                  animation: `float ${3 + i}s ease-in-out infinite`
                }}
              />
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-10px) translateX(10px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
      `}</style>
    </div>
  )
}