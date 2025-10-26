import { Dialog, Flex, TextField, Button, Text } from "@radix-ui/themes";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface TransferProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransfer: (recipientAddress: string) => void;
  isTransferring: boolean;
}

export function TransferProfileDialog({
  open,
  onOpenChange,
  onTransfer,
  isTransferring,
}: TransferProfileDialogProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const isValidSuiAddress = (address: string): boolean => {
    // Sui address: must start with 0x and be 64 hex characters (66 including 0x)
    const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/;
    return suiAddressRegex.test(address);
  };

  const isFormValid = 
    isValidSuiAddress(recipientAddress) && 
    confirmText.toUpperCase() === "TRANSFER";

  const handleTransfer = () => {
    if (isFormValid) {
      onTransfer(recipientAddress);
      // Reset form
      setRecipientAddress("");
      setConfirmText("");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Transfer Profile NFT</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Transfer your profile to a different wallet address. This action cannot be undone.
        </Dialog.Description>

        <Flex direction="column" gap="4">
          {/* Warning */}
          <Flex
            gap="3"
            p="3"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
            }}
          >
            <AlertTriangle size={20} color="#ef4444" />
            <Flex direction="column" gap="1">
              <Text size="2" weight="bold" style={{ color: "#ef4444" }}>
                Warning: Permanent Action
              </Text>
              <Text size="1" style={{ color: "rgba(239, 68, 68, 0.8)" }}>
                Once transferred, you will lose access to this profile. The new owner will have full control.
              </Text>
            </Flex>
          </Flex>

          {/* Recipient Address */}
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">
              Recipient Address *
            </Text>
            <TextField.Root
              size="3"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              disabled={isTransferring}
            />
            {recipientAddress && !isValidSuiAddress(recipientAddress) && (
              <Text size="1" style={{ color: "#ef4444" }}>
                Invalid Sui address. Must start with 0x and be 66 characters long.
              </Text>
            )}
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Enter the Sui wallet address of the new owner
            </Text>
          </Flex>

          {/* Confirmation */}
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">
              Type "TRANSFER" to confirm *
            </Text>
            <TextField.Root
              size="3"
              placeholder="TRANSFER"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isTransferring}
            />
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              This helps prevent accidental transfers
            </Text>
          </Flex>

          {/* Actions */}
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                disabled={isTransferring}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleTransfer}
              disabled={!isFormValid || isTransferring}
              style={{
                background: isFormValid 
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : "rgba(255, 255, 255, 0.1)",
                cursor: isFormValid && !isTransferring ? "pointer" : "not-allowed",
              }}
            >
              {isTransferring ? "Transferring..." : "Transfer Profile"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
