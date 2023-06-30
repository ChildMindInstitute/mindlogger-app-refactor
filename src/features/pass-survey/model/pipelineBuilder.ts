import { ActivityDetails, ActivityItem } from '@app/entities/activity';

import { getAbTrailsPipeline } from './precompiled-pipelines';
import { PipelineItem } from '../lib';

export function buildPipeline(activity: ActivityDetails): PipelineItem[] {
  const pipeline: PipelineItem[] = filterHiddenItems(activity.items)
    .map(item => {
      switch (item.inputType) {
        case 'AbTest': {
          return getAbTrailsPipeline(
            item.config.device,
            item.id,
          ) satisfies PipelineItem[];
        }

        case 'Splash': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            timer: item.timer,
          } satisfies PipelineItem;
        }

        case 'DrawingTest': {
          return {
            id: item.id,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Flanker': {
          return {
            id: item.id,
            type: item.inputType,
            payload: item.config,
            timer: null,
          } satisfies PipelineItem;
        }

        case 'TextInput': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Slider': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'Audio': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'AudioPlayer': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: false,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'Message': {
          return {
            id: item.id,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'TimeRange': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'Radio': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'Checkbox': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'StackedSlider': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
          };
        }

        case 'StackedCheckbox': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'StackedRadio': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            validationOptions: item.validationOptions,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          };
        }

        case 'NumberSelect': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Geolocation': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: null,
            question: item.question,
            timer: item.timer,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Photo': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Video': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Date': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }

        case 'Time': {
          return {
            id: item.id,
            name: item.name,
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            canBeReset: item.canBeReset,
            hasTopNavigation: item.hasTopNavigation,
            additionalText: item.additionalText,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
        }
      }
    })
    .reduce<PipelineItem[]>((items, item) => {
      return Array.isArray(item) ? [...items, ...item] : [...items, item];
    }, [])
    .map(item => {
      const isAbleToMoveBack =
        activity.responseIsEditable && item.isAbleToMoveBack;
      const isSkippable = activity.isSkippable || item.isSkippable;

      return {
        ...item,
        isAbleToMoveBack: isAbleToMoveBack,
        isSkippable: isSkippable,
      };
    });

  return pipeline;
}

function filterHiddenItems(items: ActivityItem[]) {
  return items.filter(item => !item.isHidden);
}
