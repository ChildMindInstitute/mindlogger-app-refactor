import { Report } from '@app/entities/activity/lib/types/activityReportSettings';
import { ILogger } from '@app/shared/lib/types/logger';

import { IScoreConditionsEvaluator } from './IScoreConditionsEvaluator';
import { IScoresCalculator } from './IScoresCalculator';
import { IScoresExtractor } from './IScoresExtractor';
import { Answers } from '../lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '../lib/types/payload';
import { ScoreRecord } from '../lib/types/summary';

export class ScoresExtractor implements IScoresExtractor {
  private conditionsEvaluator: IScoreConditionsEvaluator;

  private scoresCalculator: IScoresCalculator;

  private logger: ILogger;

  constructor(
    conditionsEvaluator: IScoreConditionsEvaluator,
    scoresCalculator: IScoresCalculator,
    logger: ILogger,
  ) {
    this.conditionsEvaluator = conditionsEvaluator;
    this.scoresCalculator = scoresCalculator;
    this.logger = logger;
  }

  private extractInternal(
    pipelineItems: PipelineItem[],
    answers: Answers,
    scoreSettings: Report,
  ): ScoreRecord | null {
    const score: number | null = this.scoresCalculator.calculate(
      pipelineItems,
      answers,
      scoreSettings,
    );

    if (score === null) {
      return null;
    }

    const conditionLogicResults: Array<boolean> = scoreSettings.conditionalLogic
      .filter(x => x.flagScore)
      .map(conditions => this.conditionsEvaluator.evaluate(conditions, score));

    return {
      name: scoreSettings.name,
      value: score,
      flagged: conditionLogicResults.some(x => x),
    };
  }

  public extract(
    pipelineItems: PipelineItem[],
    answers: Answers,
    settings: Array<Report>,
    logActivityName: string,
  ): Array<ScoreRecord> {
    const result: Array<ScoreRecord> = [];

    let settingsIndex = 0;

    this.logger.log(
      `[ScoresExtractor.extract]: Extracting scores for activity '${logActivityName}'`,
    );

    for (const scoreSettings of settings) {
      if (
        scoreSettings.type === 'score' &&
        scoreSettings.scoringType === 'score'
      ) {
        // Skip report scores that are not configured as raw scores
        continue;
      }

      const logScore = `'${scoreSettings.name}' for settings with index '${settingsIndex}'`;

      try {
        this.logger.log(
          `[ScoresExtractor.extract]: Extracting score ${logScore}`,
        );

        const score: ScoreRecord | null = this.extractInternal(
          pipelineItems,
          answers,
          scoreSettings,
        );

        if (score !== null) {
          result.push(score);
        }
      } catch (error) {
        this.logger.warn(
          `[ScoresExtractor.extract]: Error occurred during extracting score ${logScore}\n\nInternal Error:\n\n${error}`,
        );
        result.push({
          name: '[Error occurred]',
          value: 0,
          flagged: false,
        });
      } finally {
        settingsIndex++;
      }
    }

    return result;
  }
}
