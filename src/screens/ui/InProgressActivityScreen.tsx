import { FC } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useActivityAnswersMutation } from '@entities/activity';
import { ActivityStepper } from '@features/pass-survey';
import { RootStackParamList } from '@screens/config';
import { colors } from '@shared/lib';
import { BackButton, Box, CrossIcon, StatusBar } from '@shared/ui';

import ActivityPassedScreen from './ActivityPassedScreen';
import SendingAnswersScreen from './SendingAnswersScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, activityId, eventId } = route.params;
  const { bottom } = useSafeAreaInsets();

  const {
    mutate: sendAnswers,
    isLoading: isSendingAnswers,
    isSuccess: successSentAnswers,
  } = useActivityAnswersMutation();

  function completeActivity() {
    sendAnswers({
      appletId,
      appletHistoryVersion: '',
      activityId,
      answers: [],
    });
  }

  if (isSendingAnswers) {
    return <SendingAnswersScreen />;
  }

  if (successSentAnswers) {
    return (
      <ActivityPassedScreen
        onClose={() => {
          navigation.goBack();
        }}
      />
    );
  }

  return (
    <Box flex={1} backgroundColor="white" pb={bottom}>
      <StatusBar hidden />

      <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
        <CrossIcon color={colors.tertiary} size={30} />
      </BackButton>

      <Box flex={1}>
        <ActivityStepper
          appletId={appletId}
          activityId={activityId}
          eventId={eventId}
          onClose={() => navigation.goBack()}
          onFinish={completeActivity}
        />
      </Box>
    </Box>
  );
};

export default InProgressActivityScreen;
