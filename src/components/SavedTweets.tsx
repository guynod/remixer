import { useState, useEffect } from 'react';
import { getAllTweets, deleteTweet, type SavedTweet } from '../lib/supabase';

interface SavedTweetsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedTweets({ isOpen, onClose }: SavedTweetsProps) {
  const [tweets, setTweets] = useState<SavedTweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTweets();
    }
  }, [isOpen]);

  async function loadTweets() {
    try {
      setIsLoading(true);
      setError(null);
      const savedTweets = await getAllTweets();
      setTweets(savedTweets);
    } catch (err) {
      setError('Failed to load tweets. Please try again.');
      console.error('Error loading tweets:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTweet(id);
      await loadTweets();
    } catch (err) {
      setError('Failed to delete tweet. Please try again.');
      console.error('Error deleting tweet:', err);
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-blue-900/95 to-purple-900/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-2xl border-l border-indigo-500/30 overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-indigo-500/30 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Saved Tweets</h2>
          <button
            onClick={onClose}
            className="text-indigo-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 rounded-xl p-4 text-white">
              {error}
            </div>
          ) : tweets.length === 0 ? (
            <div className="text-center text-indigo-300">
              No saved tweets yet
            </div>
          ) : (
            tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-indigo-300/30"
              >
                <div className="flex justify-between gap-4">
                  <p className="text-white text-lg">{tweet.content}</p>
                  <button
                    onClick={() => handleDelete(tweet.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete tweet"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-indigo-300 text-sm mt-2">
                  {new Date(tweet.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 