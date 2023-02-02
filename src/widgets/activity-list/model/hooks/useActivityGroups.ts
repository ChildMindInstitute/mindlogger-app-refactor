import {
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '@app/entities/activity';

export const useActivityGroups = (): ActivityListGroup[] => {
  let mocks: ActivityListGroup[] = [];

  for (let i = 0; i < 3; i++) {
    let activities: ActivityListItem[] = [];

    mocks.push({
      activities,
      type: (i + 1) as ActivityGroupType,
      name: ActivityGroupTypeNames[(i + 1) as ActivityGroupType],
    });

    for (let j = 0; j < 5; j++) {
      activities.push({
        id: i * 100 + j,
        hasEventContext: true,
        isInActivityFlow: true,
        type: ActivityType.NotDefined,
        activityFlowName: 'Flow ' + j,
        activityPositionInFlow: 1,
        numberOfActivitiesInFlow: 2,
        image:
          'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
        name: 'Activity name ' + (j + 1),
        description:
          'Description of item A Description of item B i i i i i i i Description of item Description of item Description of item ' +
          j,
        isTimedActivityAllow: true,
        isTimeoutAccess: true,
        isTimeoutAllow: true,
        status: ActivityStatus.Scheduled,
        availableFrom: '17:00',
        availableTo: 'Midnight',
        scheduledAt: null,
        timeToComplete: null,
      });
    }
  }
  return mocks;
};
