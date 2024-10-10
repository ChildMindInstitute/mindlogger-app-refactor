import { ScoresCalculator } from './ScoresCalculator';

let instance: ScoresCalculator;
export const getDefaultScoresCalculator = () => {
  if (!instance) {
    instance = new ScoresCalculator();
  }
  return instance;
};
