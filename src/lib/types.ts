import z from 'zod';

export const planSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(['computer', 'notebook']),
  purpose: z.enum(['study', 'play']),
  budget: z.number().min(0),
  stores: z.array(z.string()).min(1).max(5),
});

export type SchemaPlan = z.infer<typeof planSchema>;
