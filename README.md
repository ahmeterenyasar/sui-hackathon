# 🔗 On-Chain LinkTree - Sui Blockchain

> **Decentralized LinkTree on Sui Blockchain + Walrus Sites**
> 
> A fully on-chain profile and link management platform built for the Sui Hackathon.

[![Sui](https://img.shields.io/badge/Sui-Blockchain-blue)](https://sui.io)
[![Walrus](https://img.shields.io/badge/Walrus-Sites-purple)](https://walrus.xyz)
[![SuiNS](https://img.shields.io/badge/SuiNS-Integrated-green)](https://suins.io)

## 🎯 What is This?

**On-Chain LinkTree** is a decentralized alternative to traditional link-in-bio services like Linktree. Built on Sui blockchain with Walrus Sites hosting, it provides:

- ✅ **Fully On-Chain**: Profile data stored as Sui objects
- ✅ **Censorship-Resistant**: No central authority can delete your profile
- ✅ **Name Resolution**: Dynamic fields for readable profile URLs
- ✅ **Permanent Storage**: Files hosted on Walrus decentralized storage
- ✅ **SuiNS Integration**: Human-readable `.sui` domain names

## 🏗️ Architecture

### Smart Contract (Move)
- **Profile Objects**: Stores bio, avatar, and links on-chain
- **Dynamic Fields**: Maps custom names to profile object IDs
- **Registry System**: Global registry for name → profile resolution

### Frontend (React + Vite)
- **Mysten dApp Kit**: Wallet connection and transaction signing
- **TypeScript SDK**: Read/write blockchain data
- **React Router**: Multi-page SPA with dynamic routing

### Hosting (Walrus Sites)
- **Decentralized Storage**: All static files stored as Walrus blobs
- **On-Chain Metadata**: Site configuration stored on Sui
- **TRWal Portal**: Access via `https://<name>.trwal.app`

## 📦 Deployed Contract Info

**Network**: Sui Testnet

**Package ID**: `0x870c5abaa14474681f5cc45130512a48193755721da928c583cadf77f76363c8`

**Registry ID**: `0x722e5eed3a2e6fde53b8e4ea6bfb0d5fda9419333cadaf3270649f373a37ab21`

**Explorer Links**:
- [Package on SuiScan](https://suiscan.xyz/testnet/object/0x870c5abaa14474681f5cc45130512a48193755721da928c583cadf77f76363c8)
- [Registry on SuiScan](https://suiscan.xyz/testnet/object/0x722e5eed3a2e6fde53b8e4ea6bfb0d5fda9419333cadaf3270649f373a37ab21)

## 🚀 Quick Start

### Prerequisites

```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Install Walrus Site Builder
cargo install --git https://github.com/MystenLabs/walrus-sites.git site-builder

# Verify installations
sui --version
site-builder --version
```

### 1. Clone & Setup

```bash
git clone https://github.com/ahmeterenyasar/sui-hackathon.git
cd sui-hackathon/kumru-chain
npm install
```

### 2. Local Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### 3. Build & Deploy to Walrus

```bash
# Build production bundle
npm run build

# Setup Walrus config (first time only)
cp ../walrus-sites-config.yaml $HOME/.walrus/sites-config.yaml

# Deploy to Walrus Sites
site-builder publish --epochs 1 ./dist
```

### 4. Setup SuiNS (Optional)

1. Register a `.sui` name at [testnet.suins.io](https://testnet.suins.io)
2. Link it to your Walrus Site object ID
3. Access via `https://yourname.trwal.app`

See [SUINS_INTEGRATION.md](./SUINS_INTEGRATION.md) for detailed steps.

## 📂 Project Structure

```
sui-hackathon/
├── move/                          # Smart Contracts
│   ├── sources/
│   │   └── profile.move           # Profile contract with dynamic fields
│   ├── Move.toml                  # Package configuration
│   └── deploy.sh                  # Deployment script
│
├── kumru-chain/                   # Frontend Application
│   ├── src/
│   │   ├── App.tsx                # Main app & routing
│   │   ├── Dashboard.tsx          # Profile management
│   │   ├── CreateProfile.tsx      # Profile creation
│   │   ├── ProfileView.tsx        # View by object ID
│   │   └── ProfileByName.tsx      # View by custom name
│   ├── public/
│   │   └── _redirects             # Walrus Sites SPA routing
│   ├── ws-resources.json          # Walrus configuration
│   ├── PACKAGE_ID.txt             # Deployed package ID
│   └── REGISTRY_ID.txt            # Registry object ID
│
├── walrus-sites-config.yaml       # TRWal integration config
├── README.md                       # This file
├── DEPLOYMENT_GUIDE.md            # Detailed deployment steps
├── SUINS_INTEGRATION.md           # SuiNS setup guide
└── WALRUS_CONFIG_SETUP.md         # Walrus configuration guide
```

## 🎨 Features

### Core Features (Required)
- [x] **On-Chain Profile Storage**: All data stored as Sui objects
- [x] **Dynamic Fields**: Name-based profile resolution
- [x] **Walrus Sites Deployment**: Fully decentralized hosting
- [x] **SuiNS Integration**: Human-readable domain names

### Advanced Features (Implemented)
- [x] **Wallet Integration**: Mysten dApp Kit for seamless auth
- [x] **Flatland-style Routing**: Each profile has unique URL
- [x] **Real-time Updates**: Profile changes reflect immediately
- [x] **Mobile Responsive**: Works on all devices
- [x] **Custom Avatars**: Support for any image URL
- [x] **Registry System**: Global name → profile mapping

## 🔧 Technical Highlights

### Smart Contract Features
```move
// Dynamic field mapping for name resolution
public struct ProfileRegistry has key {
    id: UID,
}

// Name → Profile ID mapping
dynamic_field::add(&mut registry.id, name_string, profile_id);

// Retrieve profile by name
public fun get_profile_id_by_name(registry: &ProfileRegistry, name: string::String): address
```

### Frontend Integration
```typescript
// Query profile by object ID
const { data } = useSuiClientQuery('getObject', {
  id: objectId,
  options: { showContent: true }
})

// Sign and execute transactions
signAndExecute({
  transaction: tx,
  options: { showEffects: true }
})
```

### Walrus Sites Configuration
```yaml
# $HOME/.walrus/sites-config.yaml
contexts:
  testnet:
    portal: trwal.app
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799
    walrus_package: 0xd84704c17fc870b8764832c535aa6b11f21a95cd6f5bb38a9b07d2cf42220c66
```

## 📖 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**: Step-by-step deployment instructions
- **[Walrus Setup](./WALRUS_CONFIG_SETUP.md)**: Configure Walrus Sites integration
- **[SuiNS Integration](./SUINS_INTEGRATION.md)**: Link custom domains
- **[Quick Start](./QUICKSTART.md)**: Fast track for experienced developers

## 🌐 Access Your Site

After deployment, your site will be accessible at:

1. **B36 Encoding**: `https://<b36-object-id>.trwal.app`
2. **SuiNS Domain**: `https://<your-name>.trwal.app` (after setup)

### URL Patterns

- **Home**: `https://yoursite.trwal.app/`
- **Profile by ID**: `https://yoursite.trwal.app/profile/0x123...`
- **Profile by Name**: `https://yoursite.trwal.app/p/username`
- **Dashboard**: `https://yoursite.trwal.app/dashboard`
- **Create Profile**: `https://yoursite.trwal.app/create`

## 🔗 Key Resources

### Official Documentation
- [Sui Move Book](https://move-book.com/)
- [Sui Developer Docs](https://docs.sui.io/)
- [Walrus Sites Guide](https://docs.wal.app/walrus-sites/tutorial.html)
- [SuiNS Documentation](https://docs.suins.io/)

### SDKs & Tools
- [Mysten dApp Kit](https://sdk.mystenlabs.com/dapp-kit)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [VS Code Move Extension](https://docs.sui.io/references/ide/move)

### Explorers
- [SuiScan Testnet](https://suiscan.xyz/testnet)
- [WalrusScan Testnet](https://walruscan.com/testnet)

### Example Sites
- [Flatland](https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland) - NFT-per-page pattern
- [Walrus Sites Examples](https://github.com/MystenLabs/example-walrus-sites)

## 🎥 Demo

> **Demo Video**: Coming soon
>
> **Live Site**: Will be deployed to Walrus Sites

### Demo Walkthrough

1. **Connect Wallet**: Connect Sui wallet (Sui Wallet, Ethos, etc.)
2. **Create Profile**: Add bio, avatar, and links with custom username
3. **Custom Name**: Profile registered with readable name via dynamic fields
4. **Share**: Get your unique URL `https://yoursite.trwal.app/p/username`
5. **Update**: Modify your profile anytime from dashboard

### Features Demonstrated
- ✅ Wallet-based authentication
- ✅ On-chain profile creation with name registry
- ✅ Dynamic fields for name → ID resolution
- ✅ Real-time blockchain data queries
- ✅ Transaction signing and execution
- ✅ Mobile-responsive design

## 🏆 Hackathon Submission

### Mandatory Requirements
- ✅ **Walrus Sites Deployment**: Application hosted on decentralized storage
- ✅ **SuiNS Integration**: Support for `.sui` domain names
- ✅ **On-Chain Smart Contract**: Move contract deployed on Sui testnet
- ✅ **Dynamic Fields**: Name-based profile resolution system

### Bonus Features Implemented
- ✅ **Flatland Pattern**: Each profile has dedicated route
- ✅ **Professional UI/UX**: Modern design with Tailwind CSS
- ✅ **Comprehensive Docs**: Multiple guides for different aspects
- ✅ **Production Scripts**: Automated deployment workflows
- ✅ **Mobile Responsive**: Optimized for all screen sizes
- ✅ **Registry System**: Global shared object for name mapping

### Technical Innovations
- **Dynamic Fields Usage**: Efficient on-chain key-value storage
- **Shared Objects**: Registry accessible by all users
- **Type Safety**: Full TypeScript integration
- **Gas Optimization**: Efficient Move code with minimal storage

## 🛠️ Development

### Local Development

```bash
cd kumru-chain
npm install
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Lint & Format

```bash
npm run lint
```

### Testing

Connect to Sui testnet and test all features:
1. Create profile with custom name
2. Update profile data
3. View profile by ID
4. View profile by name
5. Delete profile (owner only)

## 🤝 Contributing

This is a hackathon project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is built for the Sui Hackathon and is open-source under the MIT License.

## 🙏 Acknowledgments

- **Mysten Labs**: For Sui blockchain and excellent developer tools
- **Walrus Team**: For decentralized storage infrastructure
- **SuiNS**: For human-readable domain service
- **Sui Community**: For support and resources

## 📧 Contact

- **GitHub**: [@ahmeterenyasar](https://github.com/ahmeterenyasar)
- **Project**: [sui-hackathon](https://github.com/ahmeterenyasar/sui-hackathon)

---

**Built with ❤️ on Sui Network**

*Powered by Walrus Sites • Integrated with SuiNS • Secured by Move Smart Contracts*
