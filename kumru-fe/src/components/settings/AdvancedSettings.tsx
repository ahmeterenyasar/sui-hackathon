import { Flex, Text, Box, Button, Code } from "@radix-ui/themes";
import { Copy, Check, ExternalLink, Calendar, Send, Trash2 } from "lucide-react";
import { useState } from "react";

interface AdvancedSettingsProps {
  username: string;
  createdAt: number;
  updatedAt: number;
  onTransfer?: () => void;
  onDelete?: () => void;
}

export function AdvancedSettings({ username, createdAt, updatedAt, onTransfer, onDelete }: AdvancedSettingsProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Flex direction="column" gap="6">
      {/* Public Profile URL */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Public Profile URL</Text>
          <Flex gap="2">
            <Code
              size="3"
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profileUrl}
            </Code>
            <Button
              size="3"
              variant="soft"
              onClick={handleCopy}
              style={{ cursor: "pointer" }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
            <a href={`/${username}`} target="_blank" rel="noopener noreferrer">
              <Button size="3" variant="soft" style={{ cursor: "pointer" }}>
                <ExternalLink size={16} />
              </Button>
            </a>
          </Flex>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Share this URL to direct people to your profile
          </Text>
        </Flex>
      </Box>

      {/* Profile Statistics */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Profile Statistics</Text>
          
          <Flex
            gap="4"
            style={{
              padding: "20px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
            }}
          >
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Flex align="center" gap="2">
                <Calendar size={16} color="rgba(255, 255, 255, 0.6)" />
                <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Created
                </Text>
              </Flex>
              <Text size="2" weight="bold">
                {formatDate(createdAt)}
              </Text>
            </Flex>

            <Box style={{ width: "1px", background: "rgba(255, 255, 255, 0.1)" }} />

            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Flex align="center" gap="2">
                <Calendar size={16} color="rgba(255, 255, 255, 0.6)" />
                <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Last Updated
                </Text>
              </Flex>
              <Text size="2" weight="bold">
                {formatDate(updatedAt)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Advanced Actions */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Advanced Actions</Text>
          
          <Flex direction="column" gap="2">
            {/* Transfer Profile */}
            <Box
              style={{
                padding: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Flex justify="between" align="center">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">Transfer Profile NFT</Text>
                  <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Transfer ownership of your profile to another wallet
                  </Text>
                </Flex>
                <Button
                  size="2"
                  variant="soft"
                  onClick={onTransfer}
                  style={{ cursor: "pointer" }}
                >
                  <Send size={16} />
                  Transfer
                </Button>
              </Flex>
            </Box>

            {/* Delete Profile */}
            <Box
              style={{
                padding: "16px",
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
              }}
            >
              <Flex justify="between" align="center">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold" style={{ color: "#ef4444" }}>
                    Delete Profile
                  </Text>
                  <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Permanently delete your profile and burn the NFT
                  </Text>
                </Flex>
                <Button
                  size="2"
                  variant="soft"
                  color="red"
                  onClick={onDelete}
                  style={{ cursor: "pointer" }}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Info */}
      <Box
        style={{
          padding: "16px",
          background: "rgba(102, 126, 234, 0.1)",
          border: "1px solid rgba(102, 126, 234, 0.2)",
          borderRadius: "8px",
        }}
      >
        <Text size="1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          💡 Your profile is stored as an NFT on the Sui blockchain. You have complete ownership and control.
        </Text>
      </Box>
    </Flex>
  );
}
