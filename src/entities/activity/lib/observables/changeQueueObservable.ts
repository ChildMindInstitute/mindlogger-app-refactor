import { CommonObservable } from '@app/shared/lib';

export interface IChangeQueueNotify {
  notify: () => void;
}

class ChangeQueueObservable extends CommonObservable implements IChangeQueueNotify {
  constructor() {
    super();
  }
}

export default new ChangeQueueObservable();
