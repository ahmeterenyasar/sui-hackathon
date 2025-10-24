module onchain_linktree::profile {
    use sui::dynamic_field;
    use std::string;

    /// Profile yapısı - Kullanıcının bio ve linklerini tutar
    public struct Profile has key, store {
        id: UID,
        owner: address,
        bio: string::String,
        avatar_url: string::String,
        links: vector<Link>,
    }

    /// Her linkin title ve url'sini tutan struct
    public struct Link has store, copy, drop {
        title: string::String,
        url: string::String,
    }

    /// Registry - name -> Profile object_id mapping için
    public struct ProfileRegistry has key {
        id: UID,
    }

    /// Registry başlatma fonksiyonu (init ile tek sefer çalışır)
    fun init(ctx: &mut TxContext) {
        let registry = ProfileRegistry {
            id: object::new(ctx),
        };
        transfer::share_object(registry);
    }

    /// Profil oluşturma hatası
    const ENotOwner: u64 = 0;
    const ENameAlreadyExists: u64 = 1;
    const ENameNotFound: u64 = 2;

    /// Yeni profil oluştur (isimle)
    #[allow(lint(public_entry))]
    public entry fun create_profile(
        registry: &mut ProfileRegistry,
        name: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        link_titles: vector<vector<u8>>,
        link_urls: vector<vector<u8>>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let name_string = string::utf8(name);
        
        // İsim zaten kullanılıyor mu kontrol et
        assert!(!dynamic_field::exists_(&registry.id, name_string), ENameAlreadyExists);
        
        // Link'leri oluştur
        let mut links = vector::empty<Link>();
        let mut i = 0;
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

        let profile_id = object::id(&profile);
        
        // Profili shared obje olarak paylaş (herkes okuyabilsin)
        transfer::public_share_object(profile);
        
        // Registry'ye name -> object_id mapping ekle
        dynamic_field::add(&mut registry.id, name_string, profile_id);
    }

    /// İsimden profil ID'sini bul
    public fun get_profile_id_by_name(registry: &ProfileRegistry, name: string::String): address {
        assert!(dynamic_field::exists_(&registry.id, name), ENameNotFound);
        *dynamic_field::borrow(&registry.id, name)
    }

    /// Profili güncelle
    #[allow(lint(public_entry))]
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
        let mut i = 0;
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
    #[allow(lint(public_entry))]
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

    public fun get_bio(profile: &Profile): &string::String {
        &profile.bio
    }

    public fun get_avatar_url(profile: &Profile): &string::String {
        &profile.avatar_url
    }

    public fun get_links(profile: &Profile): &vector<Link> {
        &profile.links
    }

    public fun get_link_title(link: &Link): &string::String {
        &link.title
    }

    public fun get_link_url(link: &Link): &string::String {
        &link.url
    }
}
