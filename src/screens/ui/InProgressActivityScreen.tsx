import { FC, useEffect } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import { useUpcomingNotificationsObserver } from '@app/entities/notification/lib/hooks/useUpcomingNotificationsObserver';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getSupportsApp } from '@app/shared/lib/utils/responseTypes';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box } from '@app/shared/ui/base';
import { useBaseInfo } from '@app/widgets/activity-group/model/hooks/useBaseInfo';
import { FlowSurvey } from '@app/widgets/survey/ui/FlowSurvey';

import { RootStackParamList } from '../config/types';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

export const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, eventId, entityId, entityType, targetSubjectId } =
    route.params;

  useUpcomingNotificationsObserver(eventId, entityId, targetSubjectId);

  const { data, isLoading } = useBaseInfo(appletId);
  const { responseTypes, title } = data || {};
  const entityResponseTypes = responseTypes?.[entityId];
  const isAppSupportedEntity = entityResponseTypes?.every(getSupportsApp);

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

  return (
    <Box flex={1} backgroundColor="white">
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
