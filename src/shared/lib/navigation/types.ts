import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  AboutApp: undefined;
  AppLanguage: undefined;
  ForgotPassword: undefined;
  Applets: undefined;
  AppletDetails: { appletId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AppletDetailsParamList = {
  Activities: undefined;
  Data: undefined;
  About: undefined;
};

export type AppletDetailsScreenProps<T extends keyof AppletDetailsParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppletDetailsParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
