import { FC, useEffect } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Emitter } from '@app/shared/lib';
import { FlowSurvey, SurveyModel } from '@app/widgets/survey';
import { useUpcomingNotificationsObserver } from '@entities/notification';
import { RootStackParamList } from '@screens/config';
import { Box } from '@shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, eventId, entityId, entityType } = route.params;

  useUpcomingNotificationsObserver(eventId, entityId);

  useEffect(() => {
    const callback = navigation.addListener('beforeRemove', () => {
      Emitter.emit<SurveyModel.AutocompletionExecuteOptions>('autocomplete', {
        checksToExclude: ['in-progress-activity'],
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
        onClose={() => navigation.goBack()}
      />
    </Box>
  );
};

export default InProgressActivityScreen;
