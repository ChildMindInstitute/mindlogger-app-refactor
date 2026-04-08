export interface ITargetedProgressSyncService {
  // Syncs in-progress flows and completions for a single applet
  syncAppletProgress(appletId: string): Promise<void>;
}
