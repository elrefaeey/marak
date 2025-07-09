"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export function Navigation() {
  const pathname = usePathname()
  const { state } = useCart()

  const navItems = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/menu", label: "المنيو", icon: Menu },
    { href: "/admin-login", label: "تحكم الأدمن", icon: Settings },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 space-x-reverse">
            <img src="/images/new-mawwal-logo.png" alt="مقهى موال مراكش" className="h-12 w-auto object-contain" />
            <span className="text-xl font-bold text-amber-900 hidden sm:block">مقهى موال مراكش</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-amber-100 text-amber-800"
                      : "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Cart Button - Desktop */}
            <Link
              href="/cart"
              className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                pathname === "/cart"
                  ? "bg-amber-100 text-amber-800"
                  : "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>السلة</span>
              {state.items.length > 0 && (
                <Badge variant="destructive" className="mr-1">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2 space-x-reverse">
            {/* Cart Button - Mobile (Always Visible) */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-amber-700 hover:text-amber-800">
                <ShoppingCart className="h-6 w-6" />
                {state.items.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-700 hover:text-amber-800">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                          pathname === item.href
                            ? "bg-amber-100 text-amber-800"
                            : "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
