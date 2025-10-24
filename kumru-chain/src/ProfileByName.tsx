import { useParams } from 'react-router-dom'
import { useSuiClientQuery } from '@mysten/dapp-kit'
import { useEffect, useState } from 'react'

const PACKAGE_ID = '0x870c5abaa14474681f5cc45130512a48193755721da928c583cadf77f76363c8'
const REGISTRY_ID = '0x722e5eed3a2e6fde53b8e4ea6bfb0d5fda9419333cadaf3270649f373a37ab21' // Deploy sonrası güncellenecek

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

export default function ProfileByName() {
  const { name } = useParams<{ name: string }>()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Registry'den profile ID'yi al
  const { data: registryData, isLoading: isLoadingRegistry } = useSuiClientQuery(
    'getObject',
    {
      id: REGISTRY_ID,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!REGISTRY_ID,
    }
  )

  // Registry'den dynamic field ile profile ID'yi çöz
  useEffect(() => {
    if (registryData?.data?.content && 'fields' in registryData.data.content) {
      const fields = registryData.data.content.fields as any
      // Dynamic fields'ten name ile profile ID'yi bul
      // Bu kısım registry yapısına göre güncellenmeli
      console.log('Registry fields:', fields)
      
      // Örnek: fields.id içinde dynamic_fields varsa
      // setProfileId(fields.profiles[name])
    }
  }, [registryData, name])

  // Profile verisini al
  const { data: profileData, isLoading: isLoadingProfile } = useSuiClientQuery(
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

  if (isLoadingRegistry || isLoadingProfile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/80">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-500/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h2>
          <p className="text-white/80">
            {error || `The profile "${name}" does not exist or could not be loaded.`}
          </p>
        </div>
      </div>
    )
  }

  // Parse profile data
  let profile: ProfileData | null = null
  
  if (profileData.data?.content && 'fields' in profileData.data.content) {
    const fields = profileData.data.content.fields as any
    
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
        <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-500/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white/80">Could not parse profile data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400 shadow-lg"
            />
          )}
          <h1 className="text-3xl font-bold text-white mb-2">@{name}</h1>
          <p className="text-white/80 mb-4">{profile.bio}</p>
          <p className="text-xs text-white/50 font-mono break-all">
            Owner: {profile.owner}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {profile.links.length === 0 ? (
            <p className="text-center text-white/60">No links yet</p>
          ) : (
            profile.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-200 border border-white/10 hover:border-purple-400/50 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
                    {link.title}
                  </span>
                  <svg
                    className="w-5 h-5 text-white/50 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
