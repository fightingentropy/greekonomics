'use client';

import { useEffect, useRef, useState } from 'react';

interface TweetProps {
  id: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export const Tweet = ({ id }: TweetProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tweetRef.current) return;

    // Start with an empty blockquote
    tweetRef.current.innerHTML = '<blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"></blockquote>';

    // Function to load the tweet
    const loadTweet = () => {
      if (tweetRef.current) {
        const tweetContent = `<blockquote class="twitter-tweet" data-dnt="true" data-theme="dark">
          <a href="https://twitter.com/0xuberM/status/${id}?ref_src=twsrc%5Etfw"></a>
        </blockquote>`;
        tweetRef.current.innerHTML = tweetContent;
        window.twttr?.widgets.load(tweetRef.current);
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const iframe = tweetRef.current?.querySelector('iframe');
          if (iframe) {
            setIsLoading(false);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(tweetRef.current, {
      childList: true,
      subtree: true
    });

    // Load the tweet when Twitter widget is ready
    if (window.twttr?.widgets) {
      loadTweet();
    } else {
      // Wait for Twitter widget to load
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.onload = loadTweet;
      document.head.appendChild(script);
    }

    return () => observer.disconnect();
  }, [id]);

  return (
    <div className="relative min-h-[200px] flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      )}
      <div ref={tweetRef} className="w-full" />
    </div>
  );
};
