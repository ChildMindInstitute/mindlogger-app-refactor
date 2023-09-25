import { useEffect, useRef } from 'react';
import { StyleSheet, StatusBar } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StaticNavigationPanel } from '@app/features/pass-survey';
import { AlertList } from '@entities/alert';
import { ScoreList } from '@entities/score';
import { Box, Text, ScrollView, YStack } from '@shared/ui';

import { useSummaryData } from '../model';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;
  order: number;
  onFinish: () => void;
};

function Summary({
  onFinish,
  appletId,
  flowId,
  activityId,
  eventId,
  order,
}: Props) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const summaryData = useSummaryData({
    activityId,
    appletId,
    eventId,
    order,
    flowId,
  });

  const { alerts, scores } = summaryData || {};

  const initialized = !!summaryData;

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (
      initialized &&
      !summaryData.alerts.length &&
      !summaryData.scores.length
    ) {
      onFinishRef.current();
    }
  }, [initialized, summaryData]);

  if (!initialized) {
    return (
      <Box flex={1} mb={bottom} bg="$white">
        <Box style={styles.scrollView} mx={20} />

        <StaticNavigationPanel
          stepper={{ onEndReached: onFinish }}
          mt={16}
          minHeight={24}
          mb={bottom ? 0 : 16}
        />
      </Box>
    );
  }

  return (
    <Box flex={1} mb={bottom} bg="$white">
      <StatusBar hidden />

      <Text fontWeight="500" fontSize={32} mx={20} mb={20}>
        {t('activity_summary:report_summary')}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollView} mx={20}>
        <AlertList alerts={alerts!} />

        <YStack space={40} pb={30}>
          {scores!.map((activityScore, index) => (
            <ScoreList
              key={index}
              label={activityScore.activityName}
              scores={activityScore.scores}
            />
          ))}
        </YStack>
      </ScrollView>

      <StaticNavigationPanel
        stepper={{ onEndReached: onFinish }}
        mt={16}
        minHeight={24}
        mb={bottom ? 0 : 16}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  alertIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  scoreAlertIcon: {
    marginRight: 7,
  },
});

export default Summary;
