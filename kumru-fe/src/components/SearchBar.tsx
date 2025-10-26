import { TextField } from "@radix-ui/themes";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search profiles..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <TextField.Root
      size="3"
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#ffffff",
        fontSize: "16px",
      }}
    >
      <TextField.Slot>
        <Search size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
      </TextField.Slot>
    </TextField.Root>
  );
}
