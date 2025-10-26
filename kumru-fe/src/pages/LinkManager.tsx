import { Container, Flex, Heading, Text, Button, Card, Box, Spinner } from "@radix-ui/themes";
import { useState } from "react";
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Navigate, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Link2Icon } from "lucide-react";
import { toast } from "sonner";
import { SortableLinkList } from "../components/SortableLinkList";
import { LinkDialog } from "../components/LinkDialog";
import { parseProfileObject, buildAddLinkTx, buildUpdateLinkTx, buildDeleteLinkTx, buildReorderLinksTx } from "../utils/sui";
import type { Link } from "../types/profile";

export function LinkManager() {
  const account = useCurrentAccount();
  const navigate = useNavigate();
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [_isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to home page if wallet is not connected
  if (!account) {
    return <Navigate to="/" replace />;
  }

  // Loading
  if (isLoading) {
    return (
      <Container style={{ paddingTop: "120px" }}>
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

  const handleAddLink = (linkData: Omit<Link, "id" | "position">) => {
    setIsSubmitting(true);
    
    const tx = buildAddLinkTx(
      profile.id,
      linkData.title,
      linkData.url,
      linkData.description || "",
      linkData.icon
    );

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success("Link added successfully!");
          setDialogOpen(false);
          setIsSubmitting(false);
          refetch();
        },
        onError: (error) => {
          console.error("❌ Error adding link:", error);
          toast.error("Failed to add link. Please try again.");
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleEditLink = (linkData: Omit<Link, "id" | "position">) => {
    if (!editingLink) return;
    
    setIsSubmitting(true);

    const tx = buildUpdateLinkTx(
      profile.id,
      editingLink.id,
      linkData.title,
      linkData.url,
      linkData.description || "",
      linkData.icon,
      linkData.isVisible
    );

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success("Link updated successfully!");
          setDialogOpen(false);
          setEditingLink(null);
          setIsSubmitting(false);
          refetch();
        },
        onError: (error) => {
          console.error("❌ Error updating link:", error);
          toast.error("Failed to update link. Please try again.");
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleDeleteLink = (linkId: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    
    const tx = buildDeleteLinkTx(profile.id, linkId);

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success("Link deleted successfully!");
          refetch();
        },
        onError: (error) => {
          console.error("❌ Error deleting link:", error);
          toast.error("Failed to delete link. Please try again.");
        },
      }
    );
  };

  const handleToggleVisibility = (linkId: number, isVisible: boolean) => {
    const link = profile.links.find((l: any) => l.id === linkId);
    if (!link) return;

    const tx = buildUpdateLinkTx(
      profile.id,
      linkId,
      link.title,
      link.url,
      link.description || "",
      link.icon,
      isVisible
    );

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success(`Link ${isVisible ? 'shown' : 'hidden'} successfully!`);
          refetch();
        },
        onError: (error) => {
          console.error("❌ Error toggling visibility:", error);
          toast.error("Failed to update visibility.");
        },
      }
    );
  };

  const handleReorder = (newLinks: Link[]) => {
    const newPositions = newLinks.map(l => l.id);
    
    const tx = buildReorderLinksTx(profile.id, newPositions);

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success("Links reordered successfully!");
          refetch();
        },
        onError: (error) => {
          console.error("❌ Error reordering:", error);
          toast.error("Failed to reorder links.");
        },
      }
    );
  };

  const openAddDialog = () => {
    setEditingLink(null);
    setDialogOpen(true);
  };

  const openEditDialog = (link: Link) => {
    setEditingLink(link);
    setDialogOpen(true);
  };

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "60px" }}>
      <Flex direction="column" gap="6" style={{ maxWidth: "900px", margin: "0 auto" }}>
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
                Manage Links
              </Heading>
              <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Add, edit, and organize your links
              </Text>
            </Box>
          </Flex>

          <Button
            size="3"
            onClick={openAddDialog}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
            Add Link
          </Button>
        </Flex>

        {/* Stats */}
        <Flex gap="4">
          <Card
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px 24px",
              flex: 1,
            }}
          >
            <Flex direction="column" gap="1">
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Total Links
              </Text>
              <Heading size="6">{profile.links.length}</Heading>
            </Flex>
          </Card>

          <Card
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px 24px",
              flex: 1,
            }}
          >
            <Flex direction="column" gap="1">
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Visible
              </Text>
              <Heading size="6">{profile.links.filter((l: any) => l.isVisible).length}</Heading>
            </Flex>
          </Card>

          <Card
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px 24px",
              flex: 1,
            }}
          >
            <Flex direction="column" gap="1">
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Hidden
              </Text>
              <Heading size="6">{profile.links.filter((l: any) => !l.isVisible).length}</Heading>
            </Flex>
          </Card>
        </Flex>

        {/* Links List */}
        <Card
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "32px",
            borderRadius: "24px",
          }}
        >
          {profile.links.length === 0 ? (
            <Flex direction="column" align="center" gap="4" style={{ padding: "60px 20px" }}>
              <Box
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "24px",
                  borderRadius: "50%",
                }}
              >
                <Link2Icon size={48} color="white" />
              </Box>
              <Heading size="5">No Links Yet</Heading>
              <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}>
                Start building your link tree by adding your first link
              </Text>
              <Button
                size="3"
                onClick={openAddDialog}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: "pointer",
                }}
              >
                <Plus size={18} />
                Add Your First Link
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center" mb="2">
                <Text size="2" weight="bold">
                  Your Links
                </Text>
                <Text size="1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  Drag to reorder
                </Text>
              </Flex>
              
              <SortableLinkList
                links={profile.links}
                onEdit={openEditDialog}
                onDelete={handleDeleteLink}
                onToggleVisibility={handleToggleVisibility}
                onReorder={handleReorder}
              />
            </Flex>
          )}
        </Card>
      </Flex>

      {/* Add/Edit Link Dialog */}
      <LinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editingLink ? handleEditLink : handleAddLink}
        editingLink={editingLink}
      />
    </Container>
  );
}
