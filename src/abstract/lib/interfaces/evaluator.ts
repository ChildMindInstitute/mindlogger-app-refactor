export interface IEvaluator<TValue> {
  evaluate: (valuesToEvaluate: TValue[]) => TValue[];
}
