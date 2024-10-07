import { Report } from '@app/entities/activity/lib/types/activityReportSettings';

import { Answers } from '../lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '../lib/types/payload';

export interface IScoresCalculator {
  calculate(
    pipelineItems: PipelineItem[],
    answers: Answers,
    settings: Report,
  ): number | null;
}
