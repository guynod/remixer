import './App.css'
import { RemixForm } from './components/RemixForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Content Remixer (Powered by Perplexity AI)
        </h1>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <RemixForm />
        </div>
      </div>
    </div>
  )
}

export default App
