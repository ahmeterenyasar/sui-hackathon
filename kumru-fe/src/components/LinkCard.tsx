import { Card, Flex, Text, Button, Box, Switch } from "@radix-ui/themes";
import { GripVertical, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Link } from "../types/profile";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (linkId: number) => void;
  onToggleVisibility: (linkId: number, isVisible: boolean) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function LinkCard({ link, onEdit, onDelete, onToggleVisibility, isDragging, dragHandleProps }: LinkCardProps) {
  return (
    <Card
      style={{
        background: isDragging ? "rgba(102, 126, 234, 0.2)" : "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "20px",
        transition: "all 0.2s ease",
        opacity: link.isVisible ? 1 : 0.5,
      }}
    >
      <Flex gap="3" align="center">
        {/* Drag Handle */}
        <Box 
          {...dragHandleProps}
          style={{ cursor: "grab", color: "rgba(255, 255, 255, 0.4)" }}
        >
          <GripVertical size={20} />
        </Box>

        {/* Icon */}
        <Box
          style={{
            fontSize: "24px",
            minWidth: "40px",
            textAlign: "center",
          }}
        >
          {link.icon || "🔗"}
        </Box>

        {/* Content */}
        <Flex direction="column" gap="1" style={{ flex: 1 }}>
          <Text size="3" weight="bold">
            {link.title}
          </Text>
          <Flex gap="2" align="center">
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              {link.url}
            </Text>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea" }}>
              <ExternalLink size={12} />
            </a>
          </Flex>
          {link.description && (
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              {link.description}
            </Text>
          )}
        </Flex>

        {/* Actions */}
        <Flex gap="2" align="center">
          {/* Visibility Toggle */}
          <Flex align="center" gap="2">
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              {link.isVisible ? "Visible" : "Hidden"}
            </Text>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={link.isVisible}
                onCheckedChange={(checked) => onToggleVisibility(link.id, checked)}
              />
            </div>
          </Flex>

          {/* Edit Button */}
          <Button
            size="2"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(link);
            }}
            style={{ cursor: "pointer" }}
          >
            <Pencil size={14} />
          </Button>

          {/* Delete Button */}
          <Button
            size="2"
            variant="soft"
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <Trash2 size={14} />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
