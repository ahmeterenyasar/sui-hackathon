// Sui Network Configuration
export const NETWORK = "testnet"; // devnet, testnet, mainnet

// Contract Package ID (will be updated after deployment)
export const PACKAGE_ID = "0x1e4b7a3cd5fa66e32d079133557ca56d7969582c35a8aa9eea4603ca8637e92d";

// Shared Objects
export const USERNAME_REGISTRY_ID = "0xb4692e198852cbaf598f180743dad86a76a39425eb5e2c67130a54f5f334cdfe"; // UsernameRegistry (Shared Object)
export const CLOCK_ID = "0x6"; // Sui system clock (constant)

// Limits
export const MAX_USERNAME_LENGTH = 30;
export const MAX_DISPLAY_NAME_LENGTH = 50;
export const MAX_BIO_LENGTH = 160;
export const MAX_LINKS = 50;

// Themes
export const AVAILABLE_THEMES = [
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    backgroundColor: "#1a1a2e",
    buttonStyle: "rounded",
    font: "Inter",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    preview: {
      bg: "#1a1a2e",
      buttonBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      buttonText: "#ffffff",
    }
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    backgroundColor: "#0f2027",
    buttonStyle: "rounded",
    font: "Inter",
    gradient: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
    preview: {
      bg: "#0f2027",
      buttonBg: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
      buttonText: "#ffffff",
    }
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    backgroundColor: "#1a1a1a",
    buttonStyle: "rounded",
    font: "Poppins",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    preview: {
      bg: "#1a1a1a",
      buttonBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      buttonText: "#ffffff",
    }
  },
  {
    id: "forest-green",
    name: "Forest Green",
    backgroundColor: "#0d1b2a",
    buttonStyle: "rounded",
    font: "Roboto",
    gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    preview: {
      bg: "#0d1b2a",
      buttonBg: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
      buttonText: "#ffffff",
    }
  }
] as const;

export const DEFAULT_THEME = AVAILABLE_THEMES[0];

// Default Avatar
export const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=";
