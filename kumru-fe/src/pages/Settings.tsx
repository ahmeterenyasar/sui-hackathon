import { Container, Flex, Heading, Text, Box, Tabs, Card, Button, Spinner } from "@radix-ui/themes";
import { useState } from "react";
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { GeneralSettings } from "../components/settings/GeneralSettings";
import { SocialSettings } from "../components/settings/SocialSettings";
import { ThemeSettings } from "../components/settings/ThemeSettings";
import { AdvancedSettings } from "../components/settings/AdvancedSettings";
import { TransferProfileDialog } from "../components/TransferProfileDialog";
import { DeleteProfileDialog } from "../components/DeleteProfileDialog";
import { parseProfileObject, buildUpdateProfileTx, buildUpdateSocialLinksTx, buildUpdateThemeTx, buildTransferProfileTx, buildDeleteProfileTx } from "../utils/sui";
import type { SocialLinks, Theme } from "../types/profile";

export function Settings() {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Fetch user's profile
  const { data: ownedObjects, isLoading, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: {
        MatchAll: [
          {
            StructType: `${import.meta.env.VITE_PACKAGE_ID}::profile::Profile`,
          },
        ],
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!account?.address,
    }
  );

  const profileData = ownedObjects?.data?.[0]?.data;
  const profile = profileData ? parseProfileObject(profileData) : null;

  // Redirect to home page if wallet is not connected
  if (!account) {
    return <Navigate to="/" replace />;
  }

  // Loading
  if (isLoading) {
    return (
      <Container style={{ paddingTop: "120px", paddingBottom: "60px" }}>
        <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
          <Spinner size="3" />
        </Flex>
      </Container>
    );
  }

  // Profil yoksa Dashboard'a yönlendir
  if (!profile) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSaveGeneral = async (data: { displayName: string; bio: string; avatarUrl: string }) => {
    setIsSaving(true);
    
    try {
      const tx = buildUpdateProfileTx(
        profile.id,
        data.displayName,
        data.bio,
        data.avatarUrl
      );

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("Profile updated successfully!");
            setIsSaving(false);
            // Refresh profile data
            refetch();
          },
          onError: (error) => {
            console.error("❌ Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
            setIsSaving(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setIsSaving(false);
    }
  };

  const handleSaveSocial = async (data: SocialLinks) => {
    setIsSaving(true);
    
    try {
      const tx = buildUpdateSocialLinksTx(
        profile.id,
        data.twitter || "",
        data.discord || "",
        data.telegram || "",
        data.github || "",
        data.website || ""
      );

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("Social links updated successfully!");
            setIsSaving(false);
            refetch();
          },
          onError: (error) => {
            console.error("❌ Error updating social links:", error);
            toast.error("Failed to update social links. Please try again.");
            setIsSaving(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setIsSaving(false);
    }
  };

  const handleSaveTheme = async (data: Theme) => {
    setIsSaving(true);
    
    try {
      const tx = buildUpdateThemeTx(
        profile.id,
        data.backgroundColor,
        data.buttonStyle,
        data.font
      );

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("Theme updated successfully!");
            setIsSaving(false);
            refetch();
          },
          onError: (error) => {
            console.error("❌ Error updating theme:", error);
            toast.error("Failed to update theme. Please try again.");
            setIsSaving(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setIsSaving(false);
    }
  };

  const handleTransfer = async (recipientAddress: string) => {
    setIsTransferring(true);
    
    try {
      const tx = buildTransferProfileTx(profile.id, recipientAddress);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success(`Profile transferred successfully to ${recipientAddress}! You will be redirected to the home page.`);
            setIsTransferring(false);
            setTransferDialogOpen(false);
            // Redirect to home after transfer
            setTimeout(() => {
              navigate("/");
            }, 2000);
          },
          onError: (error) => {
            console.error("❌ Error transferring profile:", error);
            toast.error("Failed to transfer profile. Please try again.");
            setIsTransferring(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setIsTransferring(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const tx = buildDeleteProfileTx(profile.id);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("Profile deleted successfully. Redirecting to home page...");
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          },
          onError: (error) => {
            console.error("❌ Error deleting profile:", error);
            toast.error("Failed to delete profile. Please try again.");
            setIsDeleting(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <Flex direction="column" gap="6" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <Flex justify="between" align="center">
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
                Settings
              </Heading>
              <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Manage your profile and preferences
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Tabs */}
        <Card
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "32px",
            borderRadius: "24px",
          }}
        >
          <Tabs.Root defaultValue="general">
            <Tabs.List>
              <Tabs.Trigger value="general">General</Tabs.Trigger>
              <Tabs.Trigger value="social">Social</Tabs.Trigger>
              <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
              <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
            </Tabs.List>

            <Box pt="5">
              {/* General Tab */}
              <Tabs.Content value="general">
                <GeneralSettings
                  initialData={{
                    displayName: profile.displayName,
                    bio: profile.bio,
                    avatarUrl: profile.avatarUrl,
                  }}
                  onSave={handleSaveGeneral}
                  isSaving={isSaving}
                />
              </Tabs.Content>

              {/* Social Tab */}
              <Tabs.Content value="social">
                <SocialSettings
                  initialData={profile.socialLinks}
                  onSave={handleSaveSocial}
                  isSaving={isSaving}
                />
              </Tabs.Content>

              {/* Theme Tab */}
              <Tabs.Content value="theme">
                <ThemeSettings
                  initialData={profile.theme}
                  onSave={handleSaveTheme}
                  isSaving={isSaving}
                />
              </Tabs.Content>

              {/* Advanced Tab */}
              <Tabs.Content value="advanced">
                <AdvancedSettings
                  username={profile.username}
                  createdAt={profile.createdAt}
                  updatedAt={profile.updatedAt}
                  onTransfer={() => setTransferDialogOpen(true)}
                  onDelete={() => setDeleteDialogOpen(true)}
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Card>

        {/* Transfer Profile Dialog */}
        <TransferProfileDialog
          open={transferDialogOpen}
          onOpenChange={setTransferDialogOpen}
          onTransfer={handleTransfer}
          isTransferring={isTransferring}
        />

        {/* Delete Profile Dialog */}
        <DeleteProfileDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </Flex>
    </Container>
  );
}
