import { Container, Flex, Heading, Text, Button, Grid, Card, Box } from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import { Sparkles, Link2, Palette, Shield } from "lucide-react";

export function Home() {
  const account = useCurrentAccount();

  return (
    <Container style={{ padding: "0" }}>
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{
          minHeight: "100vh",
          padding: "100px 20px 60px",
          textAlign: "center",
        }}
      >
        <Box
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            padding: "50px 40px",
            borderRadius: "40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <Heading
            size="9"
            mb="4"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "bold",
            }}
          >
            Your Links, On-Chain Forever
          </Heading>

          <Text size="5" mb="6" style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.6" }}>
            Create your decentralized LinkTree as an NFT on Sui blockchain.
            <br />
            Own your links, customize your style, share your world.
          </Text>

          {account ? (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button
                size="4"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "20px 40px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  marginTop: "40px",
                }}
              >
                <Sparkles size={20} />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Text size="5" mb="6" style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.7" }}>
              Connect your wallet to get started
            </Text>
          )}
        </Box>
      </Flex>

      {/* Features Section */}
      <Container style={{ paddingBottom: "80px" }}>
        <Grid
          columns={{ initial: "1", md: "3" }}
          gap="4"
          width="100%"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Card
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "30px",
            }}
          >
            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <Shield size={32} color="white" />
              </Box>
              <Heading size="4">NFT Profile</Heading>
              <Text size="2" align="center" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Your profile is an NFT. You truly own it, transfer it, or even sell it.
              </Text>
            </Flex>
          </Card>

          <Card
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "30px",
            }}
          >
            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <Link2 size={32} color="white" />
              </Box>
              <Heading size="4">Unlimited Links</Heading>
              <Text size="2" align="center" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Add up to 50 links. Organize, reorder, and manage them effortlessly.
              </Text>
            </Flex>
          </Card>

          <Card
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "30px",
            }}
          >
            <Flex direction="column" align="center" gap="3">
              <Box
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <Palette size={32} color="white" />
              </Box>
              <Heading size="4">Custom Themes</Heading>
              <Text size="2" align="center" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Personalize your page with custom colors, fonts, and button styles.
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* Stats Section */}
        <Flex
          gap="8"
          mt="8"
          justify="center"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            padding: "40px 60px",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth: "600px",
            margin: "60px auto 0",
          }}
        >
          <Flex direction="column" align="center" gap="2">
            <Heading size="8" style={{ color: "#667eea" }}>
              ∞
            </Heading>
            <Text size="2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Decentralized
            </Text>
          </Flex>
          <Flex direction="column" align="center" gap="2">
            <Heading size="8" style={{ color: "#764ba2" }}>
              NFT
            </Heading>
            <Text size="2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Your Profile
            </Text>
          </Flex>
          <Flex direction="column" align="center" gap="2">
            <Heading size="8" style={{ color: "#667eea" }}>
              50
            </Heading>
            <Text size="2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Max Links
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
}
