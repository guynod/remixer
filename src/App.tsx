import { useState } from 'react'
import OpenAI from 'openai'
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
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      })

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative assistant that remixes and reimagines text in interesting ways. Keep the main message but make it more engaging."
          },
          {
            role: "user",
            content: inputText
          }
        ],
      })

      setOutputText(response.choices[0].message.content || '')
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
          Content Remixer
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
