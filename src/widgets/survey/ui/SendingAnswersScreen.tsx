import { useTranslation } from 'react-i18next';

import { Center, ImageBackground, Text } from '@shared/ui';

function SendingAnswersScreen() {
  const { t } = useTranslation();

  return (
    <ImageBackground>
      <Center flex={1}>
        <Text fontSize={22}>{t('activity:please_wait')}...</Text>
      </Center>
    </ImageBackground>
  );
}

export default SendingAnswersScreen;
