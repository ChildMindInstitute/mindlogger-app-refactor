import { FC } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FlowSurvey } from '@app/widgets/survey';
import { RootStackParamList } from '@screens/config';
import { Box } from '@shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, activityId, eventId, flowId } = route.params;

  return (
    <Box flex={1} backgroundColor="white">
      <FlowSurvey
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        flowId={flowId}
        onClose={() => navigation.goBack()}
      />
    </Box>
  );
};

export default InProgressActivityScreen;
