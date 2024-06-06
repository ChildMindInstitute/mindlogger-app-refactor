import {
  FeatureFlagsKeys,
  FeatureFlagsService,
  IPreprocessor,
  Logger,
} from '@app/shared/lib';
import { ReduxStore } from '@shared/lib/redux-state/store';

import { UploadItem } from './AnswersQueueService';

class UploadItemPreprocessor implements IPreprocessor<UploadItem> {
  private reduxStore = ReduxStore;

  private preprocessConsents(uploadItem: UploadItem) {
    const consents = this.reduxStore.getState().applets.consents;
    const { appletId } = uploadItem.input;
    const appletConsents = consents?.[appletId];

    if (
      appletConsents &&
      appletConsents.shareToPublic &&
      FeatureFlagsService.evaluateFlag(
        FeatureFlagsKeys.enableConsentsCapability,
      )
    ) {
      uploadItem.input.isDataShare = true;
    }

    Logger.log(
      `[UploadItemPreprocessor] consents preprocessing finished. Data is ${uploadItem.input?.isDataShare ? '' : 'not '}shared to public`,
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
