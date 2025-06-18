import { useEffect, useRef } from 'react';
import { StyleSheet, StatusBar } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertList } from '@app/entities/alert/ui/AlertList';
import { bannerActions } from '@app/entities/banner/model/slice';
import { ScoreList } from '@app/entities/score/ui/ScoreList';
import { StaticNavigationPanel } from '@app/features/pass-survey/ui/StaticNavigationPanel';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
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
  const dispatch = useAppDispatch();
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

  useOnFocus(() => {
    // Match topmost container background color
    dispatch(bannerActions.setBannersBg(colors.white));
  });

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

      <Text
        fontWeight="400"
        fontSize={32}
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
