import { useTranslation } from 'react-i18next';

import { Center, ImageBackground, Text, Button } from '@shared/ui';

type Props = {
  onClose: () => void;
};

function ActivityPassedScreen({ onClose }: Props) {
  const { t } = useTranslation();

  return (
    <ImageBackground>
      <Center flex={1} mx={16}>
        <Center mb={20}>
          <Text fontSize={24} fontWeight="bold">
            {t('additional:thanks')}
          </Text>

          <Text fontSize={16}>{t('additional:saved_answers')}</Text>
        </Center>

        <Button onPress={onClose}>{t('additional:close')}</Button>
      </Center>
    </ImageBackground>
  );
}

export default ActivityPassedScreen;
