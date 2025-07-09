"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "@/lib/supabase"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  useEffect(() => {
    // التحقق إذا كان الأدمن مسجل دخول بالفعل
    try {
      if (typeof window !== "undefined") {
        const adminStatus = localStorage.getItem("adminLoggedIn")
        if (adminStatus === "true") {
          window.location.href = "/"
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }
  }, [])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    const auth = getAuth(app)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem("adminLoggedIn", "true")
      toast({
        title: "تم تسجيل الدخول بنجاح! 🎉",
        description: "مرحباً بك في لوحة تحكم المشرف",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-brown-gradient-light">
      <Navigation />

      <div className="flex items-center justify-center p-4 py-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200/20 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-amber-300/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 bg-amber-500/20 rounded-full blur-xl"></div>
        </div>

        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-amber-200 relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-amber-700" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-amber-900">تحكم الأدمن</CardTitle>
              <p className="text-amber-700 mt-2">أدخل الرقم السري للوصول إلى لوحة التحكم</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <img src="/images/new-mawwal-logo.png" alt="قهوة موال مراكش" className="h-16 w-auto object-contain" />
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Settings className="h-5 w-5 text-amber-600" />
                <span className="text-amber-800 font-medium">لوحة تحكم المشرف</span>
              </div>
              <p className="text-amber-700 text-sm mt-2">
                من خلال هذه اللوحة يمكنك إدارة المنيو، مراجعة الطلبات، وتحديث محتوى الموقع
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-amber-800 font-medium">
                البريد الإلكتروني
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-amber-800 font-medium">
                الرقم السري
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="أدخل الرقم السري"
                  className="pr-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 text-lg font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>جاري التحقق...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <span>دخول لوحة التحكم</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            {/* Back to Home */}
            <div className="text-center">
              <Link href="/" className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors">
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer onAdminLogin={() => {}} />
    </div>
  )
}
