import { Flex, Text, Heading, Avatar, Box } from "@radix-ui/themes";
import { DEFAULT_AVATAR } from "../config/constants";
import type { Theme } from "../types/profile";

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: Theme;
}

export function ProfileHeader({ username, displayName, bio, avatarUrl, theme }: ProfileHeaderProps) {
  return (
    <Flex direction="column" align="center" gap="4" style={{ textAlign: "center" }}>
      {/* Avatar */}
      <Box style={{ position: "relative" }}>
        <Avatar
          size="8"
          src={avatarUrl || `${DEFAULT_AVATAR}${username}`}
          fallback={username[0]?.toUpperCase() || "?"}
          style={{
            width: "120px",
            height: "120px",
            border: "4px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        />
      </Box>

      {/* Display Name */}
      <Heading 
        size="7" 
        style={{
          fontFamily: theme.font || "Inter",
          color: "white",
        }}
      >
        {displayName}
      </Heading>

      {/* Username */}
      <Text 
        size="3" 
        style={{ 
          color: "rgba(255, 255, 255, 0.7)",
          fontFamily: theme.font || "Inter",
        }}
      >
        @{username}
      </Text>

      {/* Bio */}
      {bio && (
        <Text 
          size="3" 
          style={{ 
            color: "rgba(255, 255, 255, 0.85)",
            maxWidth: "500px",
            lineHeight: "1.6",
            fontFamily: theme.font || "Inter",
          }}
        >
          {bio}
        </Text>
      )}
    </Flex>
  );
}
