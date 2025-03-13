import { useCreateTweet } from "@/api/queries/tweetQueries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { Textarea } from "@/components/ui/Textarea"
import { Calendar, Image, Smile, X } from "lucide-react"
import { useRef, useState } from "react"
import { useAuthStore } from "@/stores/authStore"

export function TweetComposer() {
  const { user } = useAuthStore();
  const { mutate: createTweet } = useCreateTweet();
  const [tweetText, setTweetText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
      const maxSize = 10 * 1024 * 1024; // 10MB
      return isValid && file.size <= maxSize;
    });

    if (validFiles.length + selectedFiles.length > 4) {
      alert("Vous ne pouvez pas ajouter plus de 4 médias");
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Créer les URLs de prévisualisation
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!tweetText.trim() && selectedFiles.length === 0) return;
    
    setIsSubmitting(true);
    if (!user) {
      console.error("Utilisateur non connecté")
      return
    }
    try {
      createTweet({
        content: tweetText,
        tweet_type: "tweet",
      })
      
      // Réinitialiser le formulaire après l'envoi
      setTweetText("")
    } catch (error) {
      console.error("Erreur lors de l'envoi du tweet:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
      <CardHeader className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-pink-300 dark:ring-pink-800">
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=ME" alt="Your avatar" />
            <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Quoi de neuf ?"
              className="border-none resize-none focus-visible:ring-0 p-0 text-lg p-2"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              maxLength={280}
            />

            {/* Prévisualisation des médias */}
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    {selectedFiles[index]?.type.startsWith('video/') ? (
                      <video 
                        src={url} 
                        className="w-full h-48 object-cover rounded-xl"
                        controls
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Preview ${index}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-3" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950"
                  onClick={openFileSelector}
                  disabled={selectedFiles.length >= 4}
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                {tweetText.length > 0 && (
                  <span className={`text-sm ${tweetText.length > 260 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {tweetText.length}/280
                  </span>
                )}
                <Button 
                  className="rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                  onClick={handleSubmit}
                  disabled={(!tweetText.trim() && selectedFiles.length === 0) || isSubmitting}
                >
                  {isSubmitting ? "Envoi..." : "Tweeter"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
