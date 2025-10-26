import { Container, Flex, Heading, Text, Button, Card, Box, Spinner } from "@radix-ui/themes";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Link, Navigate } from "react-router-dom";
import { Settings, Link2, Eye } from "lucide-react";
import { parseProfileObject } from "../utils/sui";

export function Dashboard() {
  const account = useCurrentAccount();

  // Fetch user's profile
  const { data: ownedObjects, isLoading } = useSuiClientQuery(
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

  // Loading state
  if (isLoading) {
    return (
      <Container style={{ paddingTop: "120px", paddingBottom: "60px" }}>
        <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
          <Spinner size="3" />
        </Flex>
      </Container>
    );
  }

  // Redirect to Create Profile page if no profile exists
  if (!profile) {
    return <Navigate to="/create" replace />;
  }

  return (
    <Container style={{ paddingTop: "120px", paddingBottom: "60px" }}>
      <Flex direction="column" gap="6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Flex justify="between" align="center">
          <Box>
            <Heading size="8" mb="2" style={{ color: "#764ba2" }}>
              Welcome back, {profile.username}
            </Heading>
          </Box>

          <Flex gap="3">
            <Link to={`/${profile.username}`} style={{ textDecoration: "none" }}>
              <Button
                size="3"
                variant="outline"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                }}
              >
                <Eye size={18} />
                View Profile
              </Button>
            </Link>
          </Flex>
        </Flex>

        {/* Quick Stats */}
        <Flex gap="4" wrap="wrap">
          <Card
            style={{
              flex: 1,
              minWidth: "200px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "24px",
            }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Total Links
              </Text>
              <Heading size="7">{profile.links.length}</Heading>
            </Flex>
          </Card>

          <Card
            style={{
              flex: 1,
              minWidth: "200px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "24px",
            }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Username
              </Text>
              <Heading size="7">@{profile.username}</Heading>
            </Flex>
          </Card>

          <Card
            style={{
              flex: 1,
              minWidth: "200px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "24px",
            }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Status
              </Text>
              <Heading size="7">Active</Heading>
            </Flex>
          </Card>
        </Flex>

        {/* Profile Preview */}
        <Card
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "40px",
            borderRadius: "24px",
          }}
        >
          <Flex direction="column" align="center" gap="4" style={{ textAlign: "center" }}>
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid rgba(255, 255, 255, 0.1)",
              }}
            />

            <Box>
              <Heading size="6" mb="2">{profile.displayName}</Heading>
              <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                @{profile.username}
              </Text>
            </Box>

            {profile.bio && (
              <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)", maxWidth: "500px" }}>
                {profile.bio}
              </Text>
            )}

            <Link to={`/${profile.username}`} style={{ textDecoration: "none", marginTop: "16px" }}>
              <Button
                size="3"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: "pointer",
                }}
              >
                <Eye size={18} />
                View Public Profile
              </Button>
            </Link>
          </Flex>
        </Card>

        {/* Quick Actions */}
        <Flex gap="4" wrap="wrap">
          <Link to="/links" style={{ textDecoration: "none", flex: 1 }}>
            <Card
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Flex gap="3" align="center">
                <Link2 size={24} color="#667eea" />
                <Box>
                  <Heading size="4">Manage Links</Heading>
                  <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Add, edit, and organize your links
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Link>

          <Link to="/settings" style={{ textDecoration: "none", flex: 1 }}>
            <Card
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Flex gap="3" align="center">
                <Settings size={24} color="#764ba2" />
                <Box>
                  <Heading size="4">Settings</Heading>
                  <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Customize your profile
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
}
