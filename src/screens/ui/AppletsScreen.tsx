import { FC, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { NotificationModel } from '@app/entities/notification';
import { LogTrigger } from '@app/shared/api';
import { useAppSelector } from '@app/shared/lib';
import { AppletList, AppletModel } from '@entities/applet';
import { IdentityModel } from '@entities/identity';
import { AppletsRefresh, AppletsRefreshModel } from '@features/applets-refresh';
import { Box, ImageBackground, ScrollView, Text, XStack } from '@shared/ui';

const AppletsScreen: FC = () => {
  const { t } = useTranslation();
  const { navigate, setOptions } = useNavigation();

  const userFirstName = useAppSelector(IdentityModel.selectors.selectFirstName);

  useLayoutEffect(() => {
    if (userFirstName) {
      setOptions({ title: `${t('additional:hi')} ${userFirstName}!` });
    }
  }, [t, userFirstName, setOptions]);

  const queryClient = useQueryClient();

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  AppletsRefreshModel.useAutomaticRefreshOnMount(() => {
    NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      LogTrigger.FirstAppRun,
    );
  });

  return (
    <Box bg="$secondary" flex={1}>
      <ImageBackground>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={<AppletsRefresh />}
        >
          <Box flex={1} pt={12} pb={34}>
            <AppletList
              flex={1}
              px={14}
              mb={28}
              onAppletPress={({ id, displayName }) =>
                navigate('AppletDetails', { appletId: id, title: displayName })
              }
            />

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
