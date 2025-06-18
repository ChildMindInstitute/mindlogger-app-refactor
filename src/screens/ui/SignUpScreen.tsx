import { FC } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignUpForm } from '@app/features/sign-up/ui/SignUpForm';
import { openUrl } from '@app/screens/lib/utils/helpers';
import { IS_SMALL_HEIGHT_SCREEN } from '@app/shared/lib/constants';
import { Box } from '@app/shared/ui/base';
import { KeyboardAvoidingView } from '@app/shared/ui/KeyboardAvoidingView';
import { ScrollView } from '@app/shared/ui/ScrollView';
import { Text } from '@app/shared/ui/Text';

export const SignUpScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  let marginTop: string | number = '$8';
  if (IS_SMALL_HEIGHT_SCREEN) marginTop = '$5';
  else if (isTablet()) marginTop = 170;

  return (
    <KeyboardAvoidingView
      contentContainerStyle={{ flex: 1 }}
      flex={1}
      keyboardVerticalOffset={-120}
      behavior="position"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} px={isTablet() ? '$20' : 0}>
          <Box flex={1} px="$8">
            <ScrollView flex={1}>
              <Box mt={marginTop} mb={isTablet() ? 0 : 12}>
                <Text
                  fontSize={IS_SMALL_HEIGHT_SCREEN ? 28 : 32}
                  lineHeight={40}
                >
                  {t('login:account_create')}
                </Text>
              </Box>

              <Box mt={30}>
                <SignUpForm onLoginSuccess={() => navigate('Applets')} />
              </Box>
            </ScrollView>

            <Box justifyContent="center" alignItems="center">
              <Box
                flexDirection="row"
                flexWrap="wrap"
                jc="center"
                gap="$1.5"
                mb={32 + bottom}
                mt={10}
              >
                <Text ta="center">{t('sign_up_form:sign_up_agree')}</Text>
                <Text
                  ta="center"
                  textDecorationLine="underline"
                  accessibilityLabel="terms_of_service_link"
                  onPress={() =>
                    openUrl('https://mindlogger.org/terms-of-service')
                  }
                >
                  {t('auth:terms')}
                </Text>
                <Text ta="center">{t('sign_up_form:and')}</Text>
                <Text
                  ta="center"
                  textDecorationLine="underline"
                  onPress={() =>
                    openUrl('https://mindlogger.org/privacy-policy')
                  }
                  accessibilityLabel="privacy_policy_link"
                >
                  {t('auth:privacy')}.
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
