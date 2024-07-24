import { QueryDataUtils } from '@app/shared/api';
import {
  FeatureFlagsKeys,
  FeatureFlagsService,
  IPreprocessor,
  Logger,
  queryClient,
} from '@app/shared/lib';

import { UploadItem } from './AnswersQueueService';
import { mapAppletDetailsFromDto } from '../../@x/applet';

class UploadItemPreprocessor implements IPreprocessor<UploadItem> {
  queryDataUtils: QueryDataUtils = new QueryDataUtils(queryClient);

  private preprocessConsents(uploadItem: UploadItem) {
    const { appletId } = uploadItem.input;

    const appletDetailsDto = this.queryDataUtils.getAppletDto(appletId);

    if (!appletDetailsDto) {
      Logger.error(
        `[UploadItemPreprocessor] Applet DTO not found. ID: ${appletId}`,
      );
      return;
    }

    const appletDetails = mapAppletDetailsFromDto(appletDetailsDto);

    if (
      appletDetails.consentsCapabilityEnabled &&
      FeatureFlagsService.evaluateFlag(
        FeatureFlagsKeys.enableConsentsCapability,
      )
    ) {
      uploadItem.input.consentToShare = true;
    }

    Logger.log(
      `[UploadItemPreprocessor] consents preprocessing finished. Data is ${uploadItem.input?.consentToShare ? '' : 'not '}shared to public`,
    );
  }

  public preprocess(uploadItem: UploadItem) {
    Logger.log('[UploadItemPreprocessor] started preprocessing upload item');

    try {
      this.preprocessConsents(uploadItem);

      Logger.log('[UploadItemPreprocessor] successfully preprocessed');
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(
          `[UploadItemPreprocessor] Error occurred during the preprocessing:
          ${error.message}`,
        );
      } else {
        Logger.error('[UploadItemPreprocessor] Unknown error occurred');
      }
    }
  }
}

export default UploadItemPreprocessor;
