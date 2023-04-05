import { ActivityDetails } from '@app/entities/activity';

import { getAbTrailsPipeline } from './precompiled-pipelines';
import { PipelineItem } from '../lib';

export function buildPipeline(activity: ActivityDetails): PipelineItem[] {
  const pipeline: PipelineItem[] = activity.items
    .map(item => {
      switch (item.inputType) {
        case 'AbTest': {
          return getAbTrailsPipeline(
            item.config.device,
          ) satisfies PipelineItem[];
        }

        case 'Splash': {
          return {
            type: item.inputType,
            payload: null,
          } satisfies PipelineItem;
        }

        case 'DrawingTest': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveToPrevious: item.isAbleToMoveToPrevious,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
          } satisfies PipelineItem;
        }

        case 'Flanker': {
          return {
            type: item.inputType,
            payload: item.config,
          } satisfies PipelineItem;
        }

        case 'TextInput': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveToPrevious: item.isAbleToMoveToPrevious,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
          } satisfies PipelineItem;
        }

        case 'Slider': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveToPrevious: item.isAbleToMoveToPrevious,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
          };
        }

        case 'Checkbox': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveToPrevious: item.isAbleToMoveToPrevious,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
          };
        }

        case 'NumberSelect': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveToPrevious: item.isAbleToMoveToPrevious,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
          } satisfies PipelineItem;
        }
      }
    })
    .reduce<PipelineItem[]>((items, item) => {
      return Array.isArray(item) ? [...items, ...item] : [...items, item];
    }, []);

  return pipeline;
}
