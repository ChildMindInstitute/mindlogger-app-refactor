import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { EntityPath } from '@app/abstract/lib/types/entity';

export type RootStackParamList = {
  Login: undefined;
  PasswordRecovery: { email: string; key: string };
  SignUp: undefined;
  AboutApp: undefined;
  ChangeLanguage: undefined;
  ForgotPassword: undefined;
  Applets: undefined;
  AppletDetails: { appletId: string; title: string };
  Settings: undefined;
  ChangePassword: undefined;
  InProgressActivity: EntityPath & { fromActiveAssessmentLink?: boolean };
  ActivityPassedScreen: undefined;
  ApplicationLogs: undefined;
  Autocompletion: undefined;
};

export type RootStackNavigationProps =
  | NativeStackNavigationProp<RootStackParamList, 'Login'>
  | NativeStackNavigationProp<RootStackParamList, 'PasswordRecovery'>
  | NativeStackNavigationProp<RootStackParamList, 'SignUp'>
  | NativeStackNavigationProp<RootStackParamList, 'AboutApp'>
  | NativeStackNavigationProp<RootStackParamList, 'ChangeLanguage'>
  | NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>
  | NativeStackNavigationProp<RootStackParamList, 'Applets'>
  | NativeStackNavigationProp<RootStackParamList, 'AppletDetails'>
  | NativeStackNavigationProp<RootStackParamList, 'Settings'>
  | NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>
  | NativeStackNavigationProp<RootStackParamList, 'InProgressActivity'>
  | NativeStackNavigationProp<RootStackParamList, 'ActivityPassedScreen'>
  | NativeStackNavigationProp<RootStackParamList, 'ApplicationLogs'>
  | NativeStackNavigationProp<RootStackParamList, 'Autocompletion'>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AppletDetailsParamList = {
  ActivityList: { appletId: string };
  Data: { appletId: string };
  About: { appletId: string };
};

export type ScreenRoute = keyof RootStackParamList;
export type ScreenParams = RootStackParamList[ScreenRoute];

export type AppletDetailsScreenProps<T extends keyof AppletDetailsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<AppletDetailsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
