import { mapAppletDetailsFromDto } from '@app/entities/applet/model/mappers';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { FeatureFlagsKeys } from '@app/shared/lib/featureFlags/FeatureFlags.types';
import { FeatureFlagsService } from '@app/shared/lib/featureFlags/FeatureFlagsService';
import { getDefaultQueryClient } from '@app/shared/lib/queryClient/queryClientInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { IPreprocessor } from '@app/shared/lib/types/service';

import { UploadItem } from './AnswersQueueService';

export class UploadItemPreprocessor implements IPreprocessor<UploadItem> {
  private queryDataUtils: QueryDataUtils;

  constructor() {
    this.queryDataUtils = new QueryDataUtils(getDefaultQueryClient());
  }

  private preprocessConsents(uploadItem: UploadItem) {
    const { appletId } = uploadItem.input;

    const appletDetailsDto = this.queryDataUtils.getAppletDto(appletId);

    if (!appletDetailsDto) {
      getDefaultLogger().error(
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

    getDefaultLogger().log(
      `[UploadItemPreprocessor] consents preprocessing finished. Data is ${uploadItem.input?.consentToShare ? '' : 'not '}shared to public`,
    );
  }

  public preprocess(uploadItem: UploadItem) {
    getDefaultLogger().log(
      '[UploadItemPreprocessor] started preprocessing upload item',
    );

    try {
      this.preprocessConsents(uploadItem);

      getDefaultLogger().log(
        '[UploadItemPreprocessor] successfully preprocessed',
      );
    } catch (error) {
      if (error instanceof Error) {
        getDefaultLogger().error(
          `[UploadItemPreprocessor] Error occurred during the preprocessing:
          ${error.message}`,
        );
      } else {
        getDefaultLogger().error(
          '[UploadItemPreprocessor] Unknown error occurred',
        );
      }
    }
  }
}
