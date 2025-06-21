import { FC, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useBanners } from '@app/entities/banner/lib/hooks/useBanners';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { YStack } from '@app/shared/ui/base';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

export const SendApplicationLogsForm: FC = () => {
  const { t } = useTranslation();
  const { addSuccessBanner, addErrorBanner } = useBanners();

  const [isLoading, setIsLoading] = useState(false);

  const onSendLogs = async () => {
    setIsLoading(true);

    getDefaultAnalyticsService().track(MixEvents.UploadLogsPressed);

    const result = await getDefaultLogger().send();

    if (result) {
      getDefaultAnalyticsService().track(MixEvents.UploadedLogsSuccessfully);
    } else {
      getDefaultAnalyticsService().track(MixEvents.UploadLogsError);
    }

    if (result === false) {
      addErrorBanner(t('application_logs_screen:error'));
    } else {
      addSuccessBanner(t('application_logs_screen:success'));
    }

    setIsLoading(false);
  };

  return (
    <YStack flex={1} px={16} ai="center" jc="center" gap={32}>
      <YStack gap={16}>
        <Text fontSize={18} lineHeight={28} textAlign="center">
          {t('application_logs_screen:title')}
        </Text>

        <Text fontSize={18} lineHeight={28} textAlign="center">
          {t('application_logs_screen:subTitle')}
        </Text>
      </YStack>

      <SubmitButton
        mode="primary"
        onPress={onSendLogs}
        isLoading={isLoading}
        disabled={isLoading}
        width={356}
        maxWidth="100%"
      >
        {t('application_logs_screen:upload_button')}
      </SubmitButton>
    </YStack>
  );
};
