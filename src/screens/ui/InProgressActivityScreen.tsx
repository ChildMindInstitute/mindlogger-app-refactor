import { FC, useEffect } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import { useUpcomingNotificationsObserver } from '@app/entities/notification/lib/hooks/useUpcomingNotificationsObserver';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getSupportsMobile } from '@app/shared/lib/utils/responseTypes';
import { Box } from '@app/shared/ui/base';
import { Spinner } from '@app/shared/ui/Spinner';
import { StatusBar } from '@app/shared/ui/StatusBar';
import { useBaseInfo } from '@app/widgets/activity-group/model/hooks/useBaseInfo';
import { FlowSurvey } from '@app/widgets/survey/ui/FlowSurvey';
import { IS_ANDROID, OS_MAJOR_VERSION } from '@shared/lib/constants';

import { RootStackParamList } from '../config/types';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

export const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
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

  const { top } = useSafeAreaInsets();

  return (
    // There's weird white space on Android because of the safe area insets
    // We can remove this top margin when this issue is resolved:
    // https://github.com/react-navigation/react-navigation/issues/12608
    <Box flex={1} marginTop={IS_ANDROID && OS_MAJOR_VERSION >= 15 ? top : 0}>
      <StatusBar hidden />

      {isLoading || !isAppSupportedEntity ? (
        <Spinner withOverlay />
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
