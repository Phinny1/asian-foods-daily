import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().nullable(),
  draft: z.boolean().default(false),
  // Additional fields for scraped/imported content
  schemaType: z.string().optional(),
  schemaData: z.any().optional(),
  updatedDate: z.coerce.date().optional(),
});

const blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const recipes = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    section: z.string().optional(),
  }),
});

export const collections = { blog, docs, recipes };
