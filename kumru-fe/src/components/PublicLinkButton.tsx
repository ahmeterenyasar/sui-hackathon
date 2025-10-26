import { Flex, Text, Box } from "@radix-ui/themes";
import { ExternalLink } from "lucide-react";
import type { Link, Theme } from "../types/profile";

interface PublicLinkButtonProps {
  link: Link;
  theme: Theme;
  onClick: () => void;
}

export function PublicLinkButton({ link, theme, onClick }: PublicLinkButtonProps) {
  const getBorderRadius = () => {
    switch (theme.buttonStyle) {
      case "rounded":
        return "12px";
      case "square":
        return "4px";
      case "pill":
        return "50px";
      default:
        return "12px";
    }
  };

  return (
    <Box
      onClick={onClick}
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "16px 24px",
        borderRadius: getBorderRadius(),
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontFamily: theme.font || "Inter",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Flex gap="3" align="center" justify="between">
        <Flex gap="3" align="center" style={{ flex: 1 }}>
          {/* Icon */}
          <Text style={{ fontSize: "24px" }}>
            {link.icon || "🔗"}
          </Text>

          {/* Content */}
          <Flex direction="column" gap="1" align="start">
            <Text size="3" weight="bold" style={{ color: "white" }}>
              {link.title}
            </Text>
            {link.description && (
              <Text size="1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {link.description}
              </Text>
            )}
          </Flex>
        </Flex>

        {/* External Link Icon */}
        <ExternalLink size={18} color="white" style={{ opacity: 0.7 }} />
      </Flex>
    </Box>
  );
}
