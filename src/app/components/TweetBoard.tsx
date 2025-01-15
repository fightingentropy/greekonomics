'use client';

import { useState } from 'react';
import TweetCard from './TweetCard';

export interface Tweet {
  id: string;
  content: string;
  author: string;
  date: string;
}

export default function TweetBoard() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {tweets.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No tweets yet. Add some tweets to see them here!
          </div>
        )}
      </div>
    </div>
  );
}
