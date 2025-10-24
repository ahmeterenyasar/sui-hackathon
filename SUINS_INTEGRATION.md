# 🌐 SuiNS Integration Guide

## What is SuiNS?

SuiNS (Sui Name Service) is the decentralized naming system for Sui blockchain. It allows you to:
- Register human-readable `.sui` domain names
- Point your domain to your Walrus Site
- Access your site via `https://yourname.trwal.app`

## Steps to Integrate SuiNS

### 1. Register a SuiNS Name

**Testnet:**
1. Visit [https://testnet.suins.io](https://testnet.suins.io)
2. Connect your Sui wallet
3. Search for your desired name (e.g., `mylinktree`)
4. Purchase the name with testnet SUI

**Mainnet:**
1. Visit [https://suins.io](https://suins.io)
2. Follow the same process with mainnet SUI

### 2. Get Your Walrus Site Object ID

After deploying your site with `site-builder publish`, you'll receive an object ID:

```bash
site-builder publish --epochs 1 ./dist
```

Output:
```
Created new site: OnChain LinkTree
New site object ID: 0xfcafadd6894321705815d0b1f28246589d7e7127f52e417dc2338fa663a6e003
Browse the resulting site at: https://[B36_ENCODING].trwal.app
```

Copy the **object ID**.

### 3. Link SuiNS to Walrus Site

There are two methods:

#### Method A: Using SuiNS Portal (Recommended)

1. Go to your SuiNS profile
2. Find your registered name
3. Click "Manage"
4. Under "Target Address", paste your Walrus Site **object ID**
5. Confirm the transaction

#### Method B: Using Sui CLI

```bash
# Replace with your values
NAME="mylinktree"
SITE_OBJECT_ID="0xfcafadd6894321705815d0b1f28246589d7e7127f52e417dc2338fa663a6e003"

# Set the target address
sui client call \
  --package 0xd22b24490e0bae52676651b4f56660a5ff8022a2576e0089f79b3c88d44e08f0 \
  --module suins \
  --function set_target_address \
  --args $NAME $SITE_OBJECT_ID \
  --gas-budget 10000000
```

### 4. Verify Your Setup

After linking, your site should be accessible at:

```
https://yourname.trwal.app
```

**Example:**
- If your SuiNS name is `mylinktree.sui`
- Your site will be at `https://mylinktree.trwal.app`

### 5. Update Your Profile Links

Once your SuiNS is working, you can share:
- **Short URL**: `https://mylinktree.trwal.app`
- **Profile Pages**: `https://mylinktree.trwal.app/profile/[objectId]`
- **Name-based**: `https://mylinktree.trwal.app/p/[username]`

## Advanced: Programmatic SuiNS Integration

You can also integrate SuiNS resolution directly in your frontend:

```typescript
import { SuiClient } from '@mysten/sui.js/client'

async function resolveSuiNS(name: string): Promise<string | null> {
  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' })
  
  try {
    // Query SuiNS registry
    const response = await client.getObject({
      id: 'SUINS_REGISTRY_ID',
      options: { showContent: true }
    })
    
    // Parse and return target address
    // Implementation depends on SuiNS contract structure
    return targetAddress
  } catch (error) {
    console.error('SuiNS resolution failed:', error)
    return null
  }
}
```

## Troubleshooting

### Issue: SuiNS name doesn't resolve

**Solutions:**
1. Wait a few minutes for blockchain confirmation
2. Check if the object ID is correct
3. Verify the site is published correctly: `https://[B36].trwal.app`
4. Check transaction status on [SuiScan](https://suiscan.xyz/testnet)

### Issue: Site shows 404

**Solutions:**
1. Ensure your site is published with correct epochs
2. Check `ws-resources.json` configuration
3. Verify `_redirects` file for SPA routing

### Issue: Transaction fails

**Solutions:**
1. Check you have enough SUI for gas
2. Verify you own the SuiNS name
3. Ensure the site object ID is valid

## Resources

- [SuiNS Official Docs](https://docs.suins.io/)
- [SuiNS SDK Documentation](https://docs.suins.io/developer/sdk)
- [Walrus Sites + SuiNS Tutorial](https://docs.wal.app/walrus-sites/tutorial-suins.html)
- [Testnet SuiNS Portal](https://testnet.suins.io)
- [Mainnet SuiNS Portal](https://suins.io)

## Example Workflow

1. ✅ Deploy Move contract → Get Package ID
2. ✅ Build frontend → `npm run build`
3. ✅ Publish to Walrus → `site-builder publish --epochs 1 ./dist`
4. ✅ Register SuiNS name → `mylinktree.sui`
5. ✅ Link SuiNS to site object ID
6. ✅ Access at `https://mylinktree.trwal.app`
7. ✅ Share with the world! 🎉

## Notes

- SuiNS names are NFTs and can be transferred/sold
- Names must be renewed periodically (check expiration)
- You can have multiple names pointing to the same site
- Names are case-insensitive but displayed as registered

---

**Built with ❤️ on Sui Network**
