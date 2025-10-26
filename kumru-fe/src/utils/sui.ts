import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { PACKAGE_ID, USERNAME_REGISTRY_ID, NETWORK, CLOCK_ID } from '../config/constants';

// Sui Client instance
export const suiClient = new SuiClient({
  url: `https://fullnode.${NETWORK}.sui.io:443`,
});

// ==================== Transaction Builders ====================

/**
 * Create Profile Transaction
 */
export const buildCreateProfileTx = (
  username: string,
  displayName: string,
  bio: string,
  avatarUrl: string
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::create_profile`,
    arguments: [
      tx.object(USERNAME_REGISTRY_ID), // registry
      tx.pure(bcs.string().serialize(username).toBytes()),
      tx.pure(bcs.string().serialize(displayName).toBytes()),
      tx.pure(bcs.string().serialize(bio).toBytes()),
      tx.pure(bcs.string().serialize(avatarUrl).toBytes()),
      tx.object(CLOCK_ID), // clock
    ],
  });
  
  return tx;
};

/**
 * Update Profile Transaction
 */
export const buildUpdateProfileTx = (
  profileId: string,
  displayName: string,
  bio: string,
  avatarUrl: string
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_profile`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.string().serialize(displayName).toBytes()),
      tx.pure(bcs.string().serialize(bio).toBytes()),
      tx.pure(bcs.string().serialize(avatarUrl).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Add Link Transaction
 */
export const buildAddLinkTx = (
  profileId: string,
  title: string,
  url: string,
  description: string,
  icon: string
) => {
  const tx = new Transaction();
  
  // If description is empty use empty vector, otherwise convert string to byte array
  const descriptionBytes = description ? Array.from(new TextEncoder().encode(description)) : [];
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::add_link`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.string().serialize(title).toBytes()),
      tx.pure(bcs.string().serialize(url).toBytes()),
      tx.pure(bcs.vector(bcs.u8()).serialize(descriptionBytes).toBytes()),
      tx.pure(bcs.string().serialize(icon).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Update Link Transaction
 */
export const buildUpdateLinkTx = (
  profileId: string,
  linkId: number,
  title: string,
  url: string,
  description: string,
  icon: string,
  isVisible: boolean
) => {
  const tx = new Transaction();
  
  const descriptionBytes = description ? Array.from(new TextEncoder().encode(description)) : [];
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_link`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.u64().serialize(linkId).toBytes()),
      tx.pure(bcs.string().serialize(title).toBytes()),
      tx.pure(bcs.string().serialize(url).toBytes()),
      tx.pure(bcs.vector(bcs.u8()).serialize(descriptionBytes).toBytes()),
      tx.pure(bcs.string().serialize(icon).toBytes()),
      tx.pure(bcs.bool().serialize(isVisible).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Delete Link Transaction
 */
export const buildDeleteLinkTx = (
  profileId: string,
  linkId: number
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::delete_link`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.u64().serialize(linkId).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Reorder Links Transaction
 */
export const buildReorderLinksTx = (
  profileId: string,
  newOrder: number[]
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::reorder_links`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.vector(bcs.u64()).serialize(newOrder).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Update Theme Transaction
 */
export const buildUpdateThemeTx = (
  profileId: string,
  backgroundColor: string,
  buttonStyle: string,
  font: string
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_theme`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.string().serialize(backgroundColor).toBytes()),
      tx.pure(bcs.string().serialize(buttonStyle).toBytes()),
      tx.pure(bcs.string().serialize(font).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Update Social Links Transaction
 */
export const buildUpdateSocialLinksTx = (
  profileId: string,
  twitter: string,
  discord: string,
  telegram: string,
  github: string,
  website: string
) => {
  const tx = new Transaction();
  
  // For each social link: if empty use empty vector, otherwise byte array
  const twitterBytes = twitter ? Array.from(new TextEncoder().encode(twitter)) : [];
  const discordBytes = discord ? Array.from(new TextEncoder().encode(discord)) : [];
  const telegramBytes = telegram ? Array.from(new TextEncoder().encode(telegram)) : [];
  const githubBytes = github ? Array.from(new TextEncoder().encode(github)) : [];
  const websiteBytes = website ? Array.from(new TextEncoder().encode(website)) : [];
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_social_links`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.vector(bcs.u8()).serialize(twitterBytes).toBytes()),
      tx.pure(bcs.vector(bcs.u8()).serialize(discordBytes).toBytes()),
      tx.pure(bcs.vector(bcs.u8()).serialize(telegramBytes).toBytes()),
      tx.pure(bcs.vector(bcs.u8()).serialize(githubBytes).toBytes()),
      tx.pure(bcs.vector(bcs.u8()).serialize(websiteBytes).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Transfer Profile Transaction
 */
export const buildTransferProfileTx = (
  profileId: string,
  recipient: string
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::transfer_profile`,
    arguments: [
      tx.object(profileId),
      tx.pure(bcs.Address.serialize(recipient).toBytes()),
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

/**
 * Delete Profile Transaction
 */
export const buildDeleteProfileTx = (
  profileId: string
) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::delete_profile`,
    arguments: [
      tx.object(USERNAME_REGISTRY_ID),
      tx.object(profileId), // Profile will be taken by-value
      tx.object(CLOCK_ID),
    ],
  });
  
  return tx;
};

// ==================== Query Functions ====================

/**
 * Get user's profile by wallet address
 */
export const queryUserProfile = async (ownerAddress: string) => {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${PACKAGE_ID}::profile::Profile`,
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });
    
    if (objects.data.length === 0) {
      return null;
    }
    
    // Return first profile (a user can have multiple profiles)
    return objects.data[0];
  } catch (error) {
    console.error('Error querying user profile:', error);
    return null;
  }
};

/**
 * Get profile by username (event-based lookup)
 */
export const queryProfileByUsername = async (username: string) => {
  try {
    // ProfileCreated event'lerini query et
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::profile::ProfileCreated`,
      },
      limit: 1000, // Son 1000 profil
    });
    
    // Username'e göre profil bul
    const profileEvent = events.data.find(
      (event: any) => event.parsedJson?.username === username
    );
    
    if (!profileEvent || !profileEvent.parsedJson) {
      return null;
    }
    
    // Profile object'i getir
    const profileId = (profileEvent.parsedJson as any).profile_id;
    const profile = await suiClient.getObject({
      id: profileId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });
    
    return profile;
  } catch (error) {
    console.error('Error querying profile by username:', error);
    return null;
  }
};

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const profile = await queryProfileByUsername(username);
    return profile === null; // Null ise available
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
};

/**
 * Get all profiles (for Explore page)
 */
export const queryAllProfiles = async (limit: number = 100) => {
  try {
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::profile::ProfileCreated`,
      },
      limit,
      order: 'descending', // En yeni önce
    });
    
    // Fetch profile object for each event
    const profiles = await Promise.all(
      events.data.map(async (event: any) => {
        try {
          const profileId = event.parsedJson.profile_id;
          const profile = await suiClient.getObject({
            id: profileId,
            options: {
              showContent: true,
              showOwner: true,
            },
          });
          return profile;
        } catch (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
      })
    );
    
    // Null olmayan profilleri filtrele
    return profiles.filter(p => p !== null);
  } catch (error) {
    console.error('Error querying all profiles:', error);
    return [];
  }
};

/**
 * Get profile stats (link clicks, views, etc.)
 * NOTE: This version only returns on-chain event counts
 * Real click tracking requires an off-chain database
 */
export const queryProfileStats = async (profileId: string) => {
  try {
    // Link ekleme event'lerini say
    const linkAddedEvents = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::profile::LinkAdded`,
      },
    });
    
    const profileLinks = linkAddedEvents.data.filter(
      (event: any) => event.parsedJson.profile_id === profileId
    );
    
    // Count profile update events
    const updateEvents = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::profile::ProfileUpdated`,
      },
    });
    
    const profileUpdates = updateEvents.data.filter(
      (event: any) => event.parsedJson.profile_id === profileId
    );
    
    return {
      totalLinks: profileLinks.length,
      totalUpdates: profileUpdates.length,
      // Real click tracking requires an off-chain database
      totalClicks: 0,
      totalViews: 0,
    };
  } catch (error) {
    console.error('Error querying profile stats:', error);
    return {
      totalLinks: 0,
      totalUpdates: 0,
      totalClicks: 0,
      totalViews: 0,
    };
  }
};

/**
 * Parse profile object to our Profile type
 */
export const parseProfileObject = (profileObject: any) => {
  if (!profileObject?.content) {
    return null;
  }
  
  const fields = profileObject.content.fields;
  
  // Convert timestamps to numbers (they might come as strings from blockchain)
  const parseTimestamp = (ts: any): number => {
    if (typeof ts === 'string') {
      return parseInt(ts, 10);
    }
    return Number(ts) || Date.now();
  };
  
  return {
    id: profileObject.objectId,
    owner: fields.owner,
    username: fields.username,
    displayName: fields.display_name,
    bio: fields.bio,
    avatarUrl: fields.avatar_url,
    theme: {
      backgroundColor: fields.theme.fields.background_color,
      buttonStyle: fields.theme.fields.button_style,
      font: fields.theme.fields.font,
    },
    links: fields.links.map((link: any) => ({
      id: link.fields.id,
      title: link.fields.title,
      url: link.fields.url,
      description: link.fields.description || '',
      icon: link.fields.icon,
      position: link.fields.position,
      isVisible: link.fields.is_visible,
    })),
    socialLinks: {
      twitter: fields.social_links.fields.twitter || '',
      discord: fields.social_links.fields.discord || '',
      telegram: fields.social_links.fields.telegram || '',
      github: fields.social_links.fields.github || '',
      website: fields.social_links.fields.website || '',
    },
    createdAt: parseTimestamp(fields.created_at),
    updatedAt: parseTimestamp(fields.updated_at),
  };
};
