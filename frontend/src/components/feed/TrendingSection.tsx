import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

export default function TrendingSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="pb-2">
          <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Tendances pour vous
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Politique", "Sports", "Technologie", "Musique", "Cinéma"].map((topic, index) => (
            <div
              key={topic}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 p-2 rounded-lg transition-all"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">Tendance en France</div>
              <div className="font-medium">#{topic}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{2543 + index * 127} posts</div>
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950"
          >
            Voir plus
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="pb-2">
          <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Suggestions
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Marie Dubois", "Thomas Martin", "Sophie Bernard"].map((name) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 flex items-center justify-center text-white font-semibold">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">@{name.toLowerCase().replace(" ", "")}</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              >
                Suivre
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            Voir plus
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}