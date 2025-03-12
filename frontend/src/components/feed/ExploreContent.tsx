import { Card, CardContent } from "@/components/ui/Card"
import { useGetTrends } from "@/api/queries/trendQueries";

export default function ExploreContent() {
  const { data: news, isLoading, error } = useGetTrends();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          Une erreur est survenue lors du chargement des actualités
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news?.map((article, index) => (
        <Card 
          key={index} 
          className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              {article.urlToImage && (
                <div className="flex-shrink-0">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <a 
                  href={article.url}  
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  <h3 className="font-bold text-lg line-clamp-2">{article.title}</h3>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {article.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium">{article.source.name}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

