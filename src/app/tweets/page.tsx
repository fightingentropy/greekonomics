'use client';

import { useEffect } from 'react';
import { tweets } from '@/data/tweets';
import { Tweet } from 'react-tweet';

export default function TweetsPage() {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tweets.map((tweet, index) => (
          <Tweet key={index} id={tweet.url.split('/').pop() || ''} />
        ))}
      </div>
    </div>
  );
}
