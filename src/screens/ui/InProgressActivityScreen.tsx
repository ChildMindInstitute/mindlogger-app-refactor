import { FC, useEffect } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import { bannerActions } from '@app/entities/banner/model/slice';
import { useUpcomingNotificationsObserver } from '@app/entities/notification/lib/hooks/useUpcomingNotificationsObserver';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getSupportsMobile } from '@app/shared/lib/utils/responseTypes';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box } from '@app/shared/ui/base';
import { useBaseInfo } from '@app/widgets/activity-group/model/hooks/useBaseInfo';
import { FlowSurvey } from '@app/widgets/survey/ui/FlowSurvey';
import { IS_ANDROID, OS_MAJOR_VERSION } from '@shared/lib/constants';

import { RootStackParamList } from '../config/types';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

export const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { appletId, eventId, entityId, entityType, targetSubjectId } =
    route.params;

  useUpcomingNotificationsObserver(eventId, entityId, targetSubjectId);

  const { data, isLoading } = useBaseInfo(appletId);
  const { responseTypes, title } = data || {};
  const entityResponseTypes = responseTypes?.[entityId];
  const isAppSupportedEntity = entityResponseTypes?.every(getSupportsMobile);

  useEffect(() => {
    if (!isAppSupportedEntity && !isLoading) {
      navigation.replace('AppletDetails', { appletId, title: title || '' });
    }
  }, [appletId, isAppSupportedEntity, isLoading, navigation, title]);

  useEffect(() => {
    const callback = navigation.addListener('beforeRemove', () => {
      Emitter.emit<AutocompletionEventOptions>('autocomplete', {
        checksToExclude: ['in-progress-activity'],
        logTrigger: 'close-entity',
      });
    });

    return () => {
      navigation.removeListener('beforeRemove', callback);
    };
  }, [navigation]);

  useOnFocus(() => {
    // Match topmost container background color
    dispatch(bannerActions.setBannersBg(palette.white));
  });

  const { top } = useSafeAreaInsets();

  return (
    // There's weird white space on Android because of the safe area insets
    // We can remove this top margin when this issue is resolved:
    // https://github.com/react-navigation/react-navigation/issues/12608
    <Box
      flex={1}
      backgroundColor="$white"
      marginTop={IS_ANDROID && OS_MAJOR_VERSION >= 15 ? top : 0}
    >
      {isLoading || !isAppSupportedEntity ? (
        <ActivityIndicator />
      ) : (
        <FlowSurvey
          appletId={appletId}
          entityId={entityId}
          entityType={entityType}
          eventId={eventId}
          targetSubjectId={targetSubjectId}
          onClose={() => navigation.goBack()}
        />
      )}
    </Box>
  );
};
