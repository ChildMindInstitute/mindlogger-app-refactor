import { CommonObservable } from '../utils';

export interface IChangeQueueNotify {
  notify: () => void;
}

class ChangeQueueObservable
  extends CommonObservable
  implements IChangeQueueNotify
{
  constructor() {
    super();
  }
}

export default new ChangeQueueObservable();
