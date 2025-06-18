import { useTranslation } from 'react-i18next';

import { Text } from '@app/shared/ui/Text';
import { Box, YStack } from '@shared/ui/base';

import { Alert } from './Alert';

type Props = {
  alerts: string[];
};

export function AlertList({ alerts }: Props) {
  const { t } = useTranslation();

  if (!alerts.length) {
    return null;
  }

  return (
    <Box
      bg="$lighterGrey4"
      br={10}
      p={20}
      mb={20}
      accessibilityLabel="alerts-group"
    >
      <Text fontWeight="700" fontSize={23} mb={10}>
        {t('activity_summary:alerts')}
      </Text>

      <YStack space={12}>
        {alerts.map((alert, index) => (
          <Alert key={index}>{alert}</Alert>
        ))}
      </YStack>
    </Box>
  );
}
