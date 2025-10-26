import { Button, Flex, Text } from "@radix-ui/themes";
import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  username: string;
}

export function ShareButton({ username }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/${username}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      size="2"
      variant="soft"
      onClick={handleShare}
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        cursor: "pointer",
      }}
    >
      <Flex gap="2" align="center">
        {copied ? <Check size={16} /> : <Share2 size={16} />}
        <Text size="2">
          {copied ? "Copied!" : "Share Profile"}
        </Text>
      </Flex>
    </Button>
  );
}
