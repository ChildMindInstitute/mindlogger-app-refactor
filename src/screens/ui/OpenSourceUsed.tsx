import { FC, useState } from 'react';
import { Linking, StyleSheet, Modal } from 'react-native';

import { YStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

import { colors } from '@shared/lib';
import { Box, Text, XStack, ScrollView, CloseIcon } from '@shared/ui';

type License = {
  homePageUrl: string;
  licenseType: string;
  licenseUrl: string;
  version: string;
  title: string;
};

type Licenses = {
  [key: string]: License;
};

const licenses: Licenses = {
  '@react-native-community/hooks': {
    homePageUrl: 'https://github.com/react-native-community/hooks',
    licenseType: 'isc',
    licenseUrl:
      'https://raw.githubusercontent.com/react-native-community/hooks/main/LICENSE',
    version: '^3.0.0',
    title: 'React Native Hooks',
  },
  'react-native': {
    homePageUrl: 'https://github.com/facebook/react-native',
    licenseType: 'MIT, CC-BY-4.0 licenses found',
    licenseUrl:
      'https://raw.githubusercontent.com/facebook/react-native/main/LICENSE-docs',
    version: '0.70.6',
    title: 'React Native',
  },
  'react-native-autoheight-webview': {
    homePageUrl: 'https://github.com/iou90/react-native-autoheight-webview',
    licenseType: 'ISC',
    licenseUrl:
      'https://raw.githubusercontent.com/iou90/react-native-autoheight-webview/master/LICENSE',
    version: '^1.6.5',
    title: 'react-native-autoheight-webview',
  },
  'react-native-mmkv': {
    homePageUrl: 'https://github.com/mrousavy/react-native-mmkv',
    licenseType: 'MIT AND BSD-3-Clause',
    licenseUrl:
      'https://raw.githubusercontent.com/mrousavy/react-native-mmkv/master/LICENSE',
    version: '2.5.1',
    title: 'React native MMKV',
  },
  'react-native-video-player': {
    homePageUrl: 'https://github.com/cornedor/react-native-video-player',
    licenseType: 'ISC',
    licenseUrl:
      'https://raw.githubusercontent.com/cornedor/react-native-video-player/master/LICENSE',
    version: '^0.14.0',
    title: 'React Native Video Player',
  },
};

const devLicenses: Licenses = {
  '@typescript-eslint/parser': {
    homePageUrl: 'https://github.com/typescript-eslint/typescript-eslint',
    licenseType: 'BSD-2-Clause',
    licenseUrl:
      'https://raw.githubusercontent.com/typescript-eslint/typescript-eslint/main/LICENSE',
    version: '^5.37.0',
    title: '@typescript-eslint/parser',
  },
  typescript: {
    homePageUrl: 'https://www.typescriptlang.org/',
    licenseType: 'Apache-2.0',
    licenseUrl:
      'https://raw.githubusercontent.com/microsoft/TypeScript/main/LICENSE.txt',
    version: '^4.8.3',
    title: 'Typescript',
  },
};

const htmlStyles = `
<style>
  pre {
   word-wrap: break-word;
   white-space: pre-wrap;
   font-size: 45px;
   font-family: initial;
  }
   body {
     background-color: white;
   }
</style>`;

const OpenSourceUsed: FC = () => {
  const { t } = useTranslation();
  const [licenseHTML, setLicenseHTML] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const showLicense = async (licenseUrlLocal: string) => {
    const response = await fetch(licenseUrlLocal);
    const text = await response.text();
    const html = `
<html>
  ${htmlStyles}
  <pre>
    ${text}
  </pre>
</html>`;

    setLicenseHTML(html);
    setModalVisible(true);
  };

  const openHomePage = (homePageUrl: string) => {
    Linking.openURL(homePageUrl);
  };

  const LicenseItem: FC<{ license: License }> = ({
    license: { homePageUrl, title, licenseUrl: licenseUrlLocal },
  }) => (
    <YStack key={`${homePageUrl}`} my="$2">
      <Text fontWeight="bold">{title}</Text>

      <XStack my="$2">
        <Text
          style={styles.textLink}
          mr="$3"
          onPress={() => showLicense(licenseUrlLocal)}
        >
          {t('open_source:show_license')}
        </Text>

        <Text style={styles.textLink} onPress={() => openHomePage(homePageUrl)}>
          {t('open_source:homepage')}
        </Text>
      </XStack>
    </YStack>
  );

  return (
    <ScrollView flex={1} bg="$white" p={15}>
      <Box flex={1}>
        {Object.values({ ...licenses, ...devLicenses }).map((license, key) => {
          return <LicenseItem key={key} license={license} />;
        })}
      </Box>

      <Modal animationType="fade" transparent visible={modalVisible}>
        <Box style={styles.modal}>
          <YStack style={styles.modalContainer}>
            <Box onPress={() => setModalVisible(false)} ai="flex-end" m="$2">
              <CloseIcon size={22} color={colors.mediumGrey} />
            </Box>

            <WebView style={styles.webView} source={{ html: licenseHTML }} />
          </YStack>
        </Box>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textLink: {
    textDecorationLine: 'underline',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    height: '80%',
    borderRadius: 10,
  },
  webView: {
    flex: 1,
    margin: 15,
    marginTop: 0,
  },
});

export default OpenSourceUsed;
