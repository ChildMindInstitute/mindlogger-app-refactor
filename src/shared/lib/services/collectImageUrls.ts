import { ActivityDto, AppletDetailsDto, AppletDto } from '@app/shared/api';

export const collectAppletRecordImageUrls = (
  applet: AppletDto,
): Array<string> => {
  const result: Array<string> = [];

  applet.watermark && result.push(applet.watermark);
  applet.image && result.push(applet.image);
  applet.theme && applet.theme.logo && result.push(applet.theme.logo);
  applet.theme &&
    applet.theme.backgroundImage &&
    result.push(applet.theme.backgroundImage);

  return result;
};

export const collectAppletDetailsImageUrls = (
  applet: AppletDetailsDto,
): Array<string> => {
  const result: Array<string> = [];

  applet.watermark && result.push(applet.watermark);
  applet.image && result.push(applet.image);
  applet.theme && applet.theme.logo && result.push(applet.theme.logo);
  applet.theme &&
    applet.theme.backgroundImage &&
    result.push(applet.theme.backgroundImage);

  for (let activity of applet.activities) {
    activity.splashScreen && result.push(activity.splashScreen);
    activity.image && result.push(activity.image);
  }

  return result;
};

export const collectActivityDetailsImageUrls = (activity: ActivityDto) => {
  const result: Array<string> = [];

  activity.image && result.push(activity.image);
  activity.splashScreen && result.push(activity.splashScreen);

  for (let item of activity.items) {
    switch (item.responseType) {
      case 'singleSelect': {
        for (let option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
      case 'multiSelect': {
        for (let option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
      case 'slider': {
        item.responseValues.minImage &&
          result.push(item.responseValues.minImage);
        item.responseValues.maxImage &&
          result.push(item.responseValues.maxImage);
        break;
      }
      case 'drawing': {
        item.responseValues.drawingBackground &&
          result.push(item.responseValues.drawingBackground);
        item.responseValues.drawingExample &&
          result.push(item.responseValues.drawingExample);
        break;
      }
      case 'sliderRows': {
        for (let responseValue of item.responseValues) {
          responseValue.minImage && result.push(responseValue.minImage);
          responseValue.maxImage && result.push(responseValue.maxImage);
        }
        break;
      }
      case 'singleSelectRows': {
        for (let row of item.responseValues.rows) {
          row.rowImage && result.push(row.rowImage);
        }
        for (let option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
      case 'multiSelectRows': {
        for (let row of item.responseValues.rows) {
          row.rowImage && result.push(row.rowImage);
        }
        for (let option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
    }
  }
  return result;
};
