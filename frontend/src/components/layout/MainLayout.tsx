import { Sidebar } from "@/components/ui/Sidebar"
import TrendingSection from "@/components/feed/TrendingSection"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Layout container */}
            <div className="flex w-full">
                {/* Sidebar fixe */}
                <div className="hidden md:block fixed left-0 top-0 h-full z-30 w-64">
                    <Sidebar />
                </div>

                {/* Contenu principal avec marges automatiques */}
                <main className="flex-1 flex justify-center">
                    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8">
                        <div className="flex justify-center items-start gap-8">
                            {/* Espace égal à gauche en desktop */}
                            <div className="hidden md:block w-64 shrink-0" />

                            {/* Contenu principal */}
                            <div className="w-full max-w-[600px] min-w-0">
                                <Outlet />
                            </div>

                        </div>
                    </div>
                </main>
                {/* Colonne de droite fixe */}
                <div className="hidden md:block w-64 shrink-0 mr-10 mt-10">
                    <div className="sticky top-4">
                        <TrendingSection />
                    </div>
                </div>
            </div>
        </div>
    )
} 