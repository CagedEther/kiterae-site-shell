import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const metaSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/blog" }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    meta: metaSchema,
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string(),
    readingMinutes: z.number().int().positive(),
    featured: z.enum(["lead", "core", "standard"]).default("standard"),
    order: z.number().int().default(99),
    leadImage: imageSchema,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/pages" }),
  schema: z.discriminatedUnion("template", [
    z.object({
      template: z.literal("home"),
      meta: metaSchema,
      label: z.string(),
      topicLine: z.string(),
      heroEyebrow: z.string(),
      lede: z.string(),
      coreEyebrow: z.string(),
      coreHeading: z.string(),
      coreDeck: z.string(),
      moreHeading: z.string(),
    }),
    z.object({
      template: z.literal("page"),
      title: z.string(),
      eyebrow: z.string(),
      deck: z.string(),
      meta: metaSchema,
    }),
  ]),
});

export const collections = { blog, pages };
