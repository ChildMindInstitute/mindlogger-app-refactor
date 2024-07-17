export interface IEvaluator<TEvaluate, TEvent> {
  evaluate: (valuesToEvaluate: TEvaluate[]) => TEvaluate[];
  isInGroup(event: TEvent): boolean;
}
