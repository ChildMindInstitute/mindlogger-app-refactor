import { ScoreConditionalLogic } from '@app/entities/activity/lib/types/activityReportSettings';

export interface IScoreConditionsEvaluator {
  evaluate(settings: ScoreConditionalLogic, score: number): boolean;
}
