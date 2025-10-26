import { Flex, Text, Box, Button, RadioGroup, Select } from "@radix-ui/themes";
import { useState } from "react";
import type { Theme } from "../../types/profile";

interface ThemeSettingsProps {
  initialData: Theme;
  onSave: (data: Theme) => void;
  isSaving?: boolean;
}

const FONTS = ["Inter", "Roboto", "Poppins", "Monospace"];

export function ThemeSettings({ initialData, onSave, isSaving }: ThemeSettingsProps) {
  const [formData, setFormData] = useState<Theme>(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof Theme, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData(initialData);
    setHasChanges(false);
  };

  return (
    <Flex direction="column" gap="5">
      {/* Background Color */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Background Color</Text>
          <Flex gap="3" align="center">
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              style={{
                width: "60px",
                height: "40px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                cursor: "pointer",
                background: "transparent",
              }}
            />
            <Text size="2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              {formData.backgroundColor}
            </Text>
          </Flex>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Background color for your public profile
          </Text>
        </Flex>
      </Box>

      {/* Button Style */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Button Style</Text>
          <RadioGroup.Root
            value={formData.buttonStyle}
            onValueChange={(value) => handleChange("buttonStyle", value)}
          >
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <RadioGroup.Item value="rounded" />
                <Flex direction="column">
                  <Text size="2">Rounded</Text>
                  <Box
                    style={{
                      marginTop: "4px",
                      width: "120px",
                      height: "32px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    Sample
                  </Box>
                </Flex>
              </Flex>

              <Flex align="center" gap="2">
                <RadioGroup.Item value="square" />
                <Flex direction="column">
                  <Text size="2">Square</Text>
                  <Box
                    style={{
                      marginTop: "4px",
                      width: "120px",
                      height: "32px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    Sample
                  </Box>
                </Flex>
              </Flex>

              <Flex align="center" gap="2">
                <RadioGroup.Item value="pill" />
                <Flex direction="column">
                  <Text size="2">Pill</Text>
                  <Box
                    style={{
                      marginTop: "4px",
                      width: "120px",
                      height: "32px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    Sample
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </RadioGroup.Root>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Choose the style for your link buttons
          </Text>
        </Flex>
      </Box>

      {/* Font */}
      <Box>
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Font Family</Text>
          <Select.Root
            value={formData.font}
            onValueChange={(value) => handleChange("font", value)}
          >
            <Select.Trigger style={{ width: "200px" }} />
            <Select.Content>
              {FONTS.map((font) => (
                <Select.Item key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Font for your profile text
          </Text>
        </Flex>
      </Box>

      {/* Preview */}
      <Box>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">Preview</Text>
          <Box
            style={{
              background: formData.backgroundColor,
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Flex direction="column" gap="3" align="center">
              <Text
                size="4"
                weight="bold"
                style={{
                  fontFamily: formData.font,
                  color: "white",
                }}
              >
                Your Profile Name
              </Text>
              <Box
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "12px 20px",
                  borderRadius: formData.buttonStyle === "rounded" ? "12px" : formData.buttonStyle === "square" ? "4px" : "50px",
                  color: "white",
                  fontFamily: formData.font,
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Sample Link Button
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Actions */}
      {hasChanges && (
        <Flex gap="3" mt="2">
          <Button
            size="3"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              cursor: isSaving ? "wait" : "pointer",
              flex: 1,
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            size="3"
            variant="soft"
            color="gray"
            onClick={handleReset}
            disabled={isSaving}
            style={{ cursor: "pointer" }}
          >
            Reset
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
