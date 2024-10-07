import { v4 as uuidv4 } from 'uuid';

import {
  EntityProgression,
  EntityProgressionInProgressActivity,
  EntityProgressionInProgressActivityFlow,
} from '@app/abstract/lib/types/entityProgress';
import { AvailabilityType } from '@app/abstract/lib/types/event';
import { ISvgFileManager } from '@app/entities/drawer/lib/utils/ISvgFileManager';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { IScheduledDateCalculator } from '@app/entities/event/model/operations/IScheduledDateCalculator';
import { Answers } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import {
  ActivityItemType,
  DrawingTestResponse,
  PipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { InitializeHiddenItem } from '@app/features/pass-survey/model/ActivityRecordInitializer';
import { AnswerDto } from '@app/shared/api/services/IAnswerService';

export const getScheduledDate = (
  calculator: IScheduledDateCalculator,
  event: ScheduleEvent,
) => {
  if (
    event.availability.availabilityType !== AvailabilityType.AlwaysAvailable
  ) {
    return calculator.calculate(event)!.valueOf();
  }
};

export const getActivityProgressionStartAt = (
  progression: EntityProgression,
): Date | null => {
  if (progression.entityType === 'activity') {
    const startedAtTimestamp = (
      progression as EntityProgressionInProgressActivity
    ).startedAtTimestamp;
    return startedAtTimestamp && startedAtTimestamp > 0
      ? new Date(startedAtTimestamp)
      : null;
  }

  const currentActivityStartAt = (
    progression as EntityProgressionInProgressActivityFlow
  ).currentActivityStartAt;
  if (currentActivityStartAt) {
    return new Date(currentActivityStartAt);
  }

  return null;
};

export const getActivityFlowProgressionExecutionGroupKey = (
  progression: EntityProgression,
) => {
  if (progression.entityType === 'activityFlow') {
    return (progression as EntityProgressionInProgressActivityFlow)
      .executionGroupKey;
  }
  return uuidv4();
};

export const getUserIdentifier = (
  pipeline: PipelineItem[],
  answers: Answers,
) => {
  const itemWithIdentifierStep = pipeline.findIndex(item => {
    return item.type === 'TextInput' && item.payload.shouldIdentifyResponse;
  });

  if (itemWithIdentifierStep > -1) {
    return answers[itemWithIdentifierStep]?.answer as string;
  }
};

export const getItemIds = (pipeline: PipelineItem[]): string[] => {
  return pipeline.reduce(
    (accumulator: string[], current: PipelineItem, step: number) => {
      if (canItemHaveAnswer(current.type)) {
        accumulator.push(pipeline[Number(step)].id!);
      }
      return accumulator;
    },
    [],
  );
};

export const fillNullsForHiddenItems = (
  itemIds: string[],
  answers: AnswerDto[],
  originalItems: InitializeHiddenItem[],
): { answers: AnswerDto[]; itemIds: string[] } => {
  const modifiedAnswers: Array<AnswerDto> = [];
  const filteredOriginalItems = originalItems.filter(originalItem =>
    canItemHaveAnswer(originalItem.type),
  );

  filteredOriginalItems.forEach(item => {
    if (item.isHidden) {
      const answer: AnswerDto = null;

      modifiedAnswers.push(answer);
    } else {
      const answerPosition = itemIds.indexOf(item.itemId);

      modifiedAnswers.push(answers[answerPosition]);
    }
  });

  return {
    itemIds: filteredOriginalItems.map(c => c.itemId),
    answers: modifiedAnswers,
  };
};

export const canItemHaveAnswer = (type: ActivityItemType): boolean => {
  return type !== 'Tutorial' && type !== 'Splash';
};

export const createSvgFiles = async (
  svgFileManager: ISvgFileManager,
  pipelineItems: PipelineItem[],
  answers: Answers,
) => {
  const drawingTestItems: DrawingTestResponse[] = [];

  pipelineItems.forEach((item, index) => {
    const answer = answers[index]?.answer;

    if (item.type === 'DrawingTest' && answer) {
      drawingTestItems.push(answer as DrawingTestResponse);
    }
  });

  const promises = drawingTestItems.map(drawingTestItem => {
    return svgFileManager.writeFile(
      drawingTestItem.uri,
      drawingTestItem.svgString,
    );
  });

  return Promise.all(promises);
};
