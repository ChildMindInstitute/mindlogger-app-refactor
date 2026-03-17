import { FC } from 'react';
import { Modal } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Box } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export const UnityErrorModal: FC<Props> = ({ visible, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <Box flex={1} bg="$on_surface_alpha30" ai="center" jc="center">
        <Center>
          <Box
            bg="$surface"
            borderRadius={28}
            mx={16}
            overflow="hidden"
          >
            {/* Title */}
            <Box pt={20} pl={32} pr={20} pb={16}>
              <Text fontSize={24} lineHeight={32} color="$on_surface">
                {t('unity:error_title')}
              </Text>
            </Box>

            {/* Content */}
            <Box px={32} py={12}>
              <Text
                fontSize={16}
                lineHeight={24}
                letterSpacing={0.5}
                color="$on_surface"
              >
                {t('unity:error_message')}
              </Text>
            </Box>

            {/* Actions */}
            <Box pt={24} pb={32} px={32} ai="center">
              <SubmitButton mode="primary" onPress={onDismiss}>
                {t('unity:error_ok')}
              </SubmitButton>
            </Box>
          </Box>
        </Center>
      </Box>
    </Modal>
  );
};
