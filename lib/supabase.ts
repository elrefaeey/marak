import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD62UhHJFsWknon1slPH9C_F8bh3eN6yaQ",
  authDomain: "marakeshcofe.firebaseapp.com",
  projectId: "marakeshcofe",
  storageBucket: "marakeshcofe.firebasestorage.app",
  messagingSenderId: "33799330614",
  appId: "1:33799330614:web:7556d238b74bd139aab197",
  measurementId: "G-82QY68743R"
}

const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const app = firebaseApp

export interface Category {
  id: string
  name: string
  name_ar: string
  display_order: number
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  price: number
  image_url: string
  is_available: boolean
  display_order: number
  category?: Category
}
