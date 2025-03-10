import React from 'react'

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-700">Mon Profil</h1>
        </div>
        
        {/* Contenu du profil */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-soft border border-pink-100 p-6">
          {/* Contenu à venir */}
        </div>
      </div>
    </div>
  )
}
