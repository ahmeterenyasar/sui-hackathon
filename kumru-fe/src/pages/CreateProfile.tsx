import { Container, Flex, Heading, Text, TextField, TextArea, Button, Card, Box, Grid } from "@radix-ui/themes";
import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Navigate, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { UsernameInput } from "../components/UsernameInput";
import { ThemeSelector } from "../components/ThemeSelector";
import { ProfilePreview } from "../components/ProfilePreview";
import { DEFAULT_THEME, MAX_DISPLAY_NAME_LENGTH, MAX_BIO_LENGTH } from "../config/constants";
import { buildCreateProfileTx } from "../utils/sui";
import type { CreateProfileFormData } from "../types/profile";

export function CreateProfile() {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState<CreateProfileFormData>({
    username: "",
    displayName: "",
    bio: "",
    avatarUrl: "",
    theme: {
      backgroundColor: DEFAULT_THEME.backgroundColor,
      buttonStyle: DEFAULT_THEME.buttonStyle,
      font: DEFAULT_THEME.font,
    },
  });

  const [usernameValid, setUsernameValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to home page if wallet is not connected
  if (!account) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameValid) {
      toast.error("Please choose a valid username");
      return;
    }

    setIsSubmitting(true);

    try {
      // Move contract call
      const tx = buildCreateProfileTx(
        formData.username,
        formData.displayName,
        formData.bio,
        formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
      );

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            toast.success("Profile created successfully! Redirecting to dashboard...");
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          },
          onError: (error) => {
            console.error("❌ Error creating profile:", error);
            toast.error("Failed to create profile. Please try again.");
            setIsSubmitting(false);
          },
        }
      );

    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isFormValid = usernameValid && formData.displayName.length > 0;

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <Flex direction="column" gap="6" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <Flex align="center" gap="4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          
          <Box>
            <Heading size="8" mb="1">
              Create Your Profile
            </Heading>
            <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Your profile will be minted as an NFT on Sui blockchain
            </Text>
          </Box>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            {/* Left Side - Form */}
            <Flex direction="column" gap="5">
              <Card
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "32px",
                  borderRadius: "24px",
                }}
              >
                <Flex direction="column" gap="5">
                  {/* Username */}
                  <UsernameInput
                    value={formData.username}
                    onChange={(value) => setFormData({ ...formData, username: value })}
                    onValidationChange={setUsernameValid}
                  />

                  {/* Display Name */}
                  <Box>
                    <Flex direction="column" gap="2">
                      <Flex align="center" gap="2">
                        <Text size="2" weight="bold">Display Name *</Text>
                        <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          ({formData.displayName.length}/{MAX_DISPLAY_NAME_LENGTH})
                        </Text>
                      </Flex>
                      <TextField.Root
                        size="3"
                        placeholder="John Doe"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        maxLength={MAX_DISPLAY_NAME_LENGTH}
                      />
                      <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Your public display name (can include emojis)
                      </Text>
                    </Flex>
                  </Box>

                  {/* Bio */}
                  <Box>
                    <Flex direction="column" gap="2">
                      <Flex align="center" gap="2">
                        <Text size="2" weight="bold">Bio</Text>
                        <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          ({formData.bio.length}/{MAX_BIO_LENGTH})
                        </Text>
                      </Flex>
                      <TextArea
                        size="3"
                        placeholder="Tell the world about yourself..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        maxLength={MAX_BIO_LENGTH}
                        rows={4}
                      />
                      <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        A short description about you
                      </Text>
                    </Flex>
                  </Box>

                  {/* Avatar URL */}
                  <Box>
                    <Flex direction="column" gap="2">
                      <Text size="2" weight="bold">Avatar URL</Text>
                      <TextField.Root
                        size="3"
                        placeholder="https://example.com/avatar.png"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      />
                      <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Leave empty for a generated avatar based on your username
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              </Card>

              {/* Theme Selection */}
              <Card
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "32px",
                  borderRadius: "24px",
                }}
              >
                <ThemeSelector
                  selectedTheme={formData.theme}
                  onThemeChange={(theme) => setFormData({ ...formData, theme })}
                />
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                size="4"
                disabled={!isFormValid || isSubmitting}
                style={{
                  background: isFormValid 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "rgba(255, 255, 255, 0.1)",
                  cursor: isFormValid ? "pointer" : "not-allowed",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                <Sparkles size={20} />
                {isSubmitting ? "Creating Profile..." : "Create Profile"}
              </Button>
            </Flex>

            {/* Right Side - Preview */}
            <Box style={{ position: "sticky", top: "100px", height: "fit-content" }}>
              <ProfilePreview formData={formData} />
            </Box>
          </Grid>
        </form>
      </Flex>
    </Container>
  );
}
