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
      <Box flex={1} backgroundColor="rgba(0,0,0,0.2)" ai="center" jc="center">
        <Center>
          <Box
            gap="$5"
            bg="$lighterGrey8"
            px="$6"
            py="$5"
            borderRadius={30}
            mx="$2"
          >
            <Text fontSize={23}>
              {t('autocompletion:time_is_up_modal_title')}
            </Text>
            <Text>{t('autocompletion:time_is_up_modal_description')}</Text>
            <Box alignItems="flex-end">
              <SubmitButton
                mode="primary"
                onPress={onSubmit}
                buttonStyle={{
                  width: 70,
                }}
              >
                {t('autocompletion:ok')}
              </SubmitButton>
            </Box>
          </Box>
        </Center>
      </Box>
    </Modal>
  );
}
