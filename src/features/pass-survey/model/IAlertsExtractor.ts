import { Answer, Answers } from '../lib/hooks/useActivityStorageRecord';
import {
  CheckboxPipelineItem,
  PipelineItem,
  RadioPipelineItem,
  SliderPipelineItem,
  StackedCheckboxPipelineItem,
  StackedRadioPipelineItem,
  StackedSliderPipelineItem,
} from '../lib/types/payload';
import { AnswerAlerts } from '../lib/types/summary';

export interface IAlertsExtractor {
  extractFromRadio(radioItem: RadioPipelineItem, answer: Answer): AnswerAlerts;

  extractFromCheckbox(
    checkboxItem: CheckboxPipelineItem,
    answer: Answer,
  ): AnswerAlerts;

  extractFromSlider(
    sliderItem: SliderPipelineItem,
    answer: Answer,
  ): AnswerAlerts;

  extractFromStackedRadio(
    stackedRadioItem: StackedRadioPipelineItem,
    answer: Answer,
  ): AnswerAlerts;

  extractFromStackedCheckbox(
    stackedCheckboxItem: StackedCheckboxPipelineItem,
    answer: Answer,
  ): AnswerAlerts;

  extractFromStackedSlider(
    sliderItem: StackedSliderPipelineItem,
    answer: Answer,
  ): AnswerAlerts;

  extractForSummary(
    pipelineItems: PipelineItem[],
    answers: Answers,
    logActivityName: string,
  ): AnswerAlerts;
}
