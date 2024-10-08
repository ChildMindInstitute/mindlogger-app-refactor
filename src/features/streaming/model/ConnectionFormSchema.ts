import { z } from 'zod';

export const ConnectionFormSchema = z.object({
  ipAddress: z.string().ip(),
  port: z
    .string()
    .transform(x => parseInt(x, 10))
    .pipe(z.number().int().gte(10).lte(99999))
    .transform(x => x.toString()),
  remember: z.boolean().optional(),
});
