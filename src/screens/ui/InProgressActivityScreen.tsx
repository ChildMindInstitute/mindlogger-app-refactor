import { FC, useEffect } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AutocompletionEventOptions } from '@app/abstract/lib';
import { Emitter } from '@app/shared/lib';
import { FlowSurvey } from '@app/widgets/survey';
import { useUpcomingNotificationsObserver } from '@entities/notification';
import { RootStackParamList } from '@screens/config';
import { Box } from '@shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, eventId, entityId, entityType, targetSubjectId } =
    route.params;

  useUpcomingNotificationsObserver(eventId, entityId, targetSubjectId);

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
      <FlowSurvey
        appletId={appletId}
        entityId={entityId}
        entityType={entityType}
        eventId={eventId}
        targetSubjectId={targetSubjectId}
        onClose={() => navigation.goBack()}
      />
    </Box>
  );
};

export default InProgressActivityScreen;
