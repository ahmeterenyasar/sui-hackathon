import { Dialog, Flex, Text, TextField, TextArea, Button, Box } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { Plus, Save } from "lucide-react";
import type { Link } from "../types/profile";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (linkData: Omit<Link, "id" | "position">) => void;
  editingLink?: Link | null;
}

const EMOJI_OPTIONS = ["🔗", "📱", "💻", "🎮", "🎨", "📸", "🎵", "📝", "🌐", "💼", "🎓", "⚡", "🔥", "✨", "🎯", "🚀"];

export function LinkDialog({ open, onOpenChange, onSave, editingLink }: LinkDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    icon: "🔗",
    isVisible: true,
  });

  useEffect(() => {
    if (editingLink) {
      setFormData({
        title: editingLink.title,
        url: editingLink.url,
        description: editingLink.description || "",
        icon: editingLink.icon,
        isVisible: editingLink.isVisible,
      });
    } else {
      setFormData({
        title: "",
        url: "",
        description: "",
        icon: "🔗",
        isVisible: true,
      });
    }
  }, [editingLink, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const isValid = formData.title.trim() && formData.url.trim();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          maxWidth: "500px",
        }}
      >
        <Dialog.Title>
          {editingLink ? "Edit Link" : "Add New Link"}
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4" mt="4">
            {/* Icon Selector */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                Icon
              </Text>
              <Flex gap="2" wrap="wrap">
                {EMOJI_OPTIONS.map((emoji) => (
                  <Box
                    key={emoji}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    style={{
                      fontSize: "24px",
                      padding: "8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: formData.icon === emoji 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "rgba(255, 255, 255, 0.05)",
                      border: formData.icon === emoji 
                        ? "2px solid #667eea" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {emoji}
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Title */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                Title *
              </Text>
              <TextField.Root
                size="3"
                placeholder="My Awesome Link"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Box>

            {/* URL */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                URL *
              </Text>
              <TextField.Root
                size="3"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                type="url"
              />
            </Box>

            {/* Description */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                Description (Optional)
              </Text>
              <TextArea
                size="3"
                placeholder="A short description about this link"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </Box>

            {/* Actions */}
            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                disabled={!isValid}
                style={{
                  background: isValid 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "rgba(255, 255, 255, 0.1)",
                  cursor: isValid ? "pointer" : "not-allowed",
                }}
              >
                {editingLink ? <Save size={16} /> : <Plus size={16} />}
                {editingLink ? "Save Changes" : "Add Link"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
