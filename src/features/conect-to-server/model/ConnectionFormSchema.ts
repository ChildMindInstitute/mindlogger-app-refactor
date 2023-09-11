import { z } from 'zod';

const schema = z.object({
  ipAddress: z.string().ip(),
  port: z.coerce.number().int().gte(1000).lte(99999),
});

export default schema;
