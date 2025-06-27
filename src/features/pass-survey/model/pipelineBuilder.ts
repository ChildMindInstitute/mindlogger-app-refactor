import {
  ActivityDetails,
  ActivityItem,
} from '@app/entities/activity/lib/types/activity';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { getAbTrailsPipeline } from './precompiled-pipelines';
import {
  PipelineItem,
  RequestHealthRecordDataItemStep,
} from '../lib/types/payload';

export function buildPipeline(activity: ActivityDetails): PipelineItem[] {
  const alignMessagesToLeft = activity.items.some(
    x => x.inputType === 'Flanker',
  );

  const pipeline: PipelineItem[] = filterHiddenItems(activity.items)
    .map((item, index) => {
      switch (item.inputType) {
        case 'AbTrails': {
          return getAbTrailsPipeline(
            item.id,
            item.config,
            activity.items.length - 1 === index,
          ) satisfies PipelineItem[];
        }

        case 'Unity': {
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
            timer: null,
            conditionalLogic: item.conditionalLogic,
          } satisfies PipelineItem;
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
        case 'ParagraphText': {
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
            payload: { alignToLeft: alignMessagesToLeft },
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
            conditionalLogic: item.conditionalLogic,
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

        case 'RequestHealthRecordData': {
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
            subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
            additionalEHRs: null,
            ehrSearchSkipped: false,
          } satisfies PipelineItem;
        }

        default: {
          getDefaultLogger().warn(
            `[buildPipeline] unknown activity item type found: ${(item as ActivityItem).inputType}`,
          );

          return null as unknown as PipelineItem;
        }
      }
    })
    .reduce<PipelineItem[]>((items, item) => {
      return Array.isArray(item) ? [...items, ...item] : [...items, item];
    }, [])
    .filter(Boolean)
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
