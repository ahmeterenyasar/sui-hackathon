import { Flex, Box } from "@radix-ui/themes";
import { Twitter, Github, Globe, MessageCircle, Send } from "lucide-react";
import type { SocialLinks } from "../types/profile";

interface SocialLinksBarProps {
  socialLinks: SocialLinks;
}

const SOCIAL_ICONS = {
  twitter: Twitter,
  github: Github,
  website: Globe,
  discord: MessageCircle,
  telegram: Send,
};

export function SocialLinksBar({ socialLinks }: SocialLinksBarProps) {
  const activeSocials = Object.entries(socialLinks).filter(([_, value]) => value);

  if (activeSocials.length === 0) return null;

  return (
    <Flex gap="3" justify="center" align="center">
      {activeSocials.map(([platform, url]) => {
        const Icon = SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS];
        if (!Icon || !url) return null;

        const socialUrl = platform === 'twitter' 
          ? `https://twitter.com/${url}` 
          : platform === 'github'
          ? `https://github.com/${url}`
          : platform === 'telegram'
          ? `https://t.me/${url}`
          : url;

        return (
          <a
            key={platform}
            href={socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Box
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Icon size={18} color="white" />
            </Box>
          </a>
        );
      })}
    </Flex>
  );
}
