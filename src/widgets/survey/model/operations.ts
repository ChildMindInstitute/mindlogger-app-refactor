import { v4 as uuidv4 } from 'uuid';

import { ActivityPipelineType, AvailabilityType, StoreProgressPayload } from '@app/abstract/lib';
import { SvgFileManager } from '@app/entities/drawer';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { ActivityItemType, DrawingTestResponse } from '@app/features/pass-survey';
import { Answers, PipelineItem } from '@app/features/pass-survey';
import { InitializeHiddenItem } from '@app/features/pass-survey/model';
import { AnswerDto } from '@app/shared/api';

export const getScheduledDate = (event: ScheduleEvent) => {
  if (event.availability.availabilityType !== AvailabilityType.AlwaysAvailable) {
    return EventModel.ScheduledDateCalculator.calculate(event)!.valueOf();
  }
};

export const getActivityStartAt = (progressRecord: StoreProgressPayload) => {
  return progressRecord.type === ActivityPipelineType.Regular
    ? progressRecord.startAt
    : progressRecord.currentActivityStartAt;
};

export const getExecutionGroupKey = (progressRecord: StoreProgressPayload) => {
  return progressRecord.type === ActivityPipelineType.Flow ? progressRecord.executionGroupKey : uuidv4();
};

export const getUserIdentifier = (pipeline: PipelineItem[], answers: Answers) => {
  const itemWithIdentifierStep = pipeline.findIndex((item) => {
    return item.type === 'TextInput' && item.payload.shouldIdentifyResponse;
  });

  if (itemWithIdentifierStep > -1) {
    return answers[itemWithIdentifierStep]?.answer as string;
  }
};

export const getItemIds = (pipeline: PipelineItem[]): string[] => {
  return pipeline.reduce((accumulator: string[], current: PipelineItem, step: number) => {
    if (canItemHaveAnswer(current.type)) {
      accumulator.push(pipeline[Number(step)].id!);
    }
    return accumulator;
  }, []);
};

export const fillNullsForHiddenItems = (
  itemIds: string[],
  answers: AnswerDto[],
  originalItems: InitializeHiddenItem[],
): { answers: AnswerDto[]; itemIds: string[] } => {
  const modifiedAnswers: Array<AnswerDto> = [];
  const filteredOriginalItems = originalItems.filter((originalItem) => canItemHaveAnswer(originalItem.type));

  filteredOriginalItems.forEach((item) => {
    if (item.isHidden) {
      const answer: AnswerDto = null;

      modifiedAnswers.push(answer);
    } else {
      const answerPosition = itemIds.indexOf(item.itemId);

      modifiedAnswers.push(answers[answerPosition]);
    }
  });

  return {
    itemIds: filteredOriginalItems.map((c) => c.itemId),
    answers: modifiedAnswers,
  };
};

export const canItemHaveAnswer = (type: ActivityItemType): boolean => {
  return type !== 'Tutorial' && type !== 'Splash';
};

export const createSvgFiles = async (pipelineItems: PipelineItem[], answers: Answers) => {
  const drawingTestItems: DrawingTestResponse[] = [];

  pipelineItems.forEach((item, index) => {
    const answer = answers[index]?.answer;

    if (item.type === 'DrawingTest' && answer) {
      drawingTestItems.push(answer as DrawingTestResponse);
    }
  });

  const promises = drawingTestItems.map((drawingTestItem) => {
    return SvgFileManager.writeFile(drawingTestItem.uri, drawingTestItem.svgString);
  });

  return Promise.all(promises);
};
