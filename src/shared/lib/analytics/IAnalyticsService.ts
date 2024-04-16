export interface IAnalyticsService {
  track(action: string, payload?: Record<string, any>): void;
  login(id: string): Promise<void>;
  logout(): void;
  init(): Promise<void>;
}
