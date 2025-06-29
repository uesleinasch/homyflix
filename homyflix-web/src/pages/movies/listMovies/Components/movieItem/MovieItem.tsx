import React, { memo, useCallback } from "react";
import type { Movie } from "../../../../../shared/types/movie";
import {
  BackgroundImage,
  Button,
  Card,
  Flex,
  Grid,
  Space,
} from "@mantine/core";
import styles from "./style.module.css";
import { EyeIcon, TrashIcon, PenIcon } from "@phosphor-icons/react";

interface MovieItemProps {
  movie: Movie;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MovieItem = memo<MovieItemProps>(
  ({ movie, onView, onEdit, onDelete }) => {
    const handleDelete = useCallback(() => {
      if (
        window.confirm(
          `Tem certeza que deseja excluir o filme "${movie.title}"?`
        )
      ) {
        onDelete(movie.id);
      }
    }, [movie.id, movie.title, onDelete]);

    return (
      <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
        <Card
          shadow="sm"
          padding="sm"
          radius="md"
          bdrs={"lg"}
          h="340px"
          className={styles.cardContainer}
        >
          <Card.Section onClick={() => onView(movie.id)}>
            <div className={styles.coverShadow}></div>
            <BackgroundImage
              src={
                movie.poster_url || "https://placehold.co/600x400?text=Filme"
              }
              h="340px"
              bdrs={"lg"}
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Card.Section>
          <div className={styles.inforContainer}>
            <div className={styles.movieTitle}>{movie.title}</div>
            <Space h="xs" />
            <div className={styles.actionBar}>
              <Flex gap="xs" justify="space-between" w="100%">
                <Button
                  variant="outline"
                  color="gray"
                  size="xs"
                  onClick={() => onView(movie.id)}
                >
                  <EyeIcon size={16} />
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="xs"
                  onClick={() => onEdit(movie.id)}
                >
                  <PenIcon size={16} />
                </Button>

                <Button
                  variant="outline"
                  color="gray"
                  size="xs"
                  onClick={handleDelete}
                >
                  <TrashIcon size={16} />
                </Button>
              </Flex>
            </div>
          </div>
          {/* <div>
            <h3>{movie.title}</h3>
            <p>
              <strong>Ano:</strong> {movie.release_year}
            </p>
            <p>
              <strong>Gênero:</strong> {movie.genre}
            </p>
            <p>
              <strong>Sinopse:</strong> {movie.synopsis}
            </p>

            {movie.poster_url && (
              <p>
                <strong>Poster:</strong>{" "}
                <a
                  href={movie.poster_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Poster
                </a>
              </p>
            )}
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(movie.created_at).toLocaleDateString("pt-BR")}
            </p>

            <div style={{ marginTop: "12px" }}>
              <button
                onClick={() => onView(movie.id)}
                style={{ marginRight: "8px" }}
              >
                Visualizar
              </button>
              <button
                onClick={() => onEdit(movie.id)}
                style={{ marginRight: "8px" }}
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                style={{ backgroundColor: "#dc3545", color: "white" }}
              >
                Excluir
              </button>
            </div>
          </div> */}
        </Card>
      </Grid.Col>
    );
  }
);

MovieItem.displayName = "MovieItem";

export default MovieItem;
