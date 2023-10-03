import { v4 as uuidv4 } from 'uuid';

import {
  ActivityPipelineType,
  AvailabilityType,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { Answers, PipelineItem } from '@app/features/pass-survey';
import { AnswerDto } from '@app/shared/api';

export const getScheduledDate = (event: ScheduleEvent) => {
  if (
    event.availability.availabilityType !== AvailabilityType.AlwaysAvailable
  ) {
    return EventModel.ScheduledDateCalculator.calculate(event!)!.valueOf();
  }
};

export const getActivityStartAt = (progressRecord: StoreProgressPayload) => {
  return progressRecord.type === ActivityPipelineType.Regular
    ? progressRecord.startAt
    : progressRecord.currentActivityStartAt;
};

export const getExecutionGroupKey = (progressRecord: StoreProgressPayload) => {
  return progressRecord.type === ActivityPipelineType.Flow
    ? progressRecord.executionGroupKey
    : uuidv4();
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
      if (canItemHaveAnswer(current)) {
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
  context: Array<{ itemId: string; isHidden: boolean; type: string }>,
): { answers: AnswerDto[]; itemIds: string[] } => {
  const modifiedAnswers: Array<AnswerDto> = [];
  const modifiedContext = context.filter(i => i.type !== 'Splash');

  let hiddenItemsCount = 0;

  modifiedContext.forEach((item, step) => {
    if (item.isHidden) {
      const answer: AnswerDto = null;
      modifiedAnswers.push(answer);
      hiddenItemsCount += 1;
    } else {
      modifiedAnswers.push(answers[step - hiddenItemsCount]);
    }
  });

  return {
    itemIds: modifiedContext.map(c => c.itemId),
    answers: modifiedAnswers,
  };
};

export const canItemHaveAnswer = (pipelineItem: PipelineItem): boolean => {
  return pipelineItem.type !== 'Tutorial' && pipelineItem.type !== 'Splash';
};
