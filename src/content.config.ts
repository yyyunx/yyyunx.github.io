import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default("技術筆記"),
  visual: z.enum(["exif", "runnable", "terrain", "map"]).default("runnable"),
    pubDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    slug: z.string().optional(),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
