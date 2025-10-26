import { Flex, Text, Card, Box, Grid } from "@radix-ui/themes";
import { Check } from "lucide-react";
import { AVAILABLE_THEMES } from "../config/constants";
import type { Theme } from "../types/profile";

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <Box>
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold">Choose Your Theme</Text>
        
        <Grid columns={{ initial: "1", sm: "2" }} gap="3">
          {AVAILABLE_THEMES.map((theme) => {
            const isSelected = selectedTheme.backgroundColor === theme.backgroundColor;
            
            return (
              <Card
                key={theme.id}
                onClick={() => onThemeChange({
                  backgroundColor: theme.backgroundColor,
                  buttonStyle: theme.buttonStyle,
                  font: theme.font,
                })}
                style={{
                  cursor: "pointer",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  border: isSelected 
                    ? "2px solid #667eea" 
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "16px",
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
              >
                {isSelected && (
                  <Box
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#667eea",
                      borderRadius: "50%",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={14} color="white" />
                  </Box>
                )}

                <Flex direction="column" gap="3">
                  <Text size="2" weight="bold">{theme.name}</Text>
                  
                  {/* Theme Preview */}
                  <Box
                    style={{
                      background: theme.preview.bg,
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Flex direction="column" gap="2" align="center">
                      {/* Avatar placeholder */}
                      <Box
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                      
                      {/* Sample text */}
                      <Text 
                        size="1" 
                        style={{ 
                          color: "white",
                          fontFamily: theme.font,
                        }}
                      >
                        @username
                      </Text>

                      {/* Sample button */}
                      <Box
                        style={{
                          background: theme.preview.buttonBg,
                          color: theme.preview.buttonText,
                          padding: "8px 16px",
                          borderRadius: theme.buttonStyle === "rounded" ? "8px" : "4px",
                          fontSize: "11px",
                          fontFamily: theme.font,
                          fontWeight: "500",
                        }}
                      >
                        Sample Link
                      </Box>
                    </Flex>
                  </Box>

                  {/* Font info */}
                  <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Font: {theme.font}
                  </Text>
                </Flex>
              </Card>
            );
          })}
        </Grid>

        <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          You can customize your theme further after creating your profile.
        </Text>
      </Flex>
    </Box>
  );
}
