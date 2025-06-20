import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@app/shared/lib/constants/palette';
import { Box } from '@app/shared/ui/base';
import { GradientOverlay } from '@app/shared/ui/GradientOverlay';
import { MarkdownView } from '@app/shared/ui/MarkdownView';
import { ScrollView } from '@app/shared/ui/ScrollView';
import { Text } from '@app/shared/ui/Text';
import { blueLogo } from '@assets/images';

export const AboutScreen: FC = () => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  return (
    <Box>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: bottom,
        }}
      >
        <MarkdownView
          content={t('about_app:curious_about', {
            credits_link: 'https://help.mindlogger.org',
          })}
          markdownStyle={markdownStyle}
        />

        <Text color="$on_surface" mt={10} fontSize={12}>
          {t('about_app:subtitle')}
        </Text>

        <Box my={32}>
          <Image
            source={blueLogo}
            width={70}
            height={70}
            style={{
              alignSelf: 'center',
              width: 70,
              height: 70,
            }}
          />
        </Box>
      </ScrollView>
      <GradientOverlay color={palette.surface} />
    </Box>
  );
};

export const markdownStyle: StyleSheet.NamedStyles<any> = StyleSheet.create({
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 24,
    color: palette.on_surface,
  },
  heading3: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 24,
    color: palette.on_surface,
  },
  heading4: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 24,
    color: palette.on_surface,
  },
  heading5: {
    fontSize: 20,
    lineHeight: 28,
    color: palette.on_surface,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 24,
    color: palette.on_surface,
  },
  link: {
    color: palette.blue,
  },
  bullet_list: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 24,
    color: palette.tertiary,
  },
});
