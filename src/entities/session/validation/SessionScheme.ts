import { z } from 'zod';

const SessionScheme = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
});

export default SessionScheme;
