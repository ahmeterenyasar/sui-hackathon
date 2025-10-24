import { Routes, Route, Link } from 'react-router-dom'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import CreateProfile from './CreateProfile'
import ProfileView from './ProfileView'
import ProfileByName from './ProfileByName'
import Dashboard from './Dashboard'
import './App.css'

function Home() {
  const account = useCurrentAccount()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center shadow-2xl">
        <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          On-chain LinkTree
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Profilinizi Sui Blockchain üzerinde oluşturun ve paylaşın.
          Tamamen merkeziyetsiz, sansüre dayanıklı, kalıcı linkler.
        </p>

        {account ? (
          <div className="space-y-4">
            <p className="text-white/70 mb-4">
              Cüzdan: <span className="font-mono">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/create"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                ➕ Profil Oluştur
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-white/70 mb-6">
              Başlamak için Sui cüzdanınızı bağlayın
            </p>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="text-white font-semibold mb-2">Merkeziyetsiz</h3>
            <p className="text-white/60 text-sm">
              Verileriniz blockchain'de, kimse silemez
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-semibold mb-2">Hızlı & Ucuz</h3>
            <p className="text-white/60 text-sm">
              Sui'nin yüksek performansından yararlanın
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-white font-semibold mb-2">Özelleştirilebilir</h3>
            <p className="text-white/60 text-sm">
              Avatar, bio ve sınırsız link ekleyin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
            🔗 LinkTree
          </Link>
          <ConnectButton />
        </div>
      </nav>

      {/* Routes */}
      <div className="py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:objectId" element={<ProfileView />} />
          <Route path="/p/:name" element={<ProfileByName />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="mt-20 pb-8 text-center text-white/40 text-sm">
        <p>Built on Sui Network • Powered by Walrus Sites</p>
      </footer>
    </div>
  )
}

export default App
