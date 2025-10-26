import { Select, Flex, Text } from "@radix-ui/themes";
import { ArrowDownAZ, Clock, TrendingUp } from "lucide-react";

export type SortOption = "recent" | "popular" | "alphabetical";

interface ExploreFiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function ExploreFilters({ sortBy, onSortChange }: ExploreFiltersProps) {
  return (
    <Flex align="center" gap="3">
      <Text size="2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
        Sort by:
      </Text>
      <Select.Root
        value={sortBy}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <Select.Trigger
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            minWidth: "180px",
          }}
        />
        <Select.Content
          style={{
            background: "rgba(26, 26, 46, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Select.Item
            value="recent"
            style={{
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            <Flex align="center" gap="2">
              <Clock size={14} />
              Recently Created
            </Flex>
          </Select.Item>
          <Select.Item
            value="popular"
            style={{
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            <Flex align="center" gap="2">
              <TrendingUp size={14} />
              Most Popular
            </Flex>
          </Select.Item>
          <Select.Item
            value="alphabetical"
            style={{
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            <Flex align="center" gap="2">
              <ArrowDownAZ size={14} />
              A-Z
            </Flex>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
