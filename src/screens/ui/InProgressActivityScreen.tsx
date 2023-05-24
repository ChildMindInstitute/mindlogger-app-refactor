import { FC } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FlowSurvey } from '@app/widgets/survey';
import { RootStackParamList } from '@screens/config';
import { Box } from '@shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, eventId, entityId, entityType } = route.params;

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
