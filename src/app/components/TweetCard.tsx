import { Tweet } from './TweetBoard';

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-800">{tweet.author}</h3>
            <span className="text-sm text-gray-500">{tweet.date}</span>
          </div>
          <p className="mt-2 text-gray-600">{tweet.content}</p>
        </div>
      </div>
    </div>
  );
}
