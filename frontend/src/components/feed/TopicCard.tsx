import { Hashtag } from "@/types";
import { useNavigate } from "react-router-dom";

export default function TopicCard({ topic }: { topic: Hashtag }) {
  const navigate = useNavigate();
  return (
    <div
      key={topic._id}
      className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 p-3 rounded-lg transition-all"
      onClick={() => navigate(`/explore?q=${topic.hashtag}`)}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {topic.hashtag} · Tendance
      </div>
      <div className="font-bold text-lg">{topic.hashtag}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {topic.count} tweets
      </div>
    </div>
  );
}
