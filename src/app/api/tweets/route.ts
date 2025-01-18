import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Types for X API v2 responses
interface XUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface XTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
}

interface XResponse {
  errors?: Array<{ message: string }>;
  data?: XTweet[] | XTweet | XUser;
  includes?: {
    users?: XUser[];
  };
}

interface XUserResponse extends XResponse {
  data?: XUser;
}

// Popular X accounts to follow
const X_ACCOUNTS = [
  'elonmusk',
  'sama'
];

const TWEETS_PER_USER = 5;
const DELAY_MS = 1000;
const MAX_RETRIES = 3;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Cache types
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<XResponse>> = {};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface OAuthParams {
  oauth_consumer_key: string;
  oauth_token: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_nonce: string;
  oauth_version: string;
  oauth_signature?: string;
  [key: string]: string | undefined;
}

function generateOAuth1Header(method: string, url: string, params: Record<string, string> = {}) {
  const oauth: OAuthParams = {
    oauth_consumer_key: process.env.X_API_KEY as string,
    oauth_token: process.env.X_ACCESS_TOKEN as string,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('base64'),
    oauth_version: '1.0'
  };

  // Combine params and oauth params
  const signatureParams: Record<string, string> = {
    ...params,
    ...Object.fromEntries(
      Object.entries(oauth).filter(([_, v]) => v !== undefined) as [string, string][]
    )
  };

  // Create signature base string
  const paramString = Object.keys(signatureParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(signatureParams[key])}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString)
  ].join('&');

  // Create signing key
  const signingKey = `${encodeURIComponent(process.env.X_API_SECRET_KEY as string)}&${encodeURIComponent(process.env.X_ACCESS_TOKEN_SECRET as string)}`;

  // Generate signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  oauth.oauth_signature = signature;

  // Create Authorization header
  const authHeader = 'OAuth ' + Object.entries(oauth)
    .filter(([_, v]) => v !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value as string)}"`)
    .join(', ');

  return authHeader;
}

async function makeAuthenticatedRequest(method: string, url: string, params: Record<string, string> = {}) {
  const authHeader = generateOAuth1Header(method, url, params);

  const response = await fetch(url + '?' + new URLSearchParams(params).toString(), {
    method,
    headers: {
      'Authorization': authHeader,
    }
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
    throw new Error(`API request failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function getCachedData<T extends XResponse>(key: string, allowExpired = false): Promise<T | null> {
  const entry = cache[key];
  if (!entry) return null;

  const now = Date.now();
  if (!allowExpired && now - entry.timestamp > CACHE_TTL_MS) {
    delete cache[key];
    return null;
  }

  return entry.data as T;
}

function setCachedData<T extends XResponse>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
}

async function fetchUserTweets(userId: string): Promise<any[]> {
  if (!userId) return [];

  const url = `https://api.twitter.com/2/users/${userId}/tweets?` +
    new URLSearchParams({
      'tweet.fields': 'created_at',
      'user.fields': 'name,username,profile_image_url',
      'expansions': 'author_id',
      'max_results': TWEETS_PER_USER.toString()
    });

  await delay(DELAY_MS); // Add delay before request
  const response = await makeAuthenticatedRequest('GET', url);
  return response?.data || [];
}

export async function GET() {
  if (!process.env.X_API_KEY || !process.env.X_API_SECRET_KEY || 
      !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_TOKEN_SECRET) {
    console.error('Missing X API credentials');
    return NextResponse.json(
      { error: 'X API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const username = 'elonmusk';
    console.log('Fetching tweets for:', username);

    // First get the user ID
    const userUrl = 'https://api.twitter.com/2/users/by/username/' + username;
    const userData = await makeAuthenticatedRequest('GET', userUrl);
    const userId = userData.data?.id;

    if (!userId) {
      throw new Error('User not found');
    }

    // Then get their tweets
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets`;
    const params = {
      'max_results': '10',
      'tweet.fields': 'created_at',
      'expansions': 'author_id',
      'user.fields': 'name,username,profile_image_url'
    };

    const tweetsData = await makeAuthenticatedRequest('GET', tweetsUrl, params);
    console.log('API Response:', tweetsData);

    // Format tweets for the frontend
    const user = tweetsData.includes?.users?.[0];
    const formattedTweets = tweetsData.data?.map((tweet: XTweet) => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      author: {
        name: user?.name || '',
        username: user?.username || '',
        profile_image_url: user?.profile_image_url || ''
      }
    })) || [];
    
    return NextResponse.json(formattedTweets);
  } catch (error) {
    console.error('Failed to fetch tweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
