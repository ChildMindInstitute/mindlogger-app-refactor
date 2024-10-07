import {
  LDContext,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

export interface IFeatureFlagsService {
  init(): ReactNativeLDClient;
  login(userId: string): Promise<void>;
  logout(): Promise<void>;
  evaluateFlag(flag: string): boolean;
  setChangeHandler(fn: (ctx: LDContext, changedKeys: string[]) => void): void;
  removeChangeHandler(fn: Function): void;
}
