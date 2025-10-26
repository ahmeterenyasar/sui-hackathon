import { Dialog, Flex, Text, Button, TextField } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteProfileDialog({ open, onOpenChange, onConfirm, isDeleting }: DeleteProfileDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setConfirmText("");
    setStep(1);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (confirmText === "DELETE") {
        onConfirm();
        handleClose();
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => {
      if (!open) handleClose();
      else onOpenChange(open);
    }}>
      <Dialog.Content
        style={{
          maxWidth: "450px",
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        <Flex direction="column" gap="5">
          {/* Warning Icon */}
          <Flex justify="center">
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={32} color="#ef4444" />
            </div>
          </Flex>

          {/* Title */}
          <Dialog.Title style={{ textAlign: "center", fontSize: "24px", color: "#ef4444" }}>
            {step === 1 ? "Delete Profile?" : "Final Confirmation"}
          </Dialog.Title>

          {/* Description */}
          <Dialog.Description style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
            {step === 1 ? (
              <>
                Are you sure you want to <strong>permanently delete</strong> your profile?
                <br /><br />
                This action <strong>CANNOT be undone</strong> and will burn the NFT.
              </>
            ) : (
              <>
                Type <strong style={{ color: "#ef4444" }}>DELETE</strong> below to confirm permanent deletion.
              </>
            )}
          </Dialog.Description>

          {/* Step 2: Confirmation Input */}
          {step === 2 && (
            <Flex direction="column" gap="2">
              <TextField.Root
                size="3"
                placeholder="Type DELETE to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              />
              <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                This is irreversible. Your profile NFT will be burned.
              </Text>
            </Flex>
          )}

          {/* Actions */}
          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button
                size="3"
                variant="soft"
                color="gray"
                onClick={handleClose}
                disabled={isDeleting}
                style={{ cursor: "pointer" }}
              >
                Cancel
              </Button>
            </Dialog.Close>
            
            <Button
              size="3"
              color="red"
              onClick={handleConfirm}
              disabled={step === 2 && confirmText !== "DELETE" || isDeleting}
              style={{
                cursor: step === 2 && confirmText !== "DELETE" ? "not-allowed" : "pointer",
                opacity: step === 2 && confirmText !== "DELETE" ? 0.5 : 1,
              }}
            >
              {isDeleting ? "Deleting..." : step === 1 ? "Continue" : "Delete Forever"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
