import { Modal } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Box } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

type Props = {
  onSubmit: () => void;
};

export function TimeIsUpModal({ onSubmit }: Props) {
  const { t } = useTranslation();

  return (
    <Modal animationType="fade" transparent>
      <Box flex={1} bg="$on_surface_alpha30" ai="center" jc="center">
        <Center>
          <Box gap={16} bg="$surface_variant" p={24} borderRadius={16} mx={16}>
            <Text fontSize={22} lineHeight={28}>
              {t('autocompletion:time_is_up_modal_title')}
            </Text>
            <Text>{t('autocompletion:time_is_up_modal_description')}</Text>
            <Box alignItems="flex-end">
              <SubmitButton mode="primary" onPress={onSubmit}>
                {t('autocompletion:ok')}
              </SubmitButton>
            </Box>
          </Box>
        </Center>
      </Box>
    </Modal>
  );
}
