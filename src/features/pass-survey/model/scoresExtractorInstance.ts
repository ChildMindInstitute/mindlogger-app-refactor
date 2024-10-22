import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { getDefaultScoreConditionsEvaluator } from './scoreConditionsEvaluatorInstance';
import { getDefaultScoresCalculator } from './scoresCalculatorInstance';
import { ScoresExtractor } from './ScoresExtractor';

let instance: ScoresExtractor;
export const getDefaultScoresExtractor = () => {
  if (!instance) {
    instance = new ScoresExtractor(
      getDefaultScoreConditionsEvaluator(),
      getDefaultScoresCalculator(),
      getDefaultLogger(),
    );
  }
  return instance;
};
