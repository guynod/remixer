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
    <div className="space-y-4">
      <div>
        <label htmlFor="input" className="block text-sm font-medium text-gray-700">
          Input Text
        </label>
        <textarea
          id="input"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter text to remix..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleRemix}
        disabled={isLoading || !inputText.trim()}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Remixing...
          </span>
        ) : (
          'Remix Content'
        )}
      </button>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {outputText && (
        <div>
          <label htmlFor="output" className="block text-sm font-medium text-gray-700">
            Remixed Output
          </label>
          <textarea
            id="output"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
            value={outputText}
            readOnly
          />
        </div>
      )}
    </div>
  )
} 