import { useTranslation } from 'react-i18next';

import { Center } from '@app/shared/ui/Center';
import { ImageBackground } from '@app/shared/ui/ImageBackground';
import { Text } from '@app/shared/ui/Text';

export function SendingAnswersScreen() {
  const { t } = useTranslation();

  return (
    <ImageBackground>
      <Center flex={1}>
        <Text fontSize={22}>{t('activity:please_wait')}...</Text>
      </Center>
    </ImageBackground>
  );
}
