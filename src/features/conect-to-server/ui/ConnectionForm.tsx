import { FC, useState } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@app/shared/lib';
import { useAppForm, useTCPSocket } from '@app/shared/lib';
import { Box, BoxProps, Text, XStack, Button } from '@app/shared/ui';
import { CheckBoxField, InputField } from '@app/shared/ui/form';
import { LiveConnectionModel } from '@entities/liveConnection';

import { ConnectionFormSchema } from '../model';

type Props = {
  onSubmitSuccess: () => void;
} & BoxProps;

export const ConnectionForm: FC<Props> = ({ onSubmitSuccess, ...props }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const connection = useAppSelector(
    LiveConnectionModel.selectors.selectLiveConnectionHistory,
  );

  // TODO: add error message to the form
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');

  const { connect, connected, closeConnection } = useTCPSocket({
    onError: () => {
      // TODO: move it to translations
      setError('Connection failed. Please double check ip and port');
    },
    onConnected: () => {
      onSubmitSuccess();
    },
  });

  const { form, submit } = useAppForm(ConnectionFormSchema, {
    onSubmitSuccess: data => {
      const { ipAddress, port, remember } = data;

      connect(ipAddress, +port);

      if (remember) {
        dispatch(
          LiveConnectionModel.actions.setHistory({
            ipAddress,
            port,
            remember: Boolean(remember),
          }),
        );
      } else {
        dispatch(LiveConnectionModel.actions.clearHistory());
      }
    },
    defaultValues: {
      ipAddress: connection?.ipAddress,
      port: connection?.port,
      remember: connection?.remember,
    },
    onSubmitFail: () => {
      setError('Cannot set connection');
    },
  });

  console.log(form.formState);

  const disconnect = () => {
    closeConnection();
    // TODO: add toast message
  };

  return (
    <Box {...props} onPress={e => e.stopPropagation()}>
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
            // keyboardType="number-pad"
            placeholder=""
          />
        </Box>

        <XStack ai="center" mb="$5">
          <CheckBoxField name="remember" />

          <Text fontWeight="900" color="$darkerGrey2" fontSize={16}>
            {t('live_connection:remember')}
          </Text>
        </XStack>

        {connected ? (
          <Button br={4} onPress={disconnect}>
            {t('live_connection:disconnect')}
          </Button>
        ) : (
          <Button br={4} onPress={submit}>
            {t('live_connection:connect')}
          </Button>
        )}
      </FormProvider>
    </Box>
  );
};
