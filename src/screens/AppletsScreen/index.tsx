import { FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppletList } from '@app/entities/applet';
import { Box, ImageBackground, ScrollView, Text, XStack } from '@shared/ui';

const AppletsScreen: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <Box bg="$secondary" flex={1}>
      <ImageBackground>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Box flex={1} pt={12} pb={34}>
            <AppletList flex={1} px={14} mb={28} />

            <XStack jc="center">
              <TouchableOpacity onPress={() => navigate('AboutApp')}>
                <Text color="$primary" fontSize={16} fontWeight="700">
                  {t('applet_list_component:about_title')}
                </Text>
              </TouchableOpacity>
            </XStack>
          </Box>
        </ScrollView>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default AppletsScreen;
