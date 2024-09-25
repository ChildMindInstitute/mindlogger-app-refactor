import { ScoreConditionsEvaluator } from './ScoreConditionsEvaluator';

let instance: ScoreConditionsEvaluator;
export const getDefaultScoreConditionsEvaluator = () => {
  if (!instance) {
    instance = new ScoreConditionsEvaluator();
  }
  return instance;
};
