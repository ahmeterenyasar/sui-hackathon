import { Card, Flex, Avatar, Text, Heading, Badge, Button } from "@radix-ui/themes";
import { Link, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile } from "../types/profile";
import { DEFAULT_AVATAR } from "../config/constants";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();
  
  const linkCount = profile.links.filter(link => link.isVisible).length;
  const createdDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <Card
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "24px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.2)";
        e.currentTarget.style.border = "1px solid rgba(102, 126, 234, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)";
      }}
    >
      <Flex direction="column" gap="4">
        {/* Avatar & Username */}
        <Flex align="center" gap="3">
          <Avatar
            size="5"
            src={profile.avatarUrl || `${DEFAULT_AVATAR}${profile.username}`}
            fallback={profile.username[0].toUpperCase()}
            radius="full"
            style={{
              border: "2px solid rgba(102, 126, 234, 0.5)",
            }}
          />
          <Flex direction="column" gap="1" style={{ flex: 1 }}>
            <Heading size="4" style={{ color: "#ffffff" }}>
              {profile.displayName || profile.username}
            </Heading>
            <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              @{profile.username}
            </Text>
          </Flex>
        </Flex>

        {/* Bio */}
        {profile.bio && (
          <Text
            size="2"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {profile.bio}
          </Text>
        )}

        {/* Stats */}
        <Flex gap="3" wrap="wrap">
          <Badge
            variant="soft"
            color="purple"
            style={{
              background: "rgba(102, 126, 234, 0.15)",
              color: "#a5b4fc",
            }}
          >
            <Link size={12} />
            {linkCount} {linkCount === 1 ? "link" : "links"}
          </Badge>
          
          <Badge
            variant="soft"
            color="gray"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Calendar size={12} />
            {createdDate}
          </Badge>

          {/* Theme Color Preview */}
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              background: profile.theme.backgroundColor,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            title={`Theme: ${profile.theme.backgroundColor}`}
          />
        </Flex>

        {/* View Profile Button */}
        <Button
          size="2"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
            marginTop: "8px",
          }}
          onClick={() => navigate(`/${profile.username}`)}
        >
          View Profile
        </Button>
      </Flex>
    </Card>
  );
}
