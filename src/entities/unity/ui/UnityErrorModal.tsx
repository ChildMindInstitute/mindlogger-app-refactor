import { FC } from 'react';
import { Modal, TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Box } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { SubmitButton } from '@app/shared/ui/SubmitButton';
import { Text } from '@app/shared/ui/Text';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onRestart?: () => void;
  canRestart?: boolean;
  isFlow?: boolean;
  nextActivityName?: string;
};

export const UnityErrorModal: FC<Props> = ({
  visible,
  onDismiss,
  onRestart,
  canRestart = false,
  isFlow,
  nextActivityName,
}) => {
  const { t } = useTranslation();

  const title = canRestart ? t('unity:restart_title') : t('unity:error_title');

  const secondaryActionLabel = isFlow
    ? t('unity:restart_secondary_flow')
    : t('unity:restart_secondary_solo');

  const renderContent = () => {
    if (canRestart) {
      return (
        <Text
          fontSize={16}
          lineHeight={24}
          letterSpacing={0.5}
          color="$on_surface"
        >
          {t('unity:restart_message')}
        </Text>
      );
    }

    if (isFlow && nextActivityName) {
      return (
        <Text
          fontSize={16}
          lineHeight={24}
          letterSpacing={0.5}
          color="$on_surface"
        >
          {t('unity:error_message_flow')}
          <Text
            fontSize={16}
            lineHeight={24}
            letterSpacing={0.15}
            fontWeight="700"
            color="$on_surface"
          >
            {nextActivityName}
          </Text>
        </Text>
      );
    }

    return (
      <Text
        fontSize={16}
        lineHeight={24}
        letterSpacing={0.5}
        color="$on_surface"
      >
        {t('unity:error_message')}
      </Text>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <Box flex={1} bg="$on_surface_alpha30" ai="center" jc="center">
        <Center>
          <Box bg="$surface" borderRadius={28} mx={16} overflow="hidden">
            {/* Title */}
            <Box pt={20} pl={32} pr={20} pb={16}>
              <Text fontSize={24} lineHeight={32} color="$on_surface">
                {title}
              </Text>
            </Box>

            {/* Content */}
            <Box px={32} py={12}>
              {renderContent()}
            </Box>

            {/* Actions */}
            <Box pt={24} pb={32} px={32} ai="center">
              <Box w={canRestart ? '100%' : undefined}>
                <SubmitButton
                  mode="primary"
                  onPress={canRestart ? onRestart ?? onDismiss : onDismiss}
                >
                  {canRestart
                    ? t('unity:restart_primary')
                    : t('unity:error_ok')}
                </SubmitButton>
              </Box>

              {canRestart && (
                <Box mt={16}>
                  <TouchableOpacity onPress={onDismiss}>
                    <Text
                      fontSize={16}
                      lineHeight={24}
                      letterSpacing={0.15}
                      color="$primary"
                    >
                      {secondaryActionLabel}
                    </Text>
                  </TouchableOpacity>
                </Box>
              )}
            </Box>
          </Box>
        </Center>
      </Box>
    </Modal>
  );
};
