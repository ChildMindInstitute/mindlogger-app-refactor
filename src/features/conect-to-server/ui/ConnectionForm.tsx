import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppForm } from '@app/shared/lib';
import { Box, BoxProps, CheckBox, Text, XStack, Button } from '@app/shared/ui';
import { InputField } from '@app/shared/ui/form';
import { colors } from '@shared/lib';

import { ConnectionFormSchema } from '../model';

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
});

type Props = {
  onDisconnect: () => void;
  onConnect: () => void;
  onRememberConnection: () => void;
  shouldRememberConnection: boolean;
  connected: boolean;
  port: number;
  ipAddress: string;
} & BoxProps;

export const ConnectionForm: FC<Props> = ({
  onDisconnect,
  onConnect,
  onRememberConnection,
  connected,
  ipAddress,
  port,
  shouldRememberConnection,
  ...props
}) => {
  const { t } = useTranslation();
  const { form, submit } = useAppForm(ConnectionFormSchema, {
    onSubmitSuccess: onConnect,
    defaultValues: {
      ipAddress,
      port,
    },
  });
  const disconnect = () => {
    onDisconnect();
  };

  return (
    <Box {...props}>
      <FormProvider {...form}>
        <Text
          textAlign="center"
          mb="$3"
          color="$darkerGrey3"
          fontSize={24}
          fontWeight="900"
        >
          {t('live_connection:connect_to_server')}
        </Text>

        <Text color="$darkerGrey3" fontSize={18} fontWeight="700">
          {t('live_connection:ip')}:
        </Text>

        <Box borderColor="$darkerGrey3" borderWidth={0.5} py="$2" px="$1">
          <InputField
            editable={!connected}
            name="ipAddress"
            mode="dark"
            placeholder=""
          />
        </Box>

        <Text color="$darkerGrey3" fontSize={18} fontWeight="700">
          {t('live_connection:port')}:
        </Text>

        <Box
          borderColor="$darkerGrey3"
          borderWidth={0.5}
          py="$2"
          px="$1"
          mb="$5"
        >
          <InputField
            mode="dark"
            editable={!connected}
            name="port"
            keyboardType="number-pad"
            placeholder=""
          />
        </Box>

        <XStack onPress={onRememberConnection} ai="center" mb="$5">
          <CheckBox
            style={styles.checkbox}
            boxType="square"
            lineWidth={2}
            onTintColor={colors.darkerGrey3}
            tintColor={colors.darkerGrey3}
            onCheckColor={colors.white}
            onFillColor={colors.darkerGrey3}
            onAnimationType="fade"
            offAnimationType="fade"
            animationDuration={0.2}
            value={shouldRememberConnection}
          />

          <Text fontWeight="900" color="$darkerGrey2" fontSize={16}>
            {t('live_connection:remember')}
          </Text>
        </XStack>

        {connected ? (
          <Button br={4} onPress={submit}>
            {t('live_connection:disconnect')}
          </Button>
        ) : (
          <Button br={4} onPress={disconnect}>
            {t('live_connection:connect')}
          </Button>
        )}
      </FormProvider>
    </Box>
  );
};
