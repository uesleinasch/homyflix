import React, { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Flex,
  Group,
  Input,
  Select,
  Button,
  Text,
  ActionIcon,
  Box,
} from "@mantine/core";
import { FunnelIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { YearPickerInput } from "@mantine/dates";
import styles from "./style.module.css";

// Schema de validação para filtros
const FilterSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  yearFrom: z.string().optional(),
  yearTo: z.string().optional(),
});

export type FilterFormData = z.infer<typeof FilterSchema>;

interface MovieFiltersProps {
  onFilter: (filters: FilterFormData) => void;
}

const genresArray = [
  "Todos",
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Horror",
  "Romance",
  "Ficção Científica",
  "Suspense",
  "Animação",
  "Documentário",
];

const MovieFilters = memo<MovieFiltersProps>(({ onFilter }) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FilterFormData>({
      resolver: zodResolver(FilterSchema),
      defaultValues: {
        search: "",
        genre: "",
        yearFrom: "",
        yearTo: "",
      },
    });

  const onSubmit = useCallback(
    (data: FilterFormData) => {
      onFilter(data);
    },
    [onFilter]
  );

  const handleReset = useCallback(() => {
    reset();
    onFilter({});
  }, [reset, onFilter]);

  const handleYearFromChange = useCallback(
    (value: string | null) => {
      setValue("yearFrom", value || "");
    },
    [setValue]
  );

  const handleYearToChange = useCallback(
    (value: string | null) => {
      setValue("yearTo", value || "");
    },
    [setValue]
  );

  const handleToggleFilters = useCallback(() => {
    setIsFiltersVisible((prev) => !prev);
  }, []);

  return (
    <Box mb={{base: "0px", sm: "xl"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ActionIcon
          bdrs={"50%"}
          className={styles.toggleFilters}
          variant="gradient"
          size="xl"
          aria-label="Toggle filters visibility"
          gradient={{
            from: "var(--primary-600)",
            to: "var(--primary-500)",
            deg: 90,
          }}
          onClick={handleToggleFilters}
        >
          <FunnelIcon size={16} />
        </ActionIcon>
        <Flex
          gap="md"
          justify="start"
          wrap="wrap"
          mb="md"
          className={`${styles.filtersContainer} ${
            isFiltersVisible ? styles.visible : styles.hidden
          }`}
        >
          <Group w={{ base: "100%", sm: "auto" }}>
            <Input
              w={{ base: "100%", sm: "auto" }}
              id="search"
              placeholder="Buscar por título..."
              {...register("search")}
              leftSection={<MagnifyingGlassIcon size={16} />}
              style={{ minWidth: "250px" }}
            />
          </Group>

          <Group w={{ base: "100%", sm: "auto" }}>
            <Select
              w={{ base: "100%", sm: "auto" }}
              placeholder="Selecione um gênero"
              data={genresArray}
              id="genre"
              value={watch("genre")}
              onChange={(value) => setValue("genre", value || "")}
              style={{ minWidth: "180px" }}
              clearable
            />
          </Group>

          <Group>
            <Flex gap="xs" align="center" wrap="wrap">
              <Text
                w={{ base: "100%", sm: "auto" }}
                size="sm"
                c={"var(--text-secondary)"}
              >
                Buscar por ano:
              </Text>
              <YearPickerInput
                placeholder="Selecione o ano inicial"
                value={watch("yearFrom") ? watch("yearFrom") : new Date()}
                onChange={handleYearFromChange}
                clearable
                maxDate={new Date()}
                style={{ minWidth: "140px", flex: 1 }}
              />
              <YearPickerInput
                placeholder="Selecione o ano final"
                value={watch("yearTo") ? watch("yearTo") : new Date()}
                onChange={handleYearToChange}
                clearable
                maxDate={new Date()}
                minDate={
                  watch("yearFrom")
                    ? new Date(parseInt(watch("yearFrom")!))
                    : undefined
                }
                style={{ minWidth: "140px", flex: 1 }}
              />
            </Flex>
          </Group>

          <Group>
            <Flex gap="sm" justify="start">
              <Button type="submit" variant="filled" color="blue">
                Filtrar
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                color="gray"
              >
                Limpar Filtros
              </Button>
            </Flex>
          </Group>
        </Flex>
      </form>
    </Box>
  );
});

MovieFilters.displayName = "MovieFilters";

export default MovieFilters;
