import { useState, useEffect } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { bcs } from '@mysten/sui/bcs'
import { useNavigate } from 'react-router-dom'

// Move kontratınızı deploy ettikten sonra buraya package ID'yi ekleyin
const PACKAGE_ID = '0x870c5abaa14474681f5cc45130512a48193755721da928c583cadf77f76363c8'

interface LinkInput {
  title: string
  url: string
}

interface ProfileData {
  objectId: string
  owner: string
  bio: string
  avatar_url: string
  links: LinkInput[]
}

export default function Dashboard() {
  const account = useCurrentAccount()
  const navigate = useNavigate()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [links, setLinks] = useState<LinkInput[]>([{ title: '', url: '' }])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  // localStorage'dan profile ID'yi al
  useEffect(() => {
    if (account?.address) {
      const savedProfileId = localStorage.getItem(`profile_${account.address}`)
      if (savedProfileId) {
        setProfileId(savedProfileId)
      }
    }
  }, [account?.address])

  // Profile ID ile profili çek (shared object)
  const { data: profileObject } = useSuiClientQuery(
    'getObject',
    {
      id: profileId!,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!profileId,
    }
  )

  // Kullanıcının profilini bul (owned objects'ten - fallback)
  const { data: ownedObjects } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: {
        StructType: `${PACKAGE_ID}::profile::Profile`,
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!account?.address && !profileId,
    }
  )

  // Profili yükle - önce localStorage'dan, sonra owned objects'ten
  useEffect(() => {
    // Önce localStorage'dan gelen profili kontrol et
    if (profileObject?.data?.content && 'fields' in profileObject.data.content) {
      const fields = profileObject.data.content.fields as any
      const profileData: ProfileData = {
        objectId: profileObject.data.objectId,
        owner: fields.owner || '',
        bio: fields.bio || '',
        avatar_url: fields.avatar_url || '',
        links: Array.isArray(fields.links)
          ? fields.links.map((link: any) => ({
              title: link.fields?.title || link.title || '',
              url: link.fields?.url || link.url || '',
            }))
          : [],
      }
      setUserProfile(profileData)
      setBio(profileData.bio)
      setAvatarUrl(profileData.avatar_url)
      setLinks(profileData.links.length > 0 ? profileData.links : [{ title: '', url: '' }])
      return
    }

    // Fallback: owned objects'ten ara
    if (ownedObjects && ownedObjects.data.length > 0) {
      const firstProfile = ownedObjects.data[0]
      if (firstProfile.data?.content && 'fields' in firstProfile.data.content) {
        const fields = firstProfile.data.content.fields as any
        const profileData: ProfileData = {
          objectId: firstProfile.data.objectId,
          owner: fields.owner || '',
          bio: fields.bio || '',
          avatar_url: fields.avatar_url || '',
          links: Array.isArray(fields.links)
            ? fields.links.map((link: any) => ({
                title: link.fields?.title || link.title || '',
                url: link.fields?.url || link.url || '',
              }))
            : [],
        }
        setUserProfile(profileData)
        setBio(profileData.bio)
        setAvatarUrl(profileData.avatar_url)
        setLinks(profileData.links.length > 0 ? profileData.links : [{ title: '', url: '' }])
      }
    }
  }, [ownedObjects, profileObject])

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account || !userProfile) {
      setError('Profil bulunamadı')
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
        target: `${PACKAGE_ID}::profile::update_profile`,
        arguments: [
          tx.object(userProfile.objectId),
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
            console.log('Profil güncellendi:', result)
            alert('Profil başarıyla güncellendi!')
            setIsLoading(false)
            setIsEditing(false)
            window.location.reload()
          },
          onError: (err: any) => {
            console.error('Hata:', err)
            setError(`Profil güncellenirken bir hata oluştu: ${err.message || err}`)
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
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
          <p className="text-white/70">Lütfen önce Sui cüzdanınızı bağlayın</p>
        </div>
      </div>
    )
  }

  // Profil yoksa - CreateProfile'a yönlendir
  if (!userProfile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-white/70 mb-6">Henüz bir profiliniz yok. Hemen oluşturun!</p>
          
          <button
            onClick={() => navigate('/create')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Profil Oluştur
          </button>
        </div>
      </div>
    )
  }

  // Profil varsa - görüntüleme/düzenleme
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sol: Profil Önizleme */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Profil Önizleme</h2>

          <div className="flex flex-col items-center mb-6">
            {userProfile.avatar_url ? (
              <img
                src={userProfile.avatar_url}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20 mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/150/6366f1/ffffff?text=Avatar'
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white/20 mb-4">
                <span className="text-4xl text-white">👤</span>
              </div>
            )}

            <p className="text-white/60 text-sm font-mono">
              {userProfile.owner.slice(0, 6)}...{userProfile.owner.slice(-4)}
            </p>
          </div>

          <div className="mb-6 text-center">
            <p className="text-white text-lg leading-relaxed">{userProfile.bio}</p>
          </div>

          <div className="space-y-3">
            {userProfile.links.map((link, index) => (
              <div
                key={index}
                className="block w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white font-medium text-center"
              >
                {link.title}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => navigate(`/profile/${userProfile.objectId}`)}
              className="w-full px-4 py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              🔗 Profil Sayfasını Aç
            </button>
          </div>
        </div>

        {/* Sağ: Düzenleme Formu */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Profili Düzenle</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                ✏️ Düzenle
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="text-white/60 text-center py-12">
              <p>Profilinizi düzenlemek için yukarıdaki butona tıklayın</p>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kendinizi tanıtın..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Linkler</label>
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(index, 'title', e.target.value)}
                        placeholder="Başlık"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                        required
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        placeholder="URL"
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

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setBio(userProfile.bio)
                    setAvatarUrl(userProfile.avatar_url)
                    setLinks(userProfile.links)
                  }}
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
