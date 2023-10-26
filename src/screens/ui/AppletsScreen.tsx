import { FC, useCallback, useLayoutEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { StoreProgress } from '@app/abstract/lib';
import { UploadRetryBanner } from '@app/entities/activity';
import { NotificationModel } from '@app/entities/notification';
import { LogTrigger } from '@app/shared/api';
import { Logger, useAppSelector } from '@app/shared/lib';
import { Applet, AppletList, AppletModel } from '@entities/applet';
import { IdentityModel } from '@entities/identity';
import { AppletsRefresh, AppletsRefreshModel } from '@features/applets-refresh';
import {
  Box,
  ImageBackground,
  Text,
  TouchableOpacity,
  XStack,
} from '@shared/ui';

type SelectedApplet = Pick<Applet, 'id' | 'displayName'>;

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

  const navigateAppletDetails: (applet: SelectedApplet) => void = useCallback(
    ({ id, displayName }) =>
      navigate('AppletDetails', { appletId: id, title: displayName }),
    [navigate],
  );

  AppletsRefreshModel.useAutomaticRefreshOnMount(async () => {
    await NotificationModel.NotificationRefreshService.refresh(
      queryClient,
      storeProgress,
      LogTrigger.FirstAppRun,
    );
    Logger.send();
  });

  return (
    <Box bg="$secondary" flex={1}>
      <UploadRetryBanner />

      <ImageBackground>
        <Box flex={1} pt={12} pb={34}>
          <AppletList
            flex={1}
            px={14}
            refreshControl={<AppletsRefresh />}
            ListFooterComponent={<AboutAppLink />}
            onAppletPress={navigateAppletDetails}
          />
        </Box>
      </ImageBackground>
    </Box>
  );
};

const AboutAppLink = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <XStack jc="center">
      <TouchableOpacity onPress={() => navigate('AboutApp')}>
        <Text color="$primary" fontSize={16} fontWeight="700">
          {t('applet_list_component:about_title')}
        </Text>
      </TouchableOpacity>
    </XStack>
  );
};

export default AppletsScreen;
