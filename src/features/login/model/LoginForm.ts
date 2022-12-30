import * as zod from 'zod';

const schema = zod.object({
  email: zod.string().email('Invalid email'),
  password: zod.string().min(3, 'Min length err'),
});

export default schema;
