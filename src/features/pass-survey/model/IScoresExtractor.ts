import { Report } from '@app/entities/activity/lib/types/activityReportSettings';

import { Answers } from '../lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '../lib/types/payload';
import { ScoreRecord } from '../lib/types/summary';

export interface IScoresExtractor {
  extract(
    pipelineItems: PipelineItem[],
    answers: Answers,
    settings: Array<Report>,
    logActivityName: string,
  ): Array<ScoreRecord>;
}
