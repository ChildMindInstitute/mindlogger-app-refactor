import { Report } from '@app/entities/activity';
import { Calculator } from '@app/shared/lib';

import {
  Answer,
  Answers,
  CheckboxPipelineItem,
  CheckboxResponse,
  PipelineItem,
  RadioPipelineItem,
  RadioResponse,
  SliderPipelineItem,
  SliderResponse,
} from '../lib';

export interface IScoresCalculator {
  calculate(
    pipelineItems: PipelineItem[],
    answers: Answers,
    settings: Report,
  ): number | null;
}

export class ScoresCalculator implements IScoresCalculator {
  constructor() {}

  private collectScoreForRadio(
    radioItem: RadioPipelineItem,
    answer: Answer,
  ): number | null {
    const radioAnswer = answer.answer as RadioResponse;

    if (radioAnswer == null) {
      return null;
    }

    const option = radioItem.payload.options.find(
      o => o.value === radioAnswer.value,
    );

    return option ? option.score : null;
  }

  private collectScoreForCheckboxes(
    checkboxItem: CheckboxPipelineItem,
    answer: Answer,
  ): number | null {
    const checkboxAnswers = answer.answer as CheckboxResponse;

    if (checkboxAnswers == null) {
      return null;
    }

    const scores: number[] = checkboxItem.payload.options
      .map<number | null>(option => {
        const foundAnswer = checkboxAnswers?.find(checkboxAnswer => {
          return checkboxAnswer.value === option.value;
        });

        return foundAnswer ? option.score : null;
      })
      .filter(x => x != null)
      .map(x => x!);

    return Calculator.sum(scores);
  }

  private collectScoreForSlider(
    sliderItem: SliderPipelineItem,
    answer: Answer,
  ): number | null {
    const sliderAnswer: number | null = answer.answer as SliderResponse;

    if (sliderAnswer == null) {
      return null;
    }

    if (
      sliderAnswer < sliderItem.payload.minValue ||
      sliderAnswer > sliderItem.payload.maxValue
    ) {
      return null;
    }

    const isFloat = Math.floor(sliderAnswer) !== sliderAnswer;

    if (isFloat) {
      return null;
    }

    const valueIndex = sliderAnswer - sliderItem.payload.minValue;

    const scores: number[] = sliderItem.payload.scores;

    return scores[valueIndex] ?? null;
  }

  private collectScoreForItem(
    item: PipelineItem,
    answer: Answer,
  ): number | null {
    if (answer == null) {
      return null;
    }

    switch (item.type) {
      case 'Slider':
        return this.collectScoreForSlider(item, answer);
      case 'Radio':
        return this.collectScoreForRadio(item, answer);
      case 'Checkbox':
        return this.collectScoreForCheckboxes(item, answer);
      default:
        return null;
    }
  }

  private collectActualScores(
    pipelineItems: PipelineItem[],
    selectedItems: string[],
    answers: Answers,
  ): Array<number | null> {
    const scores: Array<number | null> = pipelineItems.map(
      (item: PipelineItem, step: number) => {
        if (!selectedItems.includes(item.name!)) {
          return null;
        }

        const answer = answers[step];

        const result: number | null = this.collectScoreForItem(item, answer);

        return result;
      },
    );
    return scores;
  }

  private collectMaxScoresInternal(
    pipelineItems: PipelineItem[],
    selectedItems: string[],
  ): Array<number | null> {
    const scores: Array<number | null> = pipelineItems.map(
      (item: PipelineItem) => {
        if (!selectedItems.includes(item.name!)) {
          return null;
        }

        switch (item.type) {
          case 'Radio': {
            const allScores = item.payload.options
              .map(x => x.score)
              .filter(x => x != null)
              .map(x => x!);
            return Math.max(...allScores);
          }
          case 'Checkbox': {
            const allScores = item.payload.options
              .map(x => x.score)
              .filter(x => x != null)
              .map(x => x!);
            return Calculator.sum(allScores);
          }
          case 'Slider': {
            if (!item.payload.scores.some(x => x >= 0)) {
              return null;
            }
            return Math.max(...item.payload.scores);
          }
          default:
            return null;
        }
      },
    );

    return scores;
  }

  private collectMaxScores(
    pipelineItems: PipelineItem[],
    selectedItems: string[],
  ): Array<number | null> {
    try {
      return this.collectMaxScoresInternal(pipelineItems, selectedItems);
    } catch (error) {
      throw new Error(
        `[ScoresCalculator:collectMaxScores]: Error occurred:\n\n${error}`,
      );
    }
  }

  public calculate(
    pipelineItems: PipelineItem[],
    answers: Answers,
    settings: Report,
  ): number | null {
    let scores: Array<number | null>;

    try {
      scores = this.collectActualScores(
        pipelineItems,
        settings.includedItems,
        answers,
      );
    } catch (error) {
      throw new Error(
        `[ScoresCalculator.calculate]: Error occurred during collecting actual scores:\n\n${error}`,
      );
    }

    const filteredScores: number[] = scores
      .filter(x => x !== null)
      .map(x => x!);

    if (!filteredScores.length) {
      return null;
    }

    switch (settings.calculationType) {
      case 'average':
        return Calculator.avg(filteredScores);
      case 'sum':
        return Calculator.sum(filteredScores);
      case 'percentage': {
        const maxScores = this.collectMaxScores(
          pipelineItems,
          settings.includedItems,
        );

        const filteredMaxScores = maxScores
          .filter(x => x !== null)
          .map(x => x!);

        const currentScore = Calculator.sum(filteredScores);
        const sumOfMaxScores = Calculator.sum(filteredMaxScores);

        if (sumOfMaxScores === 0) {
          return 0;
        }

        return (100 * currentScore) / sumOfMaxScores;
      }
      default:
        return null;
    }
  }
}

export default new ScoresCalculator();
