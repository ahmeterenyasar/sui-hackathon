import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      px="4"
      py="3"
      justify="between"
      align="center"
      style={{
        backgroundColor: scrolled
          ? "rgba(0, 0, 0, 0.7)"
          : "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 1000,
        transition: "all 0.3s ease",
        boxShadow: scrolled
          ? "0 4px 6px rgba(0, 0, 0, 0.1)"
          : "none",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <Heading
          size="6"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "900",
            cursor: "pointer",
            fontFamily: "'Poppins', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            letterSpacing: "0.05em",
            fontSize: "28px",
          }}
        >
          KUMRU
        </Heading>
      </Link>

      <Flex align="center" gap="4">
        <Link to="/explore" style={{ textDecoration: "none" }}>
          <Box
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)")}
          >
            Explore
          </Box>
        </Link>
        
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <Box
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#764ba2")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)")}
          >
            Dashboard
          </Box>
        </Link>

        <ConnectButton />
      </Flex>
    </Flex>
  );
}