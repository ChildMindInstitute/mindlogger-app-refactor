import { ActivityDto, AppletDetailsDto, AppletDto } from '@app/shared/api';

export const collectAppletRecordImageUrls = (
  applet: AppletDto,
): Array<string> => {
  try {
    const result: Array<string> = [];

    applet.watermark && result.push(applet.watermark);
    applet.image && result.push(applet.image);
    applet.theme && applet.theme.logo && result.push(applet.theme.logo);
    applet.theme &&
      applet.theme.backgroundImage &&
      result.push(applet.theme.backgroundImage);

    return result;
  } catch (error) {
    throw new Error(
      `[collectAppletRecordImageUrls]: Error occurred:\n\n${error}`,
    );
  }
};

export const collectAppletDetailsImageUrls = (
  applet: AppletDetailsDto,
): Array<string> => {
  try {
    const result: Array<string> = [];

    applet.watermark && result.push(applet.watermark);
    applet.image && result.push(applet.image);
    applet.theme && applet.theme.logo && result.push(applet.theme.logo);
    applet.theme &&
      applet.theme.backgroundImage &&
      result.push(applet.theme.backgroundImage);

    for (const activity of applet.activities) {
      activity.splashScreen && result.push(activity.splashScreen);
      activity.image && result.push(activity.image);
    }

    return result;
  } catch (error) {
    throw new Error(
      `[collectAppletDetailsImageUrls]: Error occurred:\n\n${error}`,
    );
  }
};

const collectActivityDetailsImageUrlsInternal = (activity: ActivityDto) => {
  const result: Array<string> = [];

  activity.image && result.push(activity.image);
  activity.splashScreen && result.push(activity.splashScreen);

  for (const item of activity.items) {
    switch (item.responseType) {
      case 'singleSelect': {
        for (const option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
      case 'multiSelect': {
        for (const option of item.responseValues.options) {
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
        for (const responseValue of item.responseValues.rows) {
          responseValue.minImage && result.push(responseValue.minImage);
          responseValue.maxImage && result.push(responseValue.maxImage);
        }
        break;
      }
      case 'singleSelectRows': {
        for (const row of item.responseValues.rows) {
          row.rowImage && result.push(row.rowImage);
        }
        for (const option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
      case 'multiSelectRows': {
        for (const row of item.responseValues.rows) {
          row.rowImage && result.push(row.rowImage);
        }
        for (const option of item.responseValues.options) {
          option.image && result.push(option.image);
        }
        break;
      }
    }
  }
  return result;
};

export const collectActivityDetailsImageUrls = (activity: ActivityDto) => {
  try {
    return collectActivityDetailsImageUrlsInternal(activity);
  } catch (error) {
    throw new Error(
      `[collectActivityDetailsImageUrls]: Error occurred:\n\n${error}`,
    );
  }
};
