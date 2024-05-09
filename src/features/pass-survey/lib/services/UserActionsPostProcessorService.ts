import { ActivityState, UserAction } from '@features/pass-survey';

class UserActionsPostProcessorService {
  public postProcessUserActions(activityStorageRecord: ActivityState) {
    const currentStep = activityStorageRecord.step;
    const currentItem = activityStorageRecord.items[currentStep];
    const actions = activityStorageRecord.actions;
    const currentItemType = currentItem?.type;
    const currentItemId = currentItem.id;

    switch (currentItemType) {
      case 'AbTest': {
        return this.postProcessForAbTrails(currentItemId!, actions);
      }
      default:
        return actions;
    }
  }

  private postProcessForAbTrails(
    activityItemId: string,
    actions: ActivityState['actions'],
  ) {
    const isAnswerActionForCurrentItem = (
      action: UserAction,
      currentItemId: string,
    ) =>
      action.type === 'SET_ANSWER' &&
      action.payload.activityItemId === currentItemId;

    const updatedActions = [...actions];

    let lastSetAnswerIndexForCurrentItem = -1;

    updatedActions.forEach((action, index) => {
      if (isAnswerActionForCurrentItem(action, activityItemId)) {
        lastSetAnswerIndexForCurrentItem = index;
      }
    });

    return updatedActions.filter((action, index) => {
      return !(
        isAnswerActionForCurrentItem(action, activityItemId) &&
        index !== lastSetAnswerIndexForCurrentItem
      );
    });
  }
}

export default UserActionsPostProcessorService;
