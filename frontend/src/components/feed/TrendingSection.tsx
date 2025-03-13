import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import SuggestionCard from "./SuggestionCard"
import TopicCard from "@/components/feed/TopicCard"
import { useTrendingHashtags, useTrendingSuggestions } from "@/api/queries/trendingQueries"
import { useEffect, useState, useRef } from "react"
import { Bell, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetNotifications, useMarkAsRead, useMarkAllAsRead } from "@/api/queries/notificationQueries"
import { useAuthStore } from "@/stores/authStore"
import websocketService from "@/services/websocketService"
import { queryClient } from "@/configs/queryClient"
import { useNavigate } from "react-router-dom"

export default function TrendingSection() {
  const { user } = useAuthStore();
  const { data: trendingHashtag, isLoading: isLoadingTrendingHashtag } = useTrendingHashtags();
  const { data: trendingSuggestions = [], isLoading: isLoadingTrendingSuggestions } = useTrendingSuggestions();
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();



  const { data: notifications = [] } = useGetNotifications(user?._id || "");
  const { mutate: markAsReadMutation } = useMarkAsRead();
  const { mutate: markAllAsReadMutation } = useMarkAllAsRead();

  const displayedSuggestions = showAllSuggestions 
    ? trendingSuggestions 
    : trendingSuggestions.slice(0, 2);

  useEffect(() => {
    websocketService.subscribe('NOTIFICATION', (data: any) => {
        console.log('Notification reçue:', data);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    markAsReadMutation(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation();
  };

  const showProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-pink-50 dark:hover:bg-pink-950"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        onClick={markAllAsRead}
                      >
                        <Check className="h-3 w-3" />
                        Tout marquer comme lu
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 rounded-lg transition-colors cursor-pointer ${
                          notification.is_read
                            ? "bg-gray-50 dark:bg-gray-700/50"
                            : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            <img 
                              onClick={() => showProfile(notification.sender_id._id)}
                              src={notification.sender_id.avatar || "/placeholder.svg?height=32&width=32"} 
                              alt={notification.sender_id.username}
                              className="w-8 h-8 rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">@{notification.sender_id.identifier_name}</span>{" "}
                              {notification.message}
                            </p>
                           
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(notification.notification_date).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="pb-2">
          <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Tendances pour vous
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrendingHashtag ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Chargement des tendances...</p>
          ) : !trendingHashtag || trendingHashtag.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Aucune tendance disponible</p>
          ) : (
            <>
              {trendingHashtag.map((hashtag) => (
                <TopicCard key={hashtag.hashtag} topic={hashtag} />
              ))}
              {trendingHashtag.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950"
                >
                  Voir plus
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none">
        <CardHeader className="pb-2">
          <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Suggestions
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrendingSuggestions ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Chargement des suggestions...</p>
          ) : trendingSuggestions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-2">Aucune suggestion disponible</p>
          ) : (
            <>
              {displayedSuggestions.map((person) => (
                <SuggestionCard 
                  id={person._id}
                  key={person.identifier_name} 
                  username={person.username} 
                  identifier_name={person.identifier_name} 
                  avatar={person.avatar} 
                />
              ))}
              {trendingSuggestions.length > 2 && (
                <Button
                  variant="ghost"
                  className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                >
                  {showAllSuggestions ? "Voir moins" : "Voir plus"}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}