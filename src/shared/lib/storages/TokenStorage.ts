import { MMKV } from 'react-native-mmkv';

const TokenStorage = new MMKV({
  id: 'token-storage',
});

export default TokenStorage;
