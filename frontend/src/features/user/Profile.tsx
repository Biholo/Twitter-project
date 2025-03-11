import React from 'react'
import SearchBar from '@/components/layout/Searchbar'
import { Sidebar } from '@/components/ui/Sidebar'

export default function Profile() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6 max-w-xl sticky top-4 z-10 bg-transparent">
            <SearchBar />
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-soft border border-pink-100 p-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-medium text-gray-700">Mon Profil</h1>
              </div>
              
              {/* Contenu du profil */}
              <div className="space-y-4">
                {/* Ajoutez ici le contenu de votre profil */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
