import { PipelineItemAnswerBase } from './pipelineItemAnswer';

export type SetAnswerAction = {
  type: 'SET_ANSWER';
  payload: {
    answer: PipelineItemAnswerBase;
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

type GoBackAction = {
  type: 'PREV';
  payload: {
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

type GoNextAction = {
  type: 'NEXT';
  payload: {
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

type CompleteAction = {
  type: 'DONE';
  payload: {
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

type UndoAction = {
  type: 'UNDO';
  payload: {
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

export type UserAction =
  | SetAnswerAction
  | GoBackAction
  | GoNextAction
  | CompleteAction
  | UndoAction;
