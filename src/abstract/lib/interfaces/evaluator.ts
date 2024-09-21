export interface IEvaluator<TEvaluate, TEvent> {
  evaluate: (valuesToEvaluate: TEvaluate[]) => TEvaluate[];
  isEventInGroup(event: TEvent, targetSubjectId: string | null): boolean;
}
