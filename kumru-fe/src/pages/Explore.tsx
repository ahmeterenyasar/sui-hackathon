import { Container, Flex, Heading, Text, Button, Grid, Spinner } from "@radix-ui/themes";
import { useState, useMemo } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { ProfileCard } from "../components/ProfileCard";
import { SearchBar } from "../components/SearchBar";
import { ExploreFilters, SortOption } from "../components/ExploreFilters";
import { parseProfileObject } from "../utils/sui";
import { Profile } from "../types/profile";

export function Explore() {
  const client = useSuiClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [displayCount, setDisplayCount] = useState(12);

  // Fetch all profiles from blockchain
  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ["allProfiles"],
    queryFn: async () => {
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${import.meta.env.VITE_PACKAGE_ID}::profile::ProfileCreated`,
        },
        limit: 1000,
      });

      const profilePromises = events.data.map(async (event) => {
        const eventData = event.parsedJson as any;
        try {
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
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
        return null;
      });

      const profiles = await Promise.all(profilePromises);
      return profiles.filter((p) => p !== null) as Profile[];
    },
  });

  // Filter and sort profiles
  const filteredProfiles = useMemo(() => {
    let filtered = allProfiles;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (profile) =>
          profile.username.toLowerCase().includes(query) ||
          profile.displayName?.toLowerCase().includes(query) ||
          profile.bio?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.createdAt - a.createdAt;
        case "popular":
          return b.links.length - a.links.length;
        case "alphabetical":
          return a.username.localeCompare(b.username);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProfiles, searchQuery, sortBy]);

  const displayedProfiles = filteredProfiles.slice(0, displayCount);
  const hasMore = displayCount < filteredProfiles.length;

  if (isLoading) {
    return (
      <Container style={{ paddingTop: "120px" }}>
        <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
          <Spinner size="3" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex direction="column" align="center" gap="2">
          <Heading size="8">
            Explore Profiles
          </Heading>
          <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}>
            Discover amazing profiles created by our community
          </Text>
        </Flex>

        {/* Search & Filters */}
        <Flex
          direction={{ initial: "column", sm: "row" }}
          gap="3"
          align={{ initial: "stretch", sm: "center" }}
          justify="between"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ flex: 1, maxWidth: "400px" }}>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search by username, name, or bio..."
            />
          </div>
          <ExploreFilters sortBy={sortBy} onSortChange={setSortBy} />
        </Flex>

        {/* Results Count */}
        <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
          {filteredProfiles.length} {filteredProfiles.length === 1 ? "profile" : "profiles"} found
        </Text>

        {/* Profile Grid */}
        {displayedProfiles.length > 0 ? (
          <Grid
            columns={{ initial: "1", sm: "2", md: "3" }}
            gap="4"
            style={{ marginTop: "8px" }}
          >
            {displayedProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </Grid>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap="3"
            style={{
              padding: "80px 20px",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
            }}
          >
            <Text size="6" style={{ fontSize: "48px" }}>
              🔍
            </Text>
            <Heading size="5">
              No profiles found
            </Heading>
            <Text size="2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Try adjusting your search query
            </Text>
          </Flex>
        )}

        {/* Load More Button */}
        {hasMore && (
          <Flex justify="center" style={{ marginTop: "24px" }}>
            <Button
              size="3"
              variant="soft"
              style={{
                background: "rgba(102, 126, 234, 0.15)",
                color: "#a5b4fc",
                border: "1px solid rgba(102, 126, 234, 0.3)",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => setDisplayCount((prev) => prev + 12)}
            >
              Load More ({filteredProfiles.length - displayCount} remaining)
            </Button>
          </Flex>
        )}
      </Flex>
    </Container>
  );
}
