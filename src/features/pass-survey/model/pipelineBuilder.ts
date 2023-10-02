import { ActivityDetails, ActivityItem } from '@app/entities/activity';

import { getAbTrailsPipeline } from './precompiled-pipelines';
import { PipelineItem } from '../lib';

export function buildPipeline(
  activity: ActivityDetails,
  filterHidden: boolean = true,
): PipelineItem[] {
  const alignMessagesToLeft = activity.items.some(
    x => x.inputType === 'Flanker',
  );

  const activityItems = filterHidden
    ? filterHiddenItems(activity.items)
    : activity.items;

  const pipeline: PipelineItem[] = activityItems
    .map((item, index) => {
      switch (item.inputType) {
        case 'AbTrails': {
          return getAbTrailsPipeline(
            item.id,
            item.config,
            activity.items.length - 1 === index,
          ) satisfies PipelineItem[];
        }

        case 'StabilityTracker': {
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
            isHidden: item.isHidden,
          } satisfies PipelineItem;
        }

        case 'Splash': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            timer: item.timer,
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
          } satisfies PipelineItem;
        }

        case 'Flanker': {
          return {
            id: item.id,
            type: item.inputType,
            payload: item.config,
            timer: null,
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
          };
        }

        case 'Message': {
          return {
            id: item.id,
            type: item.inputType,
            payload: { alignToLeft: alignMessagesToLeft },
            question: item.question,
            isSkippable: item.isSkippable,
            isAbleToMoveBack: item.isAbleToMoveBack,
            timer: item.timer,
            conditionalLogic: item.conditionalLogic,
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
            isHidden: item.isHidden,
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
