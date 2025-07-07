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
  'requestHealthRecordData',
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
  'unity',
  'stabilityTracker',
  'video',
];

export const webSupportedResponseTypes: ResponseType[] = ['phrasalTemplate'];
