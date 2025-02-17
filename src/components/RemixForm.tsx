import { useState, useCallback } from 'react'
import { TweetsFromPost, PerplexityError } from '../api/perplexity'
import { saveTweet } from '../lib/supabase'
import { SavedTweets } from './SavedTweets'

export function RemixForm() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSavedTweetsOpen, setIsSavedTweetsOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleRemix = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to remix')
      return
    }

    setIsLoading(true)
    setError('')
    setOutputText('')

    try {
      const remixedContent = await TweetsFromPost(inputText)
      setOutputText(remixedContent)
    } catch (err) {
      if (err instanceof PerplexityError) {
        if (err.statusCode === 401) {
          setError('Invalid API key. Please check your API key and try again.')
        } else if (err.statusCode === 429) {
          setError('Too many requests. Please wait a moment and try again.')
        } else {
          setError(`API Error: ${err.message}`)
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [inputText])

  async function handleSaveTweet(content: string) {
    try {
      setSaveError(null)
      await saveTweet(content)
      // Optional: Show success message
    } catch (err) {
      console.error('Error saving tweet:', err)
      setSaveError('Failed to save tweet. Please try again.')
    }
  }

  return (
    <>
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Create New Tweets</h2>
          <button
            onClick={() => setIsSavedTweetsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-lg text-white font-medium hover:bg-indigo-500/30 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            View Saved Tweets
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200/30">
          <label htmlFor="input" className="block text-2xl font-semibold text-white mb-4">
            Original Text
          </label>
          <div className="relative">
            <textarea
              id="input"
              rows={8}
              className="block w-full rounded-xl border-2 border-indigo-300/30 bg-white/10 shadow-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-200 resize-none text-white text-xl leading-relaxed placeholder-indigo-300/70"
              placeholder="Enter your text here to transform it into something creative..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            {inputText && !isLoading && (
              <button
                onClick={() => setInputText('')}
                className="absolute top-4 right-4 text-indigo-300/70 hover:text-indigo-200 transition-colors duration-200"
                title="Clear text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleRemix}
          disabled={isLoading || !inputText.trim()}
          className="w-full flex justify-center items-center py-6 px-8 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] transform-gpu border border-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 focus:ring-indigo-400"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Transforming your content...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="mr-3 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Remix Content
            </span>
          )}
        </button>

        {error && (
          <div className="rounded-xl bg-red-500/20 p-6 border-2 border-red-500/30 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-base text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {saveError && (
          <div className="rounded-xl bg-red-500/20 p-6 border-2 border-red-500/30 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-base text-red-200">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        {outputText && (
          <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-indigo-300/30">
            <label htmlFor="output" className="block text-2xl font-semibold text-white mb-4">
              Generated Tweets
            </label>
            <div className="space-y-4">
              {outputText.split('\n').filter(line => line.startsWith('TWEET:')).map((tweet, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-indigo-200/30 transition-all duration-300 hover:bg-white/20"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-white text-xl leading-relaxed flex-grow">
                      {tweet.replace('TWEET:', '').trim()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveTweet(tweet.replace('TWEET:', '').trim())}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-lg text-white font-medium hover:bg-indigo-500/30 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.replace('TWEET:', '').trim())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] rounded-lg text-white font-medium hover:bg-[#1a8cd8] transition-colors duration-200 whitespace-nowrap"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Post to Twitter
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SavedTweets
        isOpen={isSavedTweetsOpen}
        onClose={() => setIsSavedTweetsOpen(false)}
      />
    </>
  )
} 