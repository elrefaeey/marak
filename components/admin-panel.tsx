"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, LogOut, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db, type MenuItem, type Category } from "@/lib/supabase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore"

interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name_ar: "",
    description_ar: "",
    price: "",
    category_id: "",
    image_url: "",
  })

  useEffect(() => {
    setIsClient(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // التحقق من الاتصال بـ Firestore (بدلاً من Supabase)
      try {
        await getDocs(collection(db, "categories"))
      } catch (connectionError) {
        // handle connection error
      }

      // جلب الأقسام
      const categoriesSnapshot = await getDocs(query(collection(db, "categories"), orderBy("display_order")))
      const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) })) as Category[]

      // جلب الأصناف
      const itemsSnapshot = await getDocs(query(collection(db, "menu_items"), orderBy("display_order")))
      const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<MenuItem, 'id'>) })) as MenuItem[]

      setCategories(categoriesData || [])
      setMenuItems(itemsData || [])
    } catch (error: any) {
      console.error("Error fetching data:", error)
      setError(error.message || "حدث خطأ غير متوقع")
      toast({
        title: "خطأ في التحميل",
        description: error.message || "فشل في تحميل البيانات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    try {
      if (!formData.name_ar || !formData.price || !formData.category_id) {
        toast({
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        })
        return
      }

      const newItemData = {
        name: formData.name_ar,
        name_ar: formData.name_ar,
        description: formData.description_ar || "",
        description_ar: formData.description_ar || "",
        price: Number.parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url || "",
        is_available: true,
        display_order: 0,
      }

      const newItemRef = await addDoc(collection(db, "menu_items"), newItemData)

      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة المنتج الجديد",
      })

      setIsAddDialogOpen(false)
      resetForm()
      await fetchData()
    } catch (error: any) {
      console.error("Error adding item:", error)
      toast({
        title: "خطأ في الإضافة",
        description: error.message || "فشل في إضافة المنتج",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async () => {
    if (!editingItem) return

    try {
      if (!formData.name_ar || !formData.price || !formData.category_id) {
        toast({
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        })
        return
      }

      const updatedItemData = {
        name: formData.name_ar,
        name_ar: formData.name_ar,
        description: formData.description_ar || "",
        description_ar: formData.description_ar || "",
        price: Number.parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url || "",
      }

      await updateDoc(doc(db, "menu_items", editingItem.id), updatedItemData)

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث المنتج",
      })

      setIsEditDialogOpen(false)
      setEditingItem(null)
      resetForm()
      await fetchData()
    } catch (error: any) {
      console.error("Error updating item:", error)
      toast({
        title: "خطأ في التحديث",
        description: error.message || "فشل في تحديث المنتج",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menu_items", id))

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المنتج",
      })

      await fetchData()
    } catch (error: any) {
      console.error("Error deleting item:", error)
      toast({
        title: "خطأ في الحذف",
        description: error.message || "فشل في حذف المنتج",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name_ar: "",
      description_ar: "",
      price: "",
      category_id: "",
      image_url: "",
    })
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name_ar: item.name_ar,
      description_ar: item.description_ar,
      price: item.price.toString(),
      category_id: item.category_id,
      image_url: item.image_url,
    })
    setIsEditDialogOpen(true)
  }

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem("adminLoggedIn")
    }
    onLogout()
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <Button onClick={fetchData} className="w-full">
              إعادة المحاولة
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <img src="/images/new-mawwal-logo.png" alt="قهوة موال مراكش" className="h-10 w-auto object-contain" />
              <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المشرف</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">إدارة المنيو</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800">
                <Plus className="h-4 w-4 ml-2" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم المنتج *</Label>
                  <Input
                    id="name"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="أدخل اسم المنتج"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    placeholder="أدخل وصف المنتج"
                  />
                </div>
                <div>
                  <Label htmlFor="price">السعر (ر.س) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="أدخل السعر"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">القسم *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image">رابط الصورة</Label>
                  <Input
                    id="image"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="أدخل رابط الصورة"
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  إضافة المنتج
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد فئات متاحة</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {categories.map((category) => {
              const categoryItems = menuItems.filter((item) => item.category_id === category.id)

              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">
                      {category.name_ar} ({categoryItems.length} منتج)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">لا توجد منتجات في هذا القسم</p>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-800 flex-1">{item.name_ar}</h3>
                              <div className="flex space-x-1 space-x-reverse ml-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => openEditDialog(item)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description_ar}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary">{item.price} ر.س</Badge>
                              {item.image_url && (
                                <img
                                  src={item.image_url || "/placeholder.svg"}
                                  alt={item.name_ar}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = "none"
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">اسم المنتج *</Label>
              <Input
                id="edit-name"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="أدخل اسم المنتج"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea
                id="edit-description"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                placeholder="أدخل وصف المنتج"
              />
            </div>
            <div>
              <Label htmlFor="edit-price">السعر (ر.س) *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="أدخل السعر"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category">القسم *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-image">رابط الصورة</Label>
              <Input
                id="edit-image"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="أدخل رابط الصورة"
              />
            </div>
            <Button onClick={handleEditItem} className="w-full">
              حفظ التغييرات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
