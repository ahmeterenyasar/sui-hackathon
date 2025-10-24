import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { bcs } from '@mysten/sui/bcs'
import { useNavigate } from 'react-router-dom'

// Move kontratınızı deploy ettikten sonra buraya package ID'yi ekleyin
const PACKAGE_ID = 'YOUR_PACKAGE_ID_HERE'

interface LinkInput {
  title: string
  url: string
}

export default function CreateProfile() {
  const account = useCurrentAccount()
  const navigate = useNavigate()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [links, setLinks] = useState<LinkInput[]>([{ title: '', url: '' }])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addLink = () => {
    setLinks([...links, { title: '', url: '' }])
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account) {
      setError('Lütfen önce cüzdanınızı bağlayın')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()
      
      // Bio ve avatar için tek vector<u8> (string değil)
      const bioBytes = Array.from(new TextEncoder().encode(bio))
      const avatarBytes = Array.from(new TextEncoder().encode(avatarUrl))
      
      // Her link için vector<u8> array'i
      const linkTitlesBytes = links.map(link => Array.from(new TextEncoder().encode(link.title)))
      const linkUrlsBytes = links.map(link => Array.from(new TextEncoder().encode(link.url)))

      tx.moveCall({
        target: `${PACKAGE_ID}::profile::create_profile`,
        arguments: [
          tx.pure(bcs.vector(bcs.u8()).serialize(bioBytes)),
          tx.pure(bcs.vector(bcs.u8()).serialize(avatarBytes)),
          tx.pure(bcs.vector(bcs.vector(bcs.u8())).serialize(linkTitlesBytes)),
          tx.pure(bcs.vector(bcs.vector(bcs.u8())).serialize(linkUrlsBytes)),
        ],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Profil oluşturuldu:', result)
            alert('Profil başarıyla oluşturuldu! Dashboard\'da görebilirsiniz.')
            navigate('/dashboard')
            setIsLoading(false)
          },
          onError: (err) => {
            console.error('Hata:', err)
            setError(`Profil oluşturulurken bir hata oluştu: ${err.message || err}`)
            setIsLoading(false)
          },
        }
      )
    } catch (err: any) {
      console.error('Transaction hatası:', err)
      setError(`Transaction oluşturulurken bir hata oluştu: ${err.message || err}`)
      setIsLoading(false)
    }
  }

  if (!account) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Profil Oluşturmak İçin Cüzdan Bağlayın
          </h2>
          <p className="text-white/70">
            Lütfen önce Sui cüzdanınızı bağlayın
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profil Oluştur</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-white font-medium mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendinizi tanıtın..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
              rows={4}
              required
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-white font-medium mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
              required
            />
          </div>

          {/* Links */}
          <div>
            <label className="block text-white font-medium mb-2">
              Linkler
            </label>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                    placeholder="Başlık (ör: GitHub)"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    required
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="https://github.com/username"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    required
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="px-4 py-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      Sil
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLink}
              className="mt-3 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              + Link Ekle
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Profil Oluşturuluyor...' : 'Profil Oluştur'}
          </button>
        </form>
      </div>
    </div>
  )
}
