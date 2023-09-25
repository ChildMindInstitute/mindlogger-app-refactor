export type AnswerAlert = {
  activityItemId: string;
  message: string;
};

export type AnswerAlerts = Array<AnswerAlert>;

export type ScoreRecord = {
  name: string;
  value: number;
  flagged: boolean;
};
