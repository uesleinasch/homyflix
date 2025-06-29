import { Card, BackgroundImage, Box, ActionIcon, Text } from "@mantine/core";
import { EyeIcon } from "@phosphor-icons/react";
import type { Movie } from "../../../../shared/types/movie";

const DashboardMovieCard: React.FC<{ movie: Movie; onClick: () => void }> = ({ movie, onClick }) => (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      h="200px"
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Card.Section>
        <BackgroundImage
          src={movie.poster_url || "https://placehold.co/300x200?text=Filme"}
          h="120px"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </Card.Section>
      
      <Box p="xs">
        <Text fw={500} size="sm" lineClamp={1}>
          {movie.title}
        </Text>
        <Text size="xs" c="dimmed">
          {movie.release_year} • {movie.genre}
        </Text>
      </Box>
      
      <ActionIcon
        variant="filled"
        color="orange"
        size="sm"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          opacity: 0.9,
        }}
      >
        <EyeIcon size={12} />
      </ActionIcon>
    </Card>
  );

  export default DashboardMovieCard;