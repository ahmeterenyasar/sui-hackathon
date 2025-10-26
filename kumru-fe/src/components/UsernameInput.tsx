import { TextField, Text, Flex, Box } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { MAX_USERNAME_LENGTH } from "../config/constants";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function UsernameInput({ value, onChange, onValidationChange }: UsernameInputProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Reset validation when value changes
    setError("");
    setIsAvailable(null);

    // Basic validation
    if (!value) {
      onValidationChange(false);
      return;
    }

    if (value.length > MAX_USERNAME_LENGTH) {
      setError(`Username must be ${MAX_USERNAME_LENGTH} characters or less`);
      onValidationChange(false);
      return;
    }

    // Username format validation (alphanumeric + underscore)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) {
      setError("Username can only contain letters, numbers, and underscores");
      onValidationChange(false);
      return;
    }

    // Simulate blockchain check (TODO: Replace with actual contract call)
    const checkUsername = async () => {
      setIsChecking(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with actual blockchain query
      // const isAvailable = await checkUsernameAvailability(value);
      
      // For now, simulate random availability
      const available = Math.random() > 0.3;
      
      setIsAvailable(available);
      setIsChecking(false);
      
      if (!available) {
        setError("Username already taken");
        onValidationChange(false);
      } else {
        onValidationChange(true);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [value, onValidationChange]);

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 size={16} className="animate-spin" color="#667eea" />;
    }
    if (error) {
      return <X size={16} color="#e53e3e" />;
    }
    if (isAvailable) {
      return <Check size={16} color="#48bb78" />;
    }
    return null;
  };

  const getStatusColor = () => {
    if (error) return "#e53e3e";
    if (isAvailable) return "#48bb78";
    return "rgba(255, 255, 255, 0.6)";
  };

  return (
    <Box>
      <Flex direction="column" gap="2">
        <Flex align="center" gap="2">
          <Text size="2" weight="bold">Username *</Text>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            ({value.length}/{MAX_USERNAME_LENGTH})
          </Text>
        </Flex>
        
        <Box style={{ position: "relative" }}>
          <TextField.Root
            size="3"
            placeholder="yourname"
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            style={{
              paddingRight: "40px",
              borderColor: getStatusColor(),
            }}
          />
          <Box
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {getStatusIcon()}
          </Box>
        </Box>

        {error && (
          <Text size="1" style={{ color: "#e53e3e" }}>
            {error}
          </Text>
        )}
        
        {isAvailable && !error && (
          <Text size="1" style={{ color: "#48bb78" }}>
            ✓ Username available!
          </Text>
        )}

        <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Your unique identifier on-chain. Letters, numbers, and underscores only.
        </Text>
      </Flex>
    </Box>
  );
}
