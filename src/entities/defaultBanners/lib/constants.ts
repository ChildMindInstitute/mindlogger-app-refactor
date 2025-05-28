import { RootStackParamList } from '@app/screens/config/types';

export const REBRAND_BANNER_EXCLUDED_ROUTES: (keyof RootStackParamList)[] = [
  'InProgressActivity',
  'ActivityPassedScreen',
  'Autocompletion',
];
