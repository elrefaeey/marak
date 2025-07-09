"use client"

import Link from "next/link"
import { Clock, MapPin, Phone, Coffee, Apple, Grape, Cherry, Cigarette, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { AdminPanel } from "@/components/admin-panel"

export default function HomePage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // التحقق من localStorage فقط في العميل
    try {
      if (typeof window !== "undefined") {
        const adminStatus = localStorage.getItem("adminLoggedIn")
        console.log("Admin login status on page load:", adminStatus)
        if (adminStatus === "true") {
          setIsAdminLoggedIn(true)
        }
      }
    } catch (error) {
      console.error("Error checking admin login status:", error)
    }
  }, [])

  const handleAdminLogin = () => {
    console.log("Admin login triggered from footer")
    setIsAdminLoggedIn(true)
  }

  const handleAdminLogout = () => {
    console.log("Admin logout triggered")
    setIsAdminLoggedIn(false)
    if (isClient && typeof window !== "undefined") {
      localStorage.removeItem("adminLoggedIn")
    }
  }

  // عرض لوحة الأدمن إذا كان مسجل الدخول
  if (isClient && isAdminLoggedIn) {
    return <AdminPanel onLogout={handleAdminLogout} />
  }

  return (
    <div className="min-h-screen bg-brown-gradient-light decorative-bg">
      {/* Floating decorative icons */}
      <div className="decorative-icons">
        <Coffee className="floating-icon floating-icon-1" />
        <Apple className="floating-icon floating-icon-2" />
        <Coffee className="floating-icon floating-icon-3" />
        <Grape className="floating-icon floating-icon-4" />
        <Cigarette className="floating-icon floating-icon-5" />
        <Cherry className="floating-icon floating-icon-6" />
        <Coffee className="floating-icon floating-icon-7" />
        <Apple className="floating-icon floating-icon-8" />
        <Cigarette className="floating-icon floating-icon-9" />
        <Coffee className="floating-icon floating-icon-10" />
        <Grape className="floating-icon floating-icon-11" />
        <Cherry className="floating-icon floating-icon-12" />
      </div>

      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center animate-fade-in z-10">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <img src="/images/new-mawwal-logo.png" alt="مقهى موال مراكش" className="h-32 w-auto object-contain" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">مقهى موال مراكش</h1>
            <p className="text-xl md:text-2xl text-amber-800 mb-8">تجربة قهوة استثنائية في قلب المدينة</p>
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                استكشف المنيو
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">لماذا تختار مقهى موال مراكش؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: () => (
                  <img
                    src="/images/new-mawwal-logo.png"
                    alt="قهوة طازجة"
                    className="h-12 w-12 object-contain mx-auto"
                  />
                ),
                title: "قهوة طازجة",
                description: "نحمص حبوب القهوة يومياً لضمان أفضل طعم ونكهة",
              },
              {
                icon: Clock,
                title: "خدمة سريعة",
                description: "نحرص على تقديم طلبك في أسرع وقت ممكن",
              },
              {
                icon: MapPin,
                title: "موقع مميز",
                description: "في قلب المدينة مع أجواء مريحة ومناسبة للجميع",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 animate-slide-up bg-white/90 backdrop-blur-sm border-amber-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <feature.icon className="h-12 w-12 text-amber-700 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">{feature.title}</h3>
                  <p className="text-amber-800">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">تواصل معنا</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 md:space-x-reverse">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Phone className="h-6 w-6 text-amber-700" />
              <span className="text-lg text-amber-800" dir="ltr">
                +966567833138
              </span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <MapPin className="h-6 w-6 text-amber-700" />
              <span className="text-lg text-amber-800">المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="py-16 px-4 bg-amber-50/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1 space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">رأيك يهمنا</h2>
          <p className="text-xl text-amber-800 mb-8">شاركنا تجربتك وساعدنا في تحسين خدماتنا</p>
          <Button
            onClick={() => window.open("https://maps.app.goo.gl/j4DXXQ1b5pv4ZRhD9", "_blank")}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Star className="h-5 w-5 mr-2" />
            رأيك يهمنا
          </Button>
        </div>
      </section>

      <Footer onAdminLogin={handleAdminLogin} />
    </div>
  )
}
