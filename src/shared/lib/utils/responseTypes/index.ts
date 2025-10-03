import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { AppletBaseInfoResponse } from '@app/shared/api/services/IAppletService';

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

export const getResponseTypesMap = ({ result }: AppletBaseInfoResponse) => {
  const activityResponseTypes =
    result.activities?.reduce(
      (curr, activity) => ({
        ...curr,
        [activity.id]: activity.containsResponseTypes,
      }),
      {} as Record<string, ResponseType[]>,
    ) || {};
  const flowResponseTypes = result.activityFlows?.reduce(
    (curr, activityFlow) => ({
      ...curr,
      [activityFlow.id]: (activityFlow?.activityIds || [])
        .map(activityId => activityResponseTypes[activityId])
        .filter(Boolean) // Remove undefined values from deleted activities
        .flat()
        .filter(Boolean), // Remove any undefined values after flattening
    }),
    {} as Record<string, ResponseType[]>,
  );

  return { ...activityResponseTypes, ...flowResponseTypes };
};
