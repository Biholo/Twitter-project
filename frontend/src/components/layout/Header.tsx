import React from 'react'
import SearchBar from "./Searchbar"
import { Bell, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50">
            <Bell size={20} className="text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50">
            <MessageCircle size={20} className="text-gray-700" />
          </Button>
        </div>
      </div>
    </header>
  )
}
