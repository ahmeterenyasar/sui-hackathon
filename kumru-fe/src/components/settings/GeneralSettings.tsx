import { Flex, Text, TextField, TextArea, Box, Button, Avatar } from "@radix-ui/themes";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { MAX_DISPLAY_NAME_LENGTH, MAX_BIO_LENGTH } from "../../config/constants";

interface GeneralSettingsProps {
  initialData: {
    displayName: string;
    bio: string;
    avatarUrl: string;
  };
  onSave: (data: { displayName: string; bio: string; avatarUrl: string }) => void;
  isSaving?: boolean;
}

export function GeneralSettings({ initialData, onSave, isSaving }: GeneralSettingsProps) {
  const [formData, setFormData] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData(initialData);
    setHasChanges(false);
  };

  return (
    <Flex direction="column" gap="5">
      {/* Display Name */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Text size="2" weight="bold">Display Name *</Text>
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              ({formData.displayName.length}/{MAX_DISPLAY_NAME_LENGTH})
            </Text>
          </Flex>
          <TextField.Root
            size="3"
            placeholder="John Doe"
            value={formData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            maxLength={MAX_DISPLAY_NAME_LENGTH}
          />
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Your public display name
          </Text>
        </Flex>
      </Box>

      {/* Bio */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Text size="2" weight="bold">Bio</Text>
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              ({formData.bio.length}/{MAX_BIO_LENGTH})
            </Text>
          </Flex>
          <TextArea
            size="3"
            placeholder="Tell the world about yourself..."
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            maxLength={MAX_BIO_LENGTH}
            rows={4}
          />
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            A short description about you
          </Text>
        </Flex>
      </Box>

      {/* Avatar URL */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Profile Picture</Text>
          
          {/* Avatar Preview & Input */}
          <Flex gap="4" align="start">
            {/* Avatar Preview */}
            <Box
              style={{
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Avatar
                size="6"
                src={formData.avatarUrl}
                fallback={formData.displayName?.[0]?.toUpperCase() || "?"}
                radius="full"
                style={{
                  width: "96px",
                  height: "96px",
                  border: "3px solid rgba(102, 126, 234, 0.3)",
                  background: "rgba(102, 126, 234, 0.1)",
                }}
              />
              <Box
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid rgba(0, 0, 0, 0.8)",
                }}
              >
                <ImageIcon size={16} color="white" />
              </Box>
            </Box>

            {/* Input Section */}
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <TextField.Root
                size="3"
                placeholder="https://example.com/avatar.png"
                value={formData.avatarUrl}
                onChange={(e) => handleChange("avatarUrl", e.target.value)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
              <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)", lineHeight: "1.5" }}>
                Enter a direct link to your profile picture (jpg, png, gif)
              </Text>
              
              {/* Suggested Services */}
              <Box
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  background: "rgba(102, 126, 234, 0.05)",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: "8px",
                }}
              >
                <Text size="1" weight="bold" style={{ color: "rgba(255, 255, 255, 0.8)", display: "block", marginBottom: "6px" }}>
                  💡 Suggested Avatar Services:
                </Text>
                <Flex direction="column" gap="1">
                  <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    • <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer" style={{ color: "#a5b4fc", textDecoration: "none" }}>Gravatar</a> - Email-based avatars
                  </Text>
                  <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    • <a href="https://dicebear.com" target="_blank" rel="noopener noreferrer" style={{ color: "#a5b4fc", textDecoration: "none" }}>DiceBear</a> - Generated avatars
                  </Text>
                  <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    • <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" style={{ color: "#a5b4fc", textDecoration: "none" }}>Imgur</a> - Free image hosting
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Actions */}
      {hasChanges && (
        <Flex gap="3" mt="2">
          <Button
            size="3"
            onClick={handleSave}
            disabled={isSaving || !formData.displayName.trim()}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              cursor: isSaving ? "wait" : "pointer",
              flex: 1,
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            size="3"
            variant="soft"
            color="gray"
            onClick={handleReset}
            disabled={isSaving}
            style={{ cursor: "pointer" }}
          >
            Reset
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
