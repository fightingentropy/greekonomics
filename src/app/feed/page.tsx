'use client';

import { useEffect, useState } from 'react';
import { Tweet } from 'react-tweet';

interface TweetData {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
  created_at: string;
}

export default function FeedPage() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('/api/tweets');
        const data = await response.json();
        
        // Store debug info if there's an error
        if (!response.ok) {
          setDebugInfo(data);
          throw new Error(data.error || 'Failed to load tweets');
        }
        
        setTweets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tweets');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Twitter Feed</h1>
          <div className="animate-pulse p-4 bg-white rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Twitter Feed</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-red-800 font-semibold mb-2">Error loading tweets</h2>
            <p className="text-red-600">{error}</p>
            {debugInfo && (
              <pre className="mt-4 p-4 bg-red-100 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </div>
        ) : tweets.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">No tweets found. Try refreshing the page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="bg-white rounded-lg shadow p-4">
                <Tweet id={tweet.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
