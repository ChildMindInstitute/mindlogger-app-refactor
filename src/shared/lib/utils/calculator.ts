export class Calculator {
  constructor() {}

  public static sum(args: number[]) {
    return args.reduce((result, value) => {
      return result + value;
    }, 0);
  }

  public static avg(args: number[]) {
    if (!args.length) {
      throw new Error('[Calculator.Avg]: args is empty array');
    }
    return this.sum(args) / args.length;
  }
}
