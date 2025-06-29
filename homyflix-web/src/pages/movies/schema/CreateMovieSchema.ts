import z from "zod";

export const createMovieSchema = z.object({
    title: z
      .string()
      .min(1, "Título é obrigatório")
      .max(255, "Título deve ter no máximo 255 caracteres"),
    release_year: z
      .number()
      .int("Ano deve ser um número inteiro")
      .min(1888, "Ano deve ser maior ou igual a 1888")
      .max(
        new Date().getFullYear() + 5,
        "Ano não pode ser muito distante no futuro"
      ),
    genre: z
      .string()
      .min(1, "Gênero é obrigatório")
      .max(100, "Gênero deve ter no máximo 100 caracteres"),
    synopsis: z.string().min(1, "Sinopse é obrigatória"),
    poster_url: z.string().url("URL inválida").optional().or(z.literal("")),
  });