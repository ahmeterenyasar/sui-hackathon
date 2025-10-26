// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// Onchain LinkTree - Personal profile and link management on blockchain
/// Users can create profiles as NFTs and manage their links



module linktree::profile{
    use std::string::{Self, String};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::display;
    use sui::package;

    // ==================== Errors ====================
    const EUsernameAlreadyExists: u64 = 0;
    const ENotOwner: u64 = 1;
    const EInvalidUsername: u64 = 2;
    const ELinkNotFound: u64 = 4;
    const ETooManyLinks: u64 = 5;
    const EInvalidBio: u64 = 6;
    const EInvalidReorder: u64 = 7;

    // ==================== Constants ====================
    const MAX_LINKS: u64 = 50;
    const MAX_USERNAME_LENGTH: u64 = 30;
    const MAX_BIO_LENGTH: u64 = 160;

    // ==================== Structs ====================

    /// One-time witness for Display
    public struct PROFILE has drop {}

    /// User profile (as NFT)
    public struct Profile has key, store {
        id: UID,
        owner: address,
        username: String,
        display_name: String,
        bio: String,
        avatar_url: String,
        theme: Theme,
        links: vector<Link>,
        social_links: SocialLinks,
        created_at: u64,
        updated_at: u64,
    }

    /// Theme settings
    public struct Theme has store, copy, drop {
        background_color: String,
        button_style: String,
        font: String,
    }

    /// Link object
    public struct Link has store, copy, drop {
        id: u64,
        title: String,
        url: String,
        description: Option<String>,
        icon: String,
        position: u64,
        is_visible: bool,
    }

    /// Social media links
    public struct SocialLinks has store, copy, drop {
        twitter: Option<String>,
        discord: Option<String>,
        telegram: Option<String>,
        github: Option<String>,
        website: Option<String>,
    }

    /// Username registry (global, shared object)
    public struct UsernameRegistry has key {
        id: UID,
        usernames: vector<String>,
    }

    // ==================== Events ====================

    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        username: String,
        timestamp: u64,
    }

    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
        owner: address,
        timestamp: u64,
    }

    public struct LinkAdded has copy, drop {
        profile_id: ID,
        link_id: u64,
        title: String,
        url: String,
        timestamp: u64,
    }

    public struct LinkUpdated has copy, drop {
        profile_id: ID,
        link_id: u64,
        timestamp: u64,
    }

    public struct LinkDeleted has copy, drop {
        profile_id: ID,
        link_id: u64,
        timestamp: u64,
    }

    public struct ProfileTransferred has copy, drop {
        profile_id: ID,
        from: address,
        to: address,
        timestamp: u64,
    }

    public struct ProfileDeleted has copy, drop {
        profile_id: ID,
        owner: address,
        username: String,
        timestamp: u64,
    }

    // ==================== Init ====================

    fun init(otw: PROFILE, ctx: &mut TxContext) {
        // Create username registry as shared object
        let registry = UsernameRegistry {
            id: object::new(ctx),
            usernames: vector::empty(),
        };
        transfer::share_object(registry);

        // Create publisher for Display standard
        let publisher = package::claim(otw, ctx);

        // Create Display template
        let mut display = display::new<Profile>(&publisher, ctx);
        
        display::add(&mut display, string::utf8(b"name"), string::utf8(b"{display_name} (@{username})"));
        display::add(&mut display, string::utf8(b"description"), string::utf8(b"{bio}"));
        display::add(&mut display, string::utf8(b"image_url"), string::utf8(b"{avatar_url}"));
        display::add(&mut display, string::utf8(b"project_url"), string::utf8(b"https://kumru.link/{username}"));
        display::add(&mut display, string::utf8(b"creator"), string::utf8(b"Kumru"));
        
        display::update_version(&mut display);

        // Transfer Publisher and Display
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    // ==================== Public Entry Functions ====================

    /// Create new profile
    public fun create_profile(
        registry: &mut UsernameRegistry,
        username: String,
        display_name: String,
        bio: String,
        avatar_url: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): Profile {
        // Username validation
        assert!(!username_exists(registry, &username), EUsernameAlreadyExists);
        assert!(string::length(&username) <= MAX_USERNAME_LENGTH, EInvalidUsername);
        assert!(string::length(&bio) <= MAX_BIO_LENGTH, EInvalidBio);

        let timestamp = clock::timestamp_ms(clock);
        
        let profile = Profile {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            username,
            display_name,
            bio,
            avatar_url,
            theme: default_theme(),
            links: vector::empty(),
            social_links: empty_social_links(),
            created_at: timestamp,
            updated_at: timestamp,
        };

        let profile_id = object::uid_to_inner(&profile.id);
        
        // Add username to registry
        vector::push_back(&mut registry.usernames, profile.username);

        // Event emit
        event::emit(ProfileCreated {
            profile_id,
            owner: tx_context::sender(ctx),
            username: profile.username,
            timestamp,
        });

        // Return profile (allow caller to transfer it)
        profile
    }

    /// Update profile information
    public fun update_profile(
        profile: &mut Profile,
        display_name: String,
        bio: String,
        avatar_url: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(string::length(&bio) <= MAX_BIO_LENGTH, EInvalidBio);

        profile.display_name = display_name;
        profile.bio = bio;
        profile.avatar_url = avatar_url;
        profile.updated_at = clock::timestamp_ms(clock);

        event::emit(ProfileUpdated {
            profile_id: object::uid_to_inner(&profile.id),
            owner: tx_context::sender(ctx),
            timestamp: profile.updated_at,
        });
    }

    /// Link ekle
    public fun add_link(
        profile: &mut Profile,
        title: String,
        url: String,
        description: vector<u8>, // Use vector<u8> instead of Option (empty vector for none)
        icon: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(vector::length(&profile.links) < MAX_LINKS, ETooManyLinks);

        let link_id = vector::length(&profile.links);
        let position = link_id;

        let desc_option = if (vector::is_empty(&description)) {
            option::none()
        } else {
            option::some(string::utf8(description))
        };

        let link = Link {
            id: link_id,
            title,
            url,
            description: desc_option,
            icon,
            position,
            is_visible: true,
        };

        vector::push_back(&mut profile.links, link);
        profile.updated_at = clock::timestamp_ms(clock);

        event::emit(LinkAdded {
            profile_id: object::uid_to_inner(&profile.id),
            link_id,
            title: link.title,
            url: link.url,
            timestamp: profile.updated_at,
        });
    }

    /// Update link
    public fun update_link(
        profile: &mut Profile,
        link_id: u64,
        title: String,
        url: String,
        description: vector<u8>,
        icon: String,
        is_visible: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(link_id < vector::length(&profile.links), ELinkNotFound);
        
        let desc_option = if (vector::is_empty(&description)) {
            option::none()
        } else {
            option::some(string::utf8(description))
        };

        let link = vector::borrow_mut(&mut profile.links, link_id);
        link.title = title;
        link.url = url;
        link.description = desc_option;
        link.icon = icon;
        link.is_visible = is_visible;
        
        profile.updated_at = clock::timestamp_ms(clock);

        event::emit(LinkUpdated {
            profile_id: object::uid_to_inner(&profile.id),
            link_id,
            timestamp: profile.updated_at,
        });
    }

    /// Link sil
    public fun delete_link(
        profile: &mut Profile,
        link_id: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(link_id < vector::length(&profile.links), ELinkNotFound);

        vector::remove(&mut profile.links, link_id);
        
        // Adjust remaining link IDs
        let len = vector::length(&profile.links);
        let mut i = link_id;
        while (i < len) {
            let link = vector::borrow_mut(&mut profile.links, i);
            link.id = i;
            i = i + 1;
        };

        profile.updated_at = clock::timestamp_ms(clock);

        event::emit(LinkDeleted {
            profile_id: object::uid_to_inner(&profile.id),
            link_id,
            timestamp: profile.updated_at,
        });
    }

    /// Reorder links
    public fun reorder_links(
        profile: &mut Profile,
        new_order: vector<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(vector::length(&new_order) == vector::length(&profile.links), EInvalidReorder);

        let mut new_links = vector::empty<Link>();
        let mut i = 0;
        let len = vector::length(&new_order);
        
        while (i < len) {
            let old_pos = *vector::borrow(&new_order, i);
            let link = *vector::borrow(&profile.links, old_pos);
            let mut new_link = link;
            new_link.position = i;
            vector::push_back(&mut new_links, new_link);
            i = i + 1;
        };

        profile.links = new_links;
        profile.updated_at = clock::timestamp_ms(clock);
    }

    /// Update theme
    public fun update_theme(
        profile: &mut Profile,
        background_color: String,
        button_style: String,
        font: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        profile.theme = Theme {
            background_color,
            button_style,
            font,
        };
        
        profile.updated_at = clock::timestamp_ms(clock);
    }

    /// Update social media links
    public fun update_social_links(
        profile: &mut Profile,
        twitter: vector<u8>,
        discord: vector<u8>,
        telegram: vector<u8>,
        github: vector<u8>,
        website: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        profile.social_links = SocialLinks {
            twitter: if (vector::is_empty(&twitter)) { option::none() } else { option::some(string::utf8(twitter)) },
            discord: if (vector::is_empty(&discord)) { option::none() } else { option::some(string::utf8(discord)) },
            telegram: if (vector::is_empty(&telegram)) { option::none() } else { option::some(string::utf8(telegram)) },
            github: if (vector::is_empty(&github)) { option::none() } else { option::some(string::utf8(github)) },
            website: if (vector::is_empty(&website)) { option::none() } else { option::some(string::utf8(website)) },
        };

        profile.updated_at = clock::timestamp_ms(clock);
    }

    /// Transfer profile to another address
    public fun transfer_profile(
        profile: Profile,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        
        let timestamp = clock::timestamp_ms(clock);
        let profile_id = object::uid_to_inner(&profile.id);
        
        event::emit(ProfileTransferred {
            profile_id,
            from: tx_context::sender(ctx),
            to: recipient,
            timestamp,
        });

        transfer::public_transfer(profile, recipient);
    }

    /// Delete profile permanently
    public entry fun delete_profile(
        registry: &mut UsernameRegistry,
        profile: Profile,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        // Object ownership check - Is Sui object owner the same as sender?
        // Since Profile is taken by-value, you already need to be the owner,
        // but for extra security we can check the profile.owner field too
        // Or we can just trust object ownership (transaction will fail anyway)
        
        let timestamp = clock::timestamp_ms(clock);
        let profile_id = object::uid_to_inner(&profile.id);
        let username_copy = profile.username;
        let owner_copy = profile.owner;
        
        // Remove username from registry
        let (exists, index) = vector::index_of(&registry.usernames, &profile.username);
        if (exists) {
            vector::remove(&mut registry.usernames, index);
        };

        event::emit(ProfileDeleted {
            profile_id,
            owner: owner_copy,
            username: username_copy,
            timestamp,
        });

        // Destroy profile object
        let Profile { 
            id, 
            owner: _, 
            username: _, 
            display_name: _, 
            bio: _, 
            avatar_url: _, 
            theme: _, 
            links: _, 
            social_links: _, 
            created_at: _, 
            updated_at: _ 
        } = profile;
        
        object::delete(id);
    }

    // ==================== Helper Functions ====================

    fun username_exists(registry: &UsernameRegistry, username: &String): bool {
        vector::contains(&registry.usernames, username)
    }

    fun default_theme(): Theme {
        Theme {
            background_color: string::utf8(b"#1a1a1a"),
            button_style: string::utf8(b"rounded"),
            font: string::utf8(b"Inter"),
        }
    }

    fun empty_social_links(): SocialLinks {
        SocialLinks {
            twitter: option::none(),
            discord: option::none(),
            telegram: option::none(),
            github: option::none(),
            website: option::none(),
        }
    }

    // ==================== View Functions ====================

    public fun get_username(profile: &Profile): String {
        profile.username
    }

    public fun get_display_name(profile: &Profile): String {
        profile.display_name
    }

    public fun get_bio(profile: &Profile): String {
        profile.bio
    }

    public fun get_links_count(profile: &Profile): u64 {
        vector::length(&profile.links)
    }

    public fun get_owner(profile: &Profile): address {
        profile.owner
    }

    public fun get_avatar_url(profile: &Profile): String {
        profile.avatar_url
    }
}
