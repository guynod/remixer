import { useState, useCallback } from 'react'
import { remixContent, PerplexityError } from '../api/perplexity'

export function RemixForm() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemix = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to remix')
      return
    }

    setIsLoading(true)
    setError('')
    setOutputText('')

    try {
      const remixedContent = await remixContent(inputText)
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

  return (
    <div className="space-y-10">
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

      {outputText && (
        <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-indigo-300/30">
          <label htmlFor="output" className="block text-2xl font-semibold text-white mb-4">
            Remixed Version
          </label>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-inner border border-indigo-200/30">
            <textarea
              id="output"
              rows={10}
              className="block w-full rounded-xl border-0 bg-transparent shadow-none focus:ring-0 text-white text-xl leading-relaxed resize-none"
              value={outputText}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  )
} 