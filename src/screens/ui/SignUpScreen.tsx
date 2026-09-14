import { FC, useRef } from 'react';
import {
  HostInstance,
  ScrollView as RNScrollView,
  TextInput,
} from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isTablet } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignUpForm } from '@app/features/sign-up/ui/SignUpForm';
import { openUrl } from '@app/screens/lib/utils/helpers';
import { IS_SMALL_HEIGHT_SCREEN } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { Box } from '@app/shared/ui/base';
import { GradientOverlay } from '@app/shared/ui/GradientOverlay';
import { KeyboardAvoidingView } from '@app/shared/ui/KeyboardAvoidingView';
import { ScrollView } from '@app/shared/ui/ScrollView';
import { Text } from '@app/shared/ui/Text';

export const SignUpScreen: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const scrollViewRef = useRef<RNScrollView>(null);
  const passwordInputRef = useRef<HostInstance | null>(null);

  const isPasswordFocused = () =>
    !!passwordInputRef.current &&
    passwordInputRef.current === TextInput.State.currentlyFocusedInput();

  // Scroll password input to top so password requirements remain visible
  const scrollPasswordInputToTop = () => {
    const scrollView = scrollViewRef.current?.getNativeScrollRef();
    if (!passwordInputRef.current || !scrollView) return;

    // measureLayout ignores the scroll offset, so y is the content offset
    passwordInputRef.current.measureLayout(scrollView, (_x, y) =>
      scrollViewRef.current?.scrollTo({
        y: Math.max(y - 16, 0), // reduce offset by 16 for GradientOverlay
        animated: true,
      }),
    );
  };

  let marginTop: string | number = '$8';
  if (IS_SMALL_HEIGHT_SCREEN) marginTop = '$5';
  else if (isTablet()) marginTop = 200;

  return (
    <KeyboardAvoidingView
      flex={1}
      // Shrink padding instead of shifting position so fields remain in view (M2-11126)
      behavior="padding"
      // Offset by header less 120 to allow terms & privacy to be covered by keyboard
      keyboardVerticalOffset={headerHeight - 120}
    >
      <Box flex={1} px={isTablet() ? '$20' : 0}>
        <Box flex={1} px="$8">
          <Box flex={1}>
            <ScrollView
              ref={scrollViewRef}
              flex={1}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              // Scroll again if viewport changes after keyboard opens
              onLayout={() => isPasswordFocused() && scrollPasswordInputToTop()}
            >
              <Box mt={marginTop} mb={isTablet() ? 0 : 12}>
                <Text
                  fontSize={IS_SMALL_HEIGHT_SCREEN ? 28 : 32}
                  lineHeight={40}
                >
                  {t('login:account_create')}
                </Text>
              </Box>

              <Box mt={30}>
                <SignUpForm
                  onLoginSuccess={() => navigate('Applets')}
                  onPasswordFocus={() => {
                    passwordInputRef.current =
                      TextInput.State.currentlyFocusedInput();
                    scrollPasswordInputToTop();
                  }}
                />
              </Box>
            </ScrollView>

            <GradientOverlay position="top" color={palette.surface} />
            <GradientOverlay position="bottom" color={palette.surface} />
          </Box>

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
                onPress={() => openUrl('https://www.gettingcurious.com/terms')}
              >
                {t('auth:terms')}
              </Text>
              <Text ta="center">{t('sign_up_form:and')}</Text>
              <Text
                ta="center"
                textDecorationLine="underline"
                onPress={() =>
                  openUrl('https://www.gettingcurious.com/privacy-policy')
                }
                accessibilityLabel="privacy_policy_link"
              >
                {t('auth:privacy')}.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};
