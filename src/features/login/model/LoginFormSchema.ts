import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(3, 'login_form_error:min'),
});

export default schema;
