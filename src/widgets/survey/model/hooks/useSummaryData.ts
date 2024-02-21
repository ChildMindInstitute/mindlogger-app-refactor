import { useCallback, useMemo } from 'react';

import {
  AnswerAlerts,
  PassSurveyModel,
  ScoreRecord,
} from '@app/features/pass-survey';
import { useActivityInfo } from '@app/shared/lib';

import { useFlowState } from './useFlowState';
import { ActivityScores } from '../../lib';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;
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
  order,
}: Props): UISummaryData | null => {
  const { getName: getActivityName } = useActivityInfo();

  const { activityStorageRecord } = PassSurveyModel.useActivityState({
    appletId,
    activityId,
    eventId,
    order,
  });

  const { flowSummaryData } = useFlowState({ appletId, eventId, flowId });

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
        PassSurveyModel.AlertsExtractor.extractForSummary(
          items,
          answers,
          logActivityName,
        );

      const scoreRecords: Array<ScoreRecord> =
        PassSurveyModel.ScoresExtractor.extract(
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

    for (let aid of activityIds) {
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
