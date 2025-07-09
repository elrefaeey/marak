"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"

export default function CartPage() {
  const { state, dispatch } = useCart()
  const { toast } = useToast()
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    // التحقق من localStorage فقط في العميل
    try {
      if (typeof window !== "undefined") {
        const adminStatus = localStorage.getItem("adminLoggedIn")
        if (adminStatus === "true") {
          setIsAdminLoggedIn(true)
        }
      }
    } catch (error) {
      console.error("Error checking admin login status:", error)
    }
  }, [])

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity },
    })
  }

  const removeItem = (id: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    })

    toast({
      title: "تم حذف العنصر",
      description: "تم حذف العنصر من السلة",
      duration: 2000,
    })
  }

  const sendToWhatsApp = () => {
    if (state.items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة عناصر للسلة أولاً",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      let message = "🔥 *طلب جديد من مقهى موال مراكش* 🔥\n\n"

      message += "📋 *تفاصيل الطلب:*\n"
      message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

      state.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`
        message += `   الكمية: ${item.quantity}\n`
        message += `   السعر: ${item.price * item.quantity} ر.س\n\n`
      })

      message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
      message += `💵 *المبلغ الإجمالي: ${state.total} ر.س*\n\n`

      message += "✨ شكراً لاختياركم مقهى موال مراكش! ✨"

      const phoneNumber = "966567833138"
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // فتح الرابط في نافذة جديدة
      const newWindow = window.open(whatsappUrl, "_blank")

      if (!newWindow) {
        // إذا لم تفتح النافذة، جرب طريقة أخرى
        window.location.href = whatsappUrl
      }

      toast({
        title: "تم إرسال الطلب بنجاح! 🎉",
        description: "سيتم توجيهك لواتساب لإتمام الطلب والتأكيد",
        duration: 3000,
      })
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error)
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleAdminLogin = () => {
    console.log("Admin login triggered in cart page")
    setIsAdminLoggedIn(true)
    // إعادة تحميل الصفحة لضمان تطبيق التغييرات
    window.location.href = "/"
  }

  // عرض لوحة الأدمن إذا كان مسجل الدخول
  if (isAdminLoggedIn) {
    window.location.href = "/"
    return null
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-brown-gradient-light">
        <Navigation />

        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 text-amber-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-amber-900 mb-4">السلة فارغة</h1>
          <p className="text-amber-700 mb-8">لم تقم بإضافة أي عناصر للسلة بعد</p>
          <Button
            onClick={() => (window.location.href = "/menu")}
            className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3"
          >
            تصفح المنيو
          </Button>
        </div>
        <Footer onAdminLogin={handleAdminLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brown-gradient-light">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-8 animate-fade-in">سلة المشتريات</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <Card
                key={item.id}
                className="animate-slide-up bg-white/90 backdrop-blur-sm border-amber-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 mb-1">{item.name}</h3>
                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                        {item.category}
                      </Badge>
                      <p className="text-amber-700 font-semibold mt-2">{item.price} ر.س</p>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="text-lg font-semibold min-w-[2rem] text-center text-amber-900">
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-amber-200">
                    <span className="text-amber-700">المجموع الفرعي:</span>
                    <span className="text-lg font-semibold text-amber-900">{item.price * item.quantity} ر.س</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">عدد العناصر:</span>
                  <span className="font-semibold text-amber-900">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold border-t border-amber-200 pt-4">
                  <span className="text-amber-900">المجموع الكلي:</span>
                  <span className="text-amber-700">{state.total} ر.س</span>
                </div>

                <Button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  إرسال الطلب عبر واتساب
                </Button>

                <p className="text-xs text-amber-600 text-center">سيتم توجيهك لواتساب لإتمام الطلب والدفع</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer onAdminLogin={handleAdminLogin} />
    </div>
  )
}
