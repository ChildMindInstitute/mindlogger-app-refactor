import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import MarkdownView from '@app/shared/ui/MarkdownView';
import { blueLogo } from '@assets/images';
import { Box, Text, ScrollView, Image } from '@shared/ui';

const AboutScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <Box bg="$secondary">
      <ScrollView px="$6">
        <MarkdownView
          accessibilityLabel="about-applet-screen-markup-view"
          content={t('about_app:mindlogger_about', {
            credits_link: 'https://help.mindlogger.org',
          })}
          markdownStyle={markdownStyle}
        />

        <Text color="$tertiary" mt={10} fontSize={12}>
          {t('about_app:subtitle')}
        </Text>

        <Box mt={20} mb={30}>
          <Image alignSelf="center" src={blueLogo} width={70} height={70} />
        </Box>
      </ScrollView>
    </Box>
  );
};

export const markdownStyle: StyleSheet.NamedStyles<any> = StyleSheet.create({
  heading2: {
    marginBottom: 28,
  },
  heading3: {
    marginBottom: 16,
    marginLeft: 45,
    color: colors.tertiary,
  },
  heading4: {
    marginBottom: 18,
    marginLeft: 45,
    color: colors.tertiary,
  },
  heading5: {
    marginLeft: 55,
    color: colors.tertiary,
  },
  paragraph: {
    color: colors.tertiary,
  },
  link: {
    color: colors.blue,
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  bullet_list: {
    marginBottom: 20,
    color: colors.tertiary,
  },
});

export default AboutScreen;
