"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AdminLoginHandler() {
  const router = useRouter()

  useEffect(() => {
    try {
      // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
      const checkAdminLogin = () => {
        if (typeof window !== "undefined") {
          const adminStatus = localStorage.getItem("adminLoggedIn")
          console.log("Admin login check:", adminStatus)

          if (adminStatus === "true") {
            console.log("Admin is logged in, redirecting to home page")
            router.push("/")
          }
        }
      }

      checkAdminLogin()

      // إضافة مستمع للتغييرات في localStorage
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "adminLoggedIn" && e.newValue === "true") {
          console.log("Admin login detected via storage event")
          router.push("/")
        }
      }

      window.addEventListener("storage", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    } catch (error) {
      console.error("Error in AdminLoginHandler:", error)
    }
  }, [router])

  return null
}
