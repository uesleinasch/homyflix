import { createMovieSchema } from "../schema/CreateMovieSchema";
import z from "zod";

export type CreateMovieFormData = z.infer<typeof createMovieSchema>;
