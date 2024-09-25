import { z } from 'zod';

export const SessionScheme = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
});
