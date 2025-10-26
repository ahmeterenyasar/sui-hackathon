import { Flex, Text, Box } from "@radix-ui/themes";

export function OnChainBadge() {
  return (
    <Flex 
      gap="2" 
      align="center" 
      style={{ 
        padding: "8px 16px",
        background: "rgba(102, 126, 234, 0.2)",
        borderRadius: "20px",
        border: "1px solid rgba(102, 126, 234, 0.3)",
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
      <Text size="1" weight="medium" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
        Verified On-Chain Profile
      </Text>
    </Flex>
  );
}
