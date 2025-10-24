# 🌊 Walrus Sites Configuration Setup

## Quick Setup

1. **Copy the configuration file to your Walrus directory:**

```bash
# Create directory if it doesn't exist
mkdir -p $HOME/.walrus

# Copy the config file
cp walrus-sites-config.yaml $HOME/.walrus/sites-config.yaml
```

Or alternatively:

```bash
mkdir -p $HOME/walrus
cp walrus-sites-config.yaml $HOME/walrus/sites-config.yaml
```

2. **Verify the configuration:**

```bash
site-builder --help
```

## Configuration Details

The `sites-config.yaml` file configures:

- **Portal**: `trwal.app` for testnet access
- **Package ID**: Walrus Sites package on Sui
- **Staking Object**: For storage economics
- **Walrus Context**: Links to your Walrus CLI setup

## Deployment Commands

### Deploy to Testnet

```bash
cd kumru-chain
npm run build
site-builder publish --epochs 1 ./dist
```

### Access Your Site

After deployment, you'll get two URLs:

1. **B36 URL**: `https://<b36-object-id>.trwal.app/`
2. **SuiNS URL** (after setup): `https://<your-name>.trwal.app/`

## Troubleshooting

If you get an error about configuration not found:
- Check if the file exists at `$HOME/.walrus/sites-config.yaml` or `$HOME/walrus/sites-config.yaml`
- Verify file permissions: `chmod 644 <path-to-config>`
- Make sure `site-builder` is installed: `site-builder --version`

## Resources

- [Walrus Sites Documentation](https://docs.wal.app/walrus-sites/tutorial-install.html)
- [Builder Configuration Guide](https://docs.wal.app/walrus-sites/builder-config.html)
- [TRWal Portal](https://trwal.app)
