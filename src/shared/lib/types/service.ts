export interface IPreprocessor<TArg, TReturn = void> {
  preprocess: (arg: TArg) => TReturn;
}
