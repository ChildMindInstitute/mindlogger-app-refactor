import { TokenStorage } from '@shared/lib';

export type SaveTokenOptions = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  password: string;
};

function storeTokens(options: SaveTokenOptions) {
  const { accessToken, refreshToken, tokenType, password } = options;

  TokenStorage.clearAll();
  TokenStorage.set('accessToken', accessToken);
  TokenStorage.set('refreshToken', refreshToken);
  TokenStorage.set('tokenType', tokenType);

  TokenStorage.recrypt(password);
}

export default storeTokens;
