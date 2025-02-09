import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemix = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to remix')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      })

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Please remix and reimagine this text in an interesting way while keeping the main message: ${inputText}`
          }
        ],
      })

      const remixedContent = response.content[0].type === 'text' 
        ? response.content[0].text 
        : 'Unable to process response'
      
      setOutputText(remixedContent)
    } catch (err) {
      setError('Failed to remix text. Please check your API key and try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Content Remixer (Powered by Claude)
        </h1>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
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
              />
            </div>

            <button
              onClick={handleRemix}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Remixing...' : 'Remix Content'}
            </button>

            {error && (
              <div className="text-red-600 text-sm">
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
        </div>
      </div>
    </div>
  )
}

export default App
