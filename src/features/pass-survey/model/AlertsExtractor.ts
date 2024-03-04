import { ILogger, Logger } from '@app/shared/lib';
import { canItemHaveAnswer } from '@app/widgets/survey/model';

import {
  Answer,
  AnswerAlerts,
  Answers,
  CheckboxPipelineItem,
  CheckboxResponse,
  PipelineItem,
  RadioPipelineItem,
  RadioResponse,
  SliderPipelineItem,
  SliderResponse,
  StackedCheckboxPipelineItem,
  StackedCheckboxResponse,
  StackedRadioPipelineItem,
  StackedRadioResponse,
  StackedSliderPipelineItem,
  StackedSliderResponse,
} from '../lib';

export class AlertsExtractor {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public extractFromRadio(
    radioItem: RadioPipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    const alerts: AnswerAlerts = [];

    const radioAnswer = answer.answer as RadioResponse;

    const alertOption = radioItem.payload.options.find(
      o => o.alert && o.value === radioAnswer.value,
    );

    if (alertOption) {
      alerts.push({
        activityItemId: radioItem.id!,
        message: alertOption!.alert!.message,
      });
    }

    return alerts;
  }

  public extractFromCheckbox(
    checkboxItem: CheckboxPipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    const checkboxAnswers = answer.answer as CheckboxResponse;
    const alertOptions = checkboxItem.payload.options.filter(o => {
      const checkboxAnswerAlert = checkboxAnswers?.find(checkboxAnswer => {
        return checkboxAnswer.value === o.value;
      });

      return checkboxAnswerAlert && o.alert;
    });

    const alerts = alertOptions
      .filter(alertOption => !!alertOption.alert)
      .map(alertOption => {
        return {
          activityItemId: checkboxItem.id!,
          message: alertOption.alert!.message,
        };
      });

    return alerts;
  }

  public extractFromSlider(
    sliderItem: SliderPipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    const sliderAnswer = answer.answer as SliderResponse;
    const isContinuousSlider = sliderItem.payload.isContinuousSlider;

    if (!sliderItem.payload.alerts || sliderAnswer === null) {
      return [];
    }

    const alerts: AnswerAlerts = [];

    sliderItem.payload.alerts.forEach(alert => {
      const isValueInRange =
        alert.minValue !== null &&
        alert.maxValue !== null &&
        sliderAnswer >= alert.minValue &&
        sliderAnswer <= alert.maxValue;

      if (!isContinuousSlider && alert.value === sliderAnswer) {
        alerts.push({
          activityItemId: sliderItem.id!,
          message: alert.message,
        });
      }
      if (isContinuousSlider && isValueInRange) {
        alerts.push({
          activityItemId: sliderItem.id!,
          message: alert.message,
        });
      }
    });

    return alerts;
  }

  public extractFromStackedRadio(
    stackedRadioItem: StackedRadioPipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    const stackedRadioAnswer = answer.answer as StackedRadioResponse;

    const alerts: AnswerAlerts = [];

    stackedRadioItem.payload.dataMatrix.forEach(row => {
      row.options.forEach(option => {
        stackedRadioAnswer.forEach(itemAnswer => {
          if (
            itemAnswer?.rowId === row.rowId &&
            itemAnswer.id === option.optionId!
          ) {
            option.alert &&
              alerts.push({
                activityItemId: stackedRadioItem.id!,
                message: option.alert!.message,
              });
          }
        });
      });
    });

    return alerts;
  }

  public extractFromStackedCheckbox(
    stackedCheckboxItem: StackedCheckboxPipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    const stackedCheckboxAnswer = answer.answer as StackedCheckboxResponse;

    if (!stackedCheckboxAnswer) {
      return [];
    }

    const alerts: AnswerAlerts = [];

    stackedCheckboxItem.payload.dataMatrix.forEach((row, rowIndex) => {
      const columnAnswers = stackedCheckboxAnswer[rowIndex];

      if (columnAnswers?.length) {
        row.options.forEach(option => {
          columnAnswers.forEach(cellAnswer => {
            if (cellAnswer.id === option.optionId!) {
              option.alert &&
                alerts.push({
                  activityItemId: stackedCheckboxItem.id!,
                  message: option.alert!.message,
                });
            }
          });
        });
      }
    });

    return alerts;
  }

  public extractFromStackedSlider(
    sliderItem: StackedSliderPipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    const sliderAnswer = answer.answer as StackedSliderResponse;

    if (!sliderAnswer) {
      return [];
    }

    const alerts: AnswerAlerts = [];

    sliderItem.payload.rows.forEach((row, rowIndex) => {
      if (row.alerts) {
        row.alerts.forEach(alert => {
          if (alert.value === sliderAnswer[rowIndex]) {
            alerts.push({
              activityItemId: sliderItem.id!,
              message: alert.message,
            });
          }
        });
      }
    });

    return alerts;
  }

  private extractFromItem(
    pipelineItem: PipelineItem,
    answer: Answer,
  ): AnswerAlerts {
    switch (pipelineItem.type) {
      case 'Radio':
        return this.extractFromRadio(pipelineItem, answer);

      case 'Checkbox':
        return this.extractFromCheckbox(pipelineItem, answer);

      case 'StackedRadio':
        return this.extractFromStackedRadio(pipelineItem, answer);

      case 'StackedCheckbox':
        return this.extractFromStackedCheckbox(pipelineItem, answer);

      case 'Slider':
        return this.extractFromSlider(pipelineItem, answer);

      case 'StackedSlider':
        return this.extractFromStackedSlider(pipelineItem, answer);

      default:
        return [];
    }
  }

  private extractInternal(
    pipelineItems: PipelineItem[],
    answers: Answers,
  ): AnswerAlerts {
    const alerts = pipelineItems
      .flatMap((pipelineItem, step) => {
        const canHaveAnswer = canItemHaveAnswer(pipelineItem.type);

        if (canHaveAnswer && answers[step]) {
          const answer = answers[step];

          return this.extractFromItem(pipelineItem, answer);
        }
      })
      .filter(x => x != null)
      .map(x => x!);

    return alerts;
  }

  public extractForSummary(
    pipelineItems: PipelineItem[],
    answers: Answers,
    logActivityName: string,
  ): AnswerAlerts {
    try {
      this.logger.log(
        `[AlertsExtractor.extractForSummary]: Extracting alerts for activity '${logActivityName}'`,
      );

      return this.extractInternal(pipelineItems, answers);
    } catch (error) {
      this.logger.warn(
        '[AlertsExtractor.extractForSummary]: Error occurred: \n\n' +
          error!.toString(),
      );
      return [
        {
          message: '[Error occurred]',
          activityItemId: 'unknown',
        },
      ];
    }
  }
}

export default new AlertsExtractor(Logger);
