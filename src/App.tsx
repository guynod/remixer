import { RemixForm } from './components/RemixForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200">
            Content Remixer{' '}
            <span className="block text-2xl mt-4 font-medium text-indigo-200">
              Powered by Perplexity AI
            </span>
          </h1>
          <p className="mt-8 text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Transform your text with AI-powered creativity. Enter your content below and watch it be reimagined while preserving its core message.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-indigo-500/20">
          <div className="p-8 sm:p-10">
            <RemixForm />
          </div>
        </div>

        <footer className="mt-16 text-center text-indigo-200">
          <p>© {new Date().getFullYear()} Content Remixer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
