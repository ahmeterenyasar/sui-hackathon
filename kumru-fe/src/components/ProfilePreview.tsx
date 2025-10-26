import { Flex, Text, Card, Box, Avatar } from "@radix-ui/themes";
import type { CreateProfileFormData } from "../types/profile";
import { DEFAULT_AVATAR } from "../config/constants";

interface ProfilePreviewProps {
  formData: CreateProfileFormData;
}

export function ProfilePreview({ formData }: ProfilePreviewProps) {
  const { username, displayName, bio, avatarUrl, theme } = formData;

  return (
    <Box>
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold">Live Preview</Text>
        
        <Card
          style={{
            background: theme.backgroundColor || "#1a1a2e",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "32px",
            borderRadius: "24px",
            minHeight: "400px",
          }}
        >
          <Flex direction="column" align="center" gap="4" style={{ textAlign: "center" }}>
            {/* Avatar */}
            <Avatar
              size="6"
              src={avatarUrl || `${DEFAULT_AVATAR}${username || 'guest'}`}
              fallback={username?.[0]?.toUpperCase() || "?"}
              style={{
                width: "100px",
                height: "100px",
                border: "3px solid rgba(255, 255, 255, 0.2)",
              }}
            />

            {/* Display Name */}
            <Box>
              <Text 
                size="6" 
                weight="bold"
                style={{
                  fontFamily: theme.font || "Inter",
                  color: "white",
                }}
              >
                {displayName || "Your Name"}
              </Text>
            </Box>

            {/* Username */}
            {username && (
              <Text 
                size="2" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: theme.font || "Inter",
                }}
              >
                @{username}
              </Text>
            )}

            {/* Bio */}
            {bio && (
              <Text 
                size="2" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth: "300px",
                  fontFamily: theme.font || "Inter",
                  lineHeight: "1.5",
                }}
              >
                {bio}
              </Text>
            )}

            {/* Sample Links */}
            <Flex direction="column" gap="2" style={{ width: "100%", maxWidth: "300px", marginTop: "16px" }}>
              <Box
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "14px 24px",
                  borderRadius: theme.buttonStyle === "rounded" ? "12px" : "6px",
                  color: "white",
                  fontFamily: theme.font || "Inter",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Sample Link 1
              </Box>
              
              <Box
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "14px 24px",
                  borderRadius: theme.buttonStyle === "rounded" ? "12px" : "6px",
                  color: "white",
                  fontFamily: theme.font || "Inter",
                  fontWeight: "500",
                  textAlign: "center",
                  opacity: 0.7,
                }}
              >
                Sample Link 2
              </Box>
            </Flex>

            {/* Blockchain Badge */}
            <Flex 
              gap="2" 
              align="center" 
              style={{ 
                marginTop: "24px",
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
              }}
            >
              <Box 
                style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  background: "#48bb78",
                  animation: "pulse 2s infinite",
                }}
              />
              <Text size="1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                On-Chain Profile
              </Text>
            </Flex>
          </Flex>
        </Card>

        <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)", textAlign: "center" }}>
          This is how your profile will look to visitors
        </Text>
      </Flex>
    </Box>
  );
}
