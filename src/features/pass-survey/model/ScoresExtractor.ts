import { Report } from '@app/entities/activity';
import { ILogger, Logger } from '@app/shared/lib';

import ScoreConditionsEvaluator, {
  IScoreConditionsEvaluator,
} from './ScoreConditionsEvaluator';
import ScoresCalculator, { IScoresCalculator } from './ScoresCalculator';
import { Answers, PipelineItem, ScoreRecord } from '../lib';

export class ScoresExtractor {
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

    for (let scoreSettings of settings) {
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
          `[ScoresExtractor.extract]: Error occurred during extracting score ${logScore}\n\nInternal Error:\n\n` +
            error!.toString(),
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

export default new ScoresExtractor(
  ScoreConditionsEvaluator,
  ScoresCalculator,
  Logger,
);
