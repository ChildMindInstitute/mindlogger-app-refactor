import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertList } from '@app/entities/alert/ui/AlertList';
import { ScoreList } from '@app/entities/score/ui/ScoreList';
import { StaticNavigationPanel } from '@app/features/pass-survey/ui/StaticNavigationPanel';
import { Box, YStack } from '@app/shared/ui/base';
import { ScrollView } from '@app/shared/ui/ScrollView';
import { Text } from '@app/shared/ui/Text';

import { useSummaryData } from '../model/hooks/useSummaryData';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
  order: number;
  onFinish: () => void;
};

export function Summary({
  onFinish,
  appletId,
  flowId,
  activityId,
  eventId,
  targetSubjectId,
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
    targetSubjectId,
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
      <Box flex={1} mb={bottom}>
        <Box style={styles.scrollView} mx={20} />

        <StaticNavigationPanel
          stepper={{ onEndReached: onFinish }}
          p={16}
          pb={16 + bottom}
          minHeight={24}
        />
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Text
        fontSize={28}
        lineHeight={36}
        mx={20}
        mb={20}
        accessibilityLabel="report_summary-text"
      >
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
        p={16}
        pb={16 + bottom}
        minHeight={24}
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
