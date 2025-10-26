import { Container, Flex, Heading, Text, Box, Spinner } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeader } from "../components/ProfileHeader";
import { SocialLinksBar } from "../components/SocialLinksBar";
import { PublicLinkButton } from "../components/PublicLinkButton";
import { OnChainBadge } from "../components/OnChainBadge";
import { ShareButton } from "../components/ShareButton";
import { parseProfileObject } from "../utils/sui";
import { Link } from "../types/profile";

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const client = useSuiClient();

  // Fetch profile from blockchain
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) return null;

      // ProfileCreated event'lerini ara
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${import.meta.env.VITE_PACKAGE_ID}::profile::ProfileCreated`,
        },
        limit: 1000,
      });

      // Username match eden event'i bul
      for (const event of events.data) {
        const eventData = event.parsedJson as any;
        if (eventData.username === username) {
          // Fetch profile object
          const profileObj = await client.getObject({
            id: eventData.profile_id,
            options: {
              showContent: true,
              showType: true,
            },
          });

          if (profileObj.data) {
            return parseProfileObject(profileObj.data);
          }
        }
      }

      return null;
    },
    enabled: !!username,
  });

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

  // Profile not found
  if (!profile) {
    return (
      <Container style={{ paddingTop: "120px" }}>
        <Flex direction="column" align="center" gap="4" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Heading size="8">Profile Not Found</Heading>
          <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            The profile "@{username}" doesn't exist or hasn't been created yet.
          </Text>
        </Flex>
      </Container>
    );
  }

  const visibleLinks = profile.links.filter((link: Link) => link.isVisible);

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: profile.theme.backgroundColor || "#1a1a2e",
        paddingTop: "80px",
        paddingBottom: "60px",
      }}
    >
      <Container>
        <Flex 
          direction="column" 
          align="center" 
          gap="6"
          style={{ 
            maxWidth: "600px", 
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          {/* Profile Header */}
          <ProfileHeader
            username={profile.username}
            displayName={profile.displayName}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            theme={profile.theme}
          />

          {/* Social Links */}
          <SocialLinksBar socialLinks={profile.socialLinks} />

          {/* Links */}
          {visibleLinks.length > 0 && (
            <Flex direction="column" gap="3" style={{ width: "100%", marginTop: "20px" }}>
              {visibleLinks.map((link: Link) => (
                <PublicLinkButton
                  key={link.id}
                  link={link}
                  theme={profile.theme}
                  onClick={() => handleLinkClick(link.url)}
                />
              ))}
            </Flex>
          )}

          {/* No Links State */}
          {visibleLinks.length === 0 && (
            <Flex direction="column" align="center" gap="3" style={{ marginTop: "40px" }}>
              <Text size="3" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                No links added yet
              </Text>
            </Flex>
          )}

          {/* On-Chain Badge */}
          <Box style={{ marginTop: "40px" }}>
            <OnChainBadge />
          </Box>

          {/* Share Button */}
          <ShareButton username={profile.username} />

          {/* Footer */}
          <Flex direction="column" align="center" gap="2" style={{ marginTop: "20px" }}>
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              Powered by Kumru
            </Text>
            <Text size="1" style={{ color: "rgba(255, 255, 255, 0.3)" }}>
              Built on Sui Blockchain
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
