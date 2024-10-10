export interface INotificationBadgeManager {
  getCount(): Promise<number>;
  increment(): Promise<void>;
  decrement(): Promise<void>;
  setCount(value: number): Promise<void>;
  clear(): Promise<void>;
}
