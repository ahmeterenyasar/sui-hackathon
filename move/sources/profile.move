module onchain_linktree::profile {
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::vector;

    /// Profile yapısı - Kullanıcının bio ve linklerini tutar
    public struct Profile has key, store {
        id: UID,
        owner: address,
        bio: String,
        avatar_url: String,
        links: vector<Link>,
    }

    /// Her linkin title ve url'sini tutan struct
    public struct Link has store, copy, drop {
        title: String,
        url: String,
    }

    /// Profil oluşturma hatası
    const ENotOwner: u64 = 0;

    /// Yeni profil oluştur
    public entry fun create_profile(
        bio: vector<u8>,
        avatar_url: vector<u8>,
        link_titles: vector<vector<u8>>,
        link_urls: vector<vector<u8>>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Link'leri oluştur
        let links = vector::empty<Link>();
        let i = 0;
        let len = vector::length(&link_titles);
        
        while (i < len) {
            let link = Link {
                title: string::utf8(*vector::borrow(&link_titles, i)),
                url: string::utf8(*vector::borrow(&link_urls, i)),
            };
            vector::push_back(&mut links, link);
            i = i + 1;
        };

        // Profil oluştur
        let profile = Profile {
            id: object::new(ctx),
            owner: sender,
            bio: string::utf8(bio),
            avatar_url: string::utf8(avatar_url),
            links,
        };

        // Profili shared obje olarak paylaş (herkes okuyabilsin)
        transfer::public_share_object(profile);
    }

    /// Profili güncelle
    public entry fun update_profile(
        profile: &mut Profile,
        new_bio: vector<u8>,
        new_avatar_url: vector<u8>,
        link_titles: vector<vector<u8>>,
        link_urls: vector<vector<u8>>,
        ctx: &mut TxContext
    ) {
        // Sadece owner güncelleyebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        // Bio ve avatar'ı güncelle
        profile.bio = string::utf8(new_bio);
        profile.avatar_url = string::utf8(new_avatar_url);

        // Eski linkleri temizle
        profile.links = vector::empty<Link>();

        // Yeni linkleri ekle
        let i = 0;
        let len = vector::length(&link_titles);
        
        while (i < len) {
            let link = Link {
                title: string::utf8(*vector::borrow(&link_titles, i)),
                url: string::utf8(*vector::borrow(&link_urls, i)),
            };
            vector::push_back(&mut profile.links, link);
            i = i + 1;
        };
    }

    /// Profili sil
    public entry fun delete_profile(
        profile: Profile,
        ctx: &mut TxContext
    ) {
        // Sadece owner silebilir
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let Profile { id, owner: _, bio: _, avatar_url: _, links: _ } = profile;
        object::delete(id);
    }

    // Getter fonksiyonlar (frontend'den okumak için)
    public fun get_owner(profile: &Profile): address {
        profile.owner
    }

    public fun get_bio(profile: &Profile): &String {
        &profile.bio
    }

    public fun get_avatar_url(profile: &Profile): &String {
        &profile.avatar_url
    }

    public fun get_links(profile: &Profile): &vector<Link> {
        &profile.links
    }

    public fun get_link_title(link: &Link): &String {
        &link.title
    }

    public fun get_link_url(link: &Link): &String {
        &link.url
    }
}
