import { z } from 'zod';

const schema = z.object({
  prev_password: z.string().min(6),
  password: z.string().min(6),
});

export default schema;
