import { Flex, Text, TextField, Box, Button } from "@radix-ui/themes";
import { useState } from "react";
import { Twitter, Github, MessageCircle, Send, Globe } from "lucide-react";
import type { SocialLinks } from "../../types/profile";

interface SocialSettingsProps {
  initialData: SocialLinks;
  onSave: (data: SocialLinks) => void;
  isSaving?: boolean;
}

export function SocialSettings({ initialData, onSave, isSaving }: SocialSettingsProps) {
  const [formData, setFormData] = useState<SocialLinks>(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof SocialLinks, value: string) => {
    setFormData({ ...formData, [field]: value || undefined });
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
      {/* Twitter */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Twitter size={16} color="#1DA1F2" />
            <Text size="2" weight="bold">Twitter / X</Text>
          </Flex>
          <TextField.Root
            size="3"
            placeholder="username"
            value={formData.twitter || ""}
            onChange={(e) => handleChange("twitter", e.target.value)}
          >
            <TextField.Slot>@</TextField.Slot>
          </TextField.Root>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Your Twitter/X username without @
          </Text>
        </Flex>
      </Box>

      {/* Discord */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <MessageCircle size={16} color="#5865F2" />
            <Text size="2" weight="bold">Discord</Text>
          </Flex>
          <TextField.Root
            size="3"
            placeholder="username#1234"
            value={formData.discord || ""}
            onChange={(e) => handleChange("discord", e.target.value)}
          />
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Your Discord username with discriminator
          </Text>
        </Flex>
      </Box>

      {/* Telegram */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Send size={16} color="#0088cc" />
            <Text size="2" weight="bold">Telegram</Text>
          </Flex>
          <TextField.Root
            size="3"
            placeholder="username"
            value={formData.telegram || ""}
            onChange={(e) => handleChange("telegram", e.target.value)}
          >
            <TextField.Slot>@</TextField.Slot>
          </TextField.Root>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Your Telegram username without @
          </Text>
        </Flex>
      </Box>

      {/* GitHub */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Github size={16} color="#ffffff" />
            <Text size="2" weight="bold">GitHub</Text>
          </Flex>
          <TextField.Root
            size="3"
            placeholder="username"
            value={formData.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
          >
            <TextField.Slot>@</TextField.Slot>
          </TextField.Root>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Your GitHub username
          </Text>
        </Flex>
      </Box>

      {/* Website */}
      <Box>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Globe size={16} color="#667eea" />
            <Text size="2" weight="bold">Website</Text>
          </Flex>
          <TextField.Root
            size="3"
            placeholder="https://yourwebsite.com"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            type="url"
          />
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Your personal website or portfolio URL
          </Text>
        </Flex>
      </Box>

      {/* Actions */}
      {hasChanges && (
        <Flex gap="3" mt="2">
          <Button
            size="3"
            onClick={handleSave}
            disabled={isSaving}
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
