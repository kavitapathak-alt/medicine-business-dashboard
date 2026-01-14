"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Dashboard from "@/components/dashboard"
import { LoginPage } from "@/components/auth/login-page"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-transparent border-t-primary animate-spin mx-auto"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-background">
      <Dashboard />
    </div>
  )
}
