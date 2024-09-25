import { useCallback, useMemo } from 'react';

import {
  AnswerAlerts,
  ScoreRecord,
} from '@app/features/pass-survey/lib/types/summary';
import { getDefaultAlertsExtractor } from '@app/features/pass-survey/model/alertsExtractorInstance';
import { useActivityState } from '@app/features/pass-survey/model/hooks/useActivityState';
import { getDefaultScoresExtractor } from '@app/features/pass-survey/model/scoresExtractorInstance';
import { useActivityInfo } from '@app/shared/lib/hooks/useActivityInfo';

import { useFlowState } from './useFlowState';
import { ActivityScores } from '../../lib/useFlowStorageRecord';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;
  targetSubjectId: string | null;
  order: number;
};

type UIScore = {
  label: string;
  value: number;
  highlighted: boolean;
};

type UIActivityScores = {
  activityName: string;
  scores: Array<UIScore>;
};

type UISummaryData = {
  alerts: string[];
  scores: UIActivityScores[];
};

export const useSummaryData = ({
  appletId,
  flowId,
  activityId,
  eventId,
  targetSubjectId,
  order,
}: Props): UISummaryData | null => {
  const { getName: getActivityName } = useActivityInfo();

  const { activityStorageRecord } = useActivityState({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const { flowSummaryData } = useFlowState({
    appletId,
    eventId,
    flowId,
    targetSubjectId,
  });

  const getSummaryForCurrentActivity = useCallback(
    (logActivityName: string) => {
      const activityRecord = activityStorageRecord!;

      if (!activityRecord.hasSummary) {
        return { alerts: [], scores: [] };
      }

      const items = activityRecord.items;
      const answers = activityRecord.answers;
      const reportSettings = activityRecord.scoreSettings;

      const extractedAlerts: AnswerAlerts =
        getDefaultAlertsExtractor().extractForSummary(
          items,
          answers,
          logActivityName,
        );

      const scoreRecords: Array<ScoreRecord> =
        getDefaultScoresExtractor().extract(
          items,
          answers,
          reportSettings,
          logActivityName,
        );

      return { alerts: extractedAlerts, scores: scoreRecords };
    },
    [activityStorageRecord],
  );

  const summaryData = useMemo<UISummaryData | null>(() => {
    if (!activityStorageRecord) {
      return null;
    }

    const currentActivityName = getActivityName(activityId)!;

    const { alerts: currentAlerts, scores: currentScores } =
      getSummaryForCurrentActivity(currentActivityName);

    let activityIds: string[] = Object.keys(flowSummaryData);

    activityIds = activityIds.sort((a1Id, a2Id) => {
      return flowSummaryData[a1Id].order - flowSummaryData[a2Id].order;
    });

    const fullAlertsList: AnswerAlerts = [];
    const fullScoresList: ActivityScores[] = [];

    for (const aid of activityIds) {
      const { alerts, scores } = flowSummaryData[aid];
      fullAlertsList.push(...alerts);
      fullScoresList.push(scores);
    }

    fullAlertsList.push(...currentAlerts);

    fullScoresList.push({
      activityName: currentActivityName,
      scores: currentScores,
    });

    const result: UISummaryData = {
      alerts: fullAlertsList.map(x => x.message),
      scores: fullScoresList
        .filter(x => x.scores.length)
        .map(x => ({
          activityName: x.activityName,
          scores: x.scores.map(s => ({
            label: s.name,
            value: s.value,
            highlighted: s.flagged,
          })),
        })),
    };
    return result;
  }, [
    activityStorageRecord,
    getActivityName,
    activityId,
    getSummaryForCurrentActivity,
    flowSummaryData,
  ]);

  return summaryData;
};
