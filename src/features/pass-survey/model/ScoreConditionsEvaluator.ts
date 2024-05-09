import { ScoreConditionalLogic } from '@app/entities/activity';

export interface IScoreConditionsEvaluator {
  evaluate(settings: ScoreConditionalLogic, score: number): boolean;
}

export class ScoreConditionsEvaluator implements IScoreConditionsEvaluator {
  constructor() {}

  private evaluateInternal(
    settings: ScoreConditionalLogic,
    score: number,
  ): boolean {
    const expressionResults: Array<boolean> = settings.conditions.map(
      condition => {
        switch (condition.type) {
          case 'BETWEEN':
            return (
              condition.payload.minValue < score &&
              score < condition.payload.maxValue
            );
          case 'EQUAL':
            return score === condition.payload.value;
          case 'GREATER_THAN':
            return score > condition.payload.value;
          case 'LESS_THAN':
            return score < condition.payload.value;
          case 'NOT_EQUAL':
            return score !== condition.payload.value;
          case 'OUTSIDE_OF':
            return (
              score < condition.payload.minValue ||
              score > condition.payload.maxValue
            );

          default:
            return false;
        }
      },
    );

    if (settings.match === 'all') {
      return expressionResults.every(x => x);
    }
    if (settings.match === 'any') {
      return expressionResults.some(x => x);
    }
    return false;
  }

  public evaluate(settings: ScoreConditionalLogic, score: number): boolean {
    try {
      return this.evaluateInternal(settings, score);
    } catch (error) {
      throw new Error(
        `[ScoreConditionsEvaluator.evaluate]: Error occurred:\n\n${error}`,
      );
    }
  }
}

export default new ScoreConditionsEvaluator();
