import { ResponseType } from '@app/shared/api/services/ActivityItemDto';

import {
  appSupportedResponseTypes,
  universalSupportedResponseTypes,
  webSupportedResponseTypes,
} from '../../constants/responseTypes';

export const getIsAppOnly = (responseType: ResponseType) =>
  appSupportedResponseTypes.includes(responseType);

export const getIsWebOnly = (responseType: ResponseType) =>
  webSupportedResponseTypes.includes(responseType);

export const getSupportsApp = (responseType: ResponseType) =>
  getIsAppOnly(responseType) ||
  universalSupportedResponseTypes.includes(responseType);

export const getSupportsWeb = (responseType: ResponseType) =>
  getIsWebOnly(responseType) ||
  universalSupportedResponseTypes.includes(responseType);
