import { ResponseType } from '@app/shared/api/services/ActivityItemDto';

/**
 * NOTE: When updating this file, make sure to make corresponding changes in
 * the Web & Admin apps:
 * - https://github.com/ChildMindInstitute/mindlogger-admin/blob/main/src/shared/utils/responseType.ts
 */

export const universalSupportedResponseTypes: ResponseType[] = [
  'audioPlayer',
  'date',
  'message',
  'multiSelect',
  'multiSelectRows',
  'numberSelect',
  'paragraphText',
  'singleSelect',
  'singleSelectRows',
  'slider',
  'sliderRows',
  'text',
  'time',
  'timeRange',
];

export const appSupportedResponseTypes: ResponseType[] = [
  'ABTrails',
  'audio',
  'drawing',
  'flanker',
  'geolocation',
  'photo',
  'stabilityTracker',
  'video',
];

export const webSupportedResponseTypes: ResponseType[] = ['phrasalTemplate'];
