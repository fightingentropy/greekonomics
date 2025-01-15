import TweetBoard from '../components/TweetBoard';

export default function TweetsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Tweet Board</h1>
      <TweetBoard />
    </main>
  );
}
