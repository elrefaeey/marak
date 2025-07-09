"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Flame } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { db, type MenuItem, type Category } from "@/lib/supabase"
import { Footer } from "@/components/footer"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
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

  const handleAdminLogin = () => {
    console.log("Admin login triggered in menu page")
    setIsAdminLoggedIn(true)
    // إعادة تحميل الصفحة لضمان تطبيق التغييرات
    window.location.href = "/"
  }

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      // جلب الأقسام مرتبة
      const categoriesSnapshot = await getDocs(query(collection(db, "categories"), orderBy("display_order")))
      const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) })) as Category[]

      // جلب الأصناف المتاحة فقط
      const itemsSnapshot = await getDocs(query(collection(db, "menu_items"), where("is_available", "==", true), orderBy("display_order")))
      const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<MenuItem, 'id'>) })) as MenuItem[]

      setCategories(categoriesData || [])
      setMenuItems(itemsData || [])

      // تعيين القسم الافتراضي (العروض إذا كان متاحاً، وإلا أول قسم)
      if (categoriesData && categoriesData.length > 0) {
        const offersCategory = categoriesData.find((cat) => cat.name_ar === "العروض")
        setSelectedCategory(offersCategory ? offersCategory.id : categoriesData[0].id)
      }
    } catch (error) {
      console.error("Error fetching menu:", error)
    } finally {
      setLoading(false)
    }
  }

  const { dispatch } = useCart()

  const addToCart = (item: any, category: string) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name_ar,
        price: item.price,
        category: category,
      },
    })
  }

  // عرض لوحة الأدمن إذا كان مسجل الدخول
  if (isAdminLoggedIn) {
    window.location.href = "/"
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-gradient-light">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-amber-800">جاري تحميل المنيو...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brown-gradient-light">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-8 animate-fade-in">منيو مقهى موال مراكش</h1>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {categories.map((category) => {
            const isOffersCategory = category.name_ar === "العروض"
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-12 text-sm font-medium transition-all duration-200 ${
                  isOffersCategory
                    ? `fire-button ${selectedCategory === category.id ? "fire-button-pulse" : ""}`
                    : selectedCategory === category.id
                      ? "bg-amber-700 hover:bg-amber-800 text-white shadow-lg"
                      : "border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 bg-white/80"
                }`}
              >
                {isOffersCategory ? (
                  <>
                    <span className="fire-button-text">{category.name_ar}</span>
                    <Flame className="h-4 w-4 mr-1 fire-icon" />
                  </>
                ) : (
                  category.name_ar
                )}
              </Button>
            )
          })}
        </div>

        {/* Menu Items */}
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems
            .filter((item) => item.category_id === selectedCategory)
            .map((item, index) => {
              const isOfferItem = categories.find((cat) => cat.id === item.category_id)?.name_ar === "العروض"

              return (
                <Card
                  key={item.id}
                  className={`hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden bg-white/90 backdrop-blur-sm ${
                    isOfferItem ? "special-offer-card" : "border-amber-200"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isOfferItem && <div className="special-offer-badge">عرض خاص</div>}
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={item.image_url || "/placeholder.svg?height=120&width=120"}
                        alt={item.name_ar}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg text-amber-900">{item.name_ar}</CardTitle>
                        <div className="flex flex-col items-end">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {item.price} ر.س
                          </Badge>
                        </div>
                      </div>
                      <p className="text-amber-700 mb-4 text-sm">{item.description_ar}</p>
                      <Button
                        onClick={() =>
                          addToCart(item, categories.find((c) => c.id === item.category_id)?.name_ar || "")
                        }
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة للسلة
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>

        {/* No items message */}
        {menuItems.filter((item) => item.category_id === selectedCategory).length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-700 text-lg">لا توجد عناصر في هذا القسم حالياً</p>
            <p className="text-amber-600 text-sm mt-2">سيتم إضافة عناصر جديدة قريباً</p>
          </div>
        )}
      </div>
      <Footer onAdminLogin={handleAdminLogin} />
    </div>
  )
}
