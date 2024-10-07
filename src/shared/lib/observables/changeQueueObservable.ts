import { IChangeQueueObservable } from './IChangeQueueObservable';
import { CommonObservable } from '../utils/observable';

export class ChangeQueueObservable
  extends CommonObservable
  implements IChangeQueueObservable
{
  constructor() {
    super();
  }
}
