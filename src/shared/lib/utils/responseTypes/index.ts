import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import {
  AppletBaseInfoActivity,
  AppletBaseInfoActivityFlow,
} from '@app/shared/api/services/IAppletService';

import {
  appSupportedResponseTypes,
  universalSupportedResponseTypes,
  webSupportedResponseTypes,
} from '../../constants/responseTypes';

export const getIsMobileOnly = (responseType: ResponseType) =>
  appSupportedResponseTypes.includes(responseType);

export const getIsWebOnly = (responseType: ResponseType) =>
  webSupportedResponseTypes.includes(responseType);

export const getSupportsMobile = (responseType: ResponseType) =>
  getIsMobileOnly(responseType) ||
  universalSupportedResponseTypes.includes(responseType);

export const getSupportsWeb = (responseType: ResponseType) =>
  getIsWebOnly(responseType) ||
  universalSupportedResponseTypes.includes(responseType);

export const getResponseTypesMap = ({
  activities,
  activityFlows,
}: {
  activities: AppletBaseInfoActivity[];
  activityFlows: AppletBaseInfoActivityFlow[];
}) => {
  const activityResponseTypes =
    activities?.reduce(
      (curr, activity) => ({
        ...curr,
        [activity.id]: activity.containsResponseTypes,
      }),
      {} as Record<string, ResponseType[]>,
    ) || {};
  const flowResponseTypes = activityFlows?.reduce(
    (curr, activityFlow) => ({
      ...curr,
      [activityFlow.id]: (activityFlow?.activityIds || [])
        .map(activityId => activityResponseTypes[activityId])
        .flat(),
    }),
    {} as Record<string, ResponseType[]>,
  );

  return { ...activityResponseTypes, ...flowResponseTypes };
};
