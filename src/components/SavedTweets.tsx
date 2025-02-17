import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getAllTweets, deleteTweet, type SavedTweet } from '../lib/supabase';

interface SavedTweetsProps {
  isHidden: boolean;
  onToggle: () => void;
}

export interface SavedTweetsRef {
  refreshTweets: () => void;
}

export const SavedTweets = forwardRef<SavedTweetsRef, SavedTweetsProps>(
  function SavedTweets({ isHidden, onToggle }, ref) {
    const [tweets, setTweets] = useState<SavedTweet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [justSaved, setJustSaved] = useState<string | null>(null);
    const [deletingTweetId, setDeletingTweetId] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    useEffect(() => {
      if (!isHidden) {
        loadTweets();
      }
    }, [isHidden]);

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

    useImperativeHandle(ref, () => ({
      refreshTweets: async () => {
        const savedTweets = await getAllTweets();
        setTweets(savedTweets);
        if (savedTweets.length > 0) {
          setJustSaved(savedTweets[0].id);
          setTimeout(() => setJustSaved(null), 2000);
        }
      }
    }));

    async function handleDelete(id: string) {
      try {
        setError(null);
        setDeleteSuccess(null);
        setDeletingTweetId(id);
        
        // Attempt to delete from database first
        const success = await deleteTweet(id);
        
        if (success) {
          // Remove from UI only after successful database deletion
          setTweets(prev => prev.filter(tweet => tweet.id !== id));
          setDeleteSuccess('Tweet deleted successfully');
          
          // Clear success message after 2 seconds
          setTimeout(() => {
            setDeleteSuccess(null);
          }, 2000);
        }
      } catch (err) {
        console.error('Error deleting tweet:', err);
        setError('Failed to delete tweet. Please try again.');
        
        // Refresh the list to ensure UI is in sync with database
        await loadTweets();
      } finally {
        setDeletingTweetId(null);
      }
    }

    function handlePostToTwitter(content: string) {
      const width = 550;
      const height = 420;
      const left = Math.round((window.screen.width - width) / 2);
      const top = Math.round((window.screen.height - height) / 2);
      
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
        'Post to Twitter',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    }

    return (
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-blue-900/95 to-purple-900/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isHidden ? 'translate-x-full' : 'translate-x-0'
        } shadow-2xl border-l border-indigo-500/30 overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-indigo-500/30 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Saved Tweets</h2>
            <button
              onClick={onToggle}
              className="text-indigo-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {deleteSuccess && (
            <div className="bg-green-500/20 p-4 border-b border-green-500/30">
              <p className="text-green-200 text-center">{deleteSuccess}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 p-4 border-b border-red-500/30">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : tweets.length === 0 ? (
              <div className="text-center text-indigo-300">
                No saved tweets yet
              </div>
            ) : (
              tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className={`bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-indigo-300/30 transition-all duration-300 ${
                    justSaved === tweet.id ? 'scale-105 bg-green-500/20 border-green-400/50' : ''
                  }`}
                >
                  <div className="flex justify-between gap-4">
                    <p className="text-white text-lg">{tweet.content}</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDelete(tweet.id)}
                        disabled={deletingTweetId === tweet.id}
                        className={`text-red-400 hover:text-red-300 transition-colors ${
                          deletingTweetId === tweet.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Delete tweet"
                      >
                        {deletingTweetId === tweet.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handlePostToTwitter(tweet.content)}
                        className="text-[#1DA1F2] hover:text-[#1a8cd8] transition-colors"
                        title="Post to Twitter"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                    </div>
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
); 