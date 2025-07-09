"use client"

import { useState, useEffect } from "react"
import { Phone } from "lucide-react"

interface FooterProps {
  onAdminLogin: () => void
}

export function Footer({ onAdminLogin }: FooterProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // تعديل جزء الروابط الاجتماعية في الفوتر

  // تحديث مصفوفة socialLinks للتأكد من أن الروابط تعمل بشكل صحيح
  const socialLinks = [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@mwal_marakish",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/mwal_marakish",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/mwal_marakish",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/cafemwalmarakish/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Snapchat",
      url: "https://www.snapchat.com/add/mwalmarakis2024?share_id=qprtqwKnF3s&locale=ar-EG",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.206 2.003c-1.128 0-2.041.914-2.041 2.041 0 .569.234 1.084.611 1.456-.377.372-.611.887-.611 1.456 0 1.127.913 2.041 2.041 2.041s2.041-.914 2.041-2.041c0-.569-.234-1.084-.611-1.456.377-.372.611-.887.611-1.456 0-1.127-.913-2.041-2.041-2.041zm7.794 9.997c0-1.127-.914-2.041-2.041-2.041s-2.041.914-2.041 2.041.914 2.041 2.041 2.041 2.041-.914 2.041-2.041zm-15.588 0c0-1.127-.914-2.041-2.041-2.041s-2.041.914-2.041 2.041.914 2.041 2.041 2.041 2.041-.914 2.041-2.041zm7.794 7.794c-1.128 0-2.041.914-2.041 2.041s.913 2.041 2.041 2.041 2.041-.914 2.041-2.041-.913-2.041-2.041-2.041z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-brown-gradient-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-2 space-x-reverse mb-4">
              <img src="/images/new-mawwal-logo.png" alt="مقهى موال مراكش" className="h-12 w-auto object-contain" />
              <span className="text-xl font-bold">مقهى موال مراكش</span>
            </div>
            <p className="text-amber-100">تجربة قهوة استثنائية في قلب المدينة</p>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <Phone className="h-5 w-5 text-amber-300" />
                <span dir="ltr">+966567833138</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">تابعنا على</h3>
            <div className="flex justify-center md:justify-start space-x-4 space-x-reverse">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-800 hover:bg-amber-700 text-amber-200 hover:text-white transition-all duration-200 p-3 rounded-full flex items-center justify-center w-10 h-10 shadow-md hover:shadow-lg transform hover:scale-110"
                  title={social.name}
                  onClick={(e) => {
                    e.preventDefault()
                    window.open(social.url, "_blank", "noopener,noreferrer")
                  }}
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-amber-600 mt-8 pt-8 text-center text-amber-200">
          <p>&copy; 2025 مقهى موال مراكش. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
