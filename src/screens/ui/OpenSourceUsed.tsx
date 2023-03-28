import { FC, useState } from 'react';
import { Linking, StyleSheet, Modal } from 'react-native';

import { YStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

import { devLicenses, backendLicenses, licenses } from '@assets/licenses';
import { colors, generateLicenseHTML } from '@shared/lib';
import { Box, Text, XStack, ScrollView, CloseIcon } from '@shared/ui';

type License = {
  homePageUrl: string;
  licenseType: string;
  licenseUrl: string;
  version: string;
  title: string;
};

const arrayOfLicenses = Object.values({
  ...licenses,
  ...devLicenses,
  ...backendLicenses,
});

const generateHtmlFromUrl = generateLicenseHTML();

const OpenSourceUsed: FC = () => {
  const { t } = useTranslation();
  const [licenseHTML, setLicenseHTML] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const showLicense = async (licenseUrlLocal: string) => {
    const html = await generateHtmlFromUrl(licenseUrlLocal);

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
    <ScrollView bg="$white" flex={1} p={15}>
      <Box flex={1}>
        {arrayOfLicenses.map((license, key) => {
          return <LicenseItem key={key} license={license} />;
        })}
      </Box>

      <Modal transparent animationType="fade" visible={modalVisible}>
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
