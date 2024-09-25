import { IMutex, Mutex } from './common';
import { IMutexDefaultInstanceManager } from './IMutexDefaultInstanceManager';

export class MutexDefaultInstanceManager
  implements IMutexDefaultInstanceManager
{
  private instances: Record<string, IMutex | null | undefined>;

  public getRefreshServiceMutex: () => IMutex;
  public getStartEntityMutex: () => IMutex;
  public getAutoCompletionMutex: () => IMutex;

  constructor() {
    this.instances = {};

    this.getRefreshServiceMutex = this.getter('refresh-service');
    this.getStartEntityMutex = this.getter('start-entity');
    this.getAutoCompletionMutex = this.getter('auto-completion');
  }

  private getter(mutexName: string) {
    const getter = (): IMutex => {
      if (!this.instances[mutexName]) {
        this.instances[mutexName] = Mutex();
      }
      return this.instances[mutexName] as IMutex;
    };

    return getter.bind(this);
  }
}
