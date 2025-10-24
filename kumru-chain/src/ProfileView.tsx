import { useParams } from 'react-router-dom'
import { useSuiClientQuery } from '@mysten/dapp-kit'

interface Link {
  title: string
  url: string
}

interface ProfileData {
  owner: string
  bio: string
  avatar_url: string
  links: Link[]
}

export default function ProfileView() {
  const { objectId } = useParams<{ objectId: string }>()

  const { data, isLoading, error } = useSuiClientQuery(
    'getObject',
    {
      id: objectId!,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!objectId,
    }
  )

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="animate-pulse">
            <div className="h-24 w-24 bg-white/20 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-red-500/40">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Profil Bulunamadı</h2>
          <p className="text-red-200">
            Bu profil ID'si geçersiz veya profil silinmiş olabilir.
          </p>
        </div>
      </div>
    )
  }

  // Parse profile data from blockchain
  let profile: ProfileData | null = null
  
  if (data.data?.content && 'fields' in data.data.content) {
    const fields = data.data.content.fields as any
    
    profile = {
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
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-red-500/40">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Profil Verisi Okunamadı</h2>
          <p className="text-red-200">
            Profil verisi beklenmedik bir formatta.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
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
          
          {/* Owner Address (shortened) */}
          <p className="text-white/60 text-sm font-mono">
            {profile.owner.slice(0, 6)}...{profile.owner.slice(-4)}
          </p>
        </div>

        {/* Bio */}
        <div className="mb-8 text-center">
          <p className="text-white text-lg leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {profile.links && profile.links.length > 0 ? (
            profile.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl text-white font-medium text-center transition-all transform hover:scale-105"
              >
                {link.title}
              </a>
            ))
          ) : (
            <p className="text-white/60 text-center py-4">
              Henüz link eklenmemiş
            </p>
          )}
        </div>

        {/* Object ID */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/40 text-xs text-center font-mono break-all">
            Object ID: {objectId}
          </p>
        </div>
      </div>
    </div>
  )
}
