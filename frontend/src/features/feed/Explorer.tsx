import { useState } from "react";
import ExploreContent from "@/components/feed/ExploreContent"
import SearchBar from "@/components/layout/Searchbar"
import { Sidebar } from "@/components/ui/Sidebar"

export default function Explorer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="md:ml-64">
        <div className="container mx-auto max-w-7xl px-4 pb-4">
          <div className="sticky top-0 z-10 pt-4 pb-2 bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <SearchBar />
          </div>

          <div className="mt-4">
            <ExploreContent />
          </div>
        </div>
      </div>
    </div>
  )
}

