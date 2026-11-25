import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const common = {
  title: z.string(),
  description: z.string(),
  lang: z.enum(['zh-tw', 'en']).default('zh-tw'),
  translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  visibility: z.enum(['public', 'draft']).default('draft'),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  order: z.number().default(999),
  pubDate: z.coerce.date().optional(),
};
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({ ...common, category: z.string().default('Notes') }),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...common,
    category: z.enum([
      'AI & Computer Vision',
      'Developer Tools',
      'Systems & Computer Architecture',
      'Web & Applications',
      'Automation',
      'Coursework',
    ]),
    tier: z.enum(['featured', 'other', 'coursework']),
    status: z.enum([
      'Maintained',
      'Experimental',
      'Hackathon Prototype',
      'Course Project',
      'Learning Project',
      'Completed',
      'In Development',
    ]),
    repository: z
      .url()
      .refine((url) => url.startsWith('https://github.com/yyyunx/')),
    demo: z.url().optional(),
    license: z.string(),
    reviewed: z.coerce.date(),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).min(1),
    diagram: z
      .enum(['groupctl', 'sharpness', 'inspection', 'systems'])
      .optional(),
  }),
});
export const collections = { notes, projects };
