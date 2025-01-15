'use client';

import { useEffect, useRef, useState } from 'react';

interface TweetProps {
  id: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => Promise<void>;
      };
    };
  }
}

export const Tweet = ({ id }: TweetProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tweetRef.current) return;

    const tweetElement = document.createElement('blockquote');
    tweetElement.className = 'twitter-tweet';
    tweetElement.setAttribute('data-theme', 'dark');
    const anchor = document.createElement('a');
    anchor.href = `https://twitter.com/x/status/${id}`;
    tweetElement.appendChild(anchor);
    
    tweetRef.current.innerHTML = '';
    tweetRef.current.appendChild(tweetElement);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if the tweet iframe is loaded
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

    if (window.twttr?.widgets) {
      window.twttr.widgets.load(tweetRef.current);
    }

    return () => observer.disconnect();
  }, [id]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      )}
      <div ref={tweetRef} className={`flex justify-center my-4 ${isLoading ? 'invisible' : 'visible'}`} />
    </div>
  );
};
