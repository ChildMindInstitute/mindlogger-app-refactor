import { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppletStreamingDetails } from '@app/entities/applet/lib/hooks/useAppletStreamingDetails';
import { selectStreamingSettings } from '@app/entities/streaming/model/selectors';
import { streamingAction } from '@app/entities/streaming/model/slice';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { useAppForm } from '@app/shared/lib/hooks/useAppForm';
import { useTCPSocket } from '@app/shared/lib/tcp/useTCPSocket';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box, BoxProps, XStack } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { CheckBoxField } from '@app/shared/ui/form/CheckBoxField';
import { InputField } from '@app/shared/ui/form/InputField';
import { Text } from '@app/shared/ui/Text';

import { ConnectionFormSchema } from '../model/ConnectionFormSchema';

type Props = {
  onSubmitSuccess: () => void;
  appletId: string;
} & BoxProps;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  error: {
    color: palette.error,
    fontSize: 18,
  },
});

export const ConnectionForm: FC<Props> = ({
  onSubmitSuccess,
  appletId,
  ...props
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const streamingDetails = useAppletStreamingDetails(appletId);

  const connection = useAppSelector(selectStreamingSettings);

  const [error, setError] = useState('');

  const { connect, connected, connecting, closeConnection } = useTCPSocket({
    onError: () => {
      setError(t('live_connection:connection_error'));
    },
    onConnected: () => {
      setError('');
      onSubmitSuccess();
    },
  });

  const { form, submit } = useAppForm(ConnectionFormSchema, {
    onSubmitSuccess: data => {
      const { ipAddress, port, remember } = data;

      connect(ipAddress, +port);

      dispatch(
        streamingAction.connectionEstabilished({
          ipAddress,
          port,
          remember: Boolean(remember),
        }),
      );
    },
    defaultValues: {
      ipAddress:
        (connection?.ipAddress || streamingDetails?.streamIpAddress) ?? '',
      port: (connection?.port || streamingDetails?.streamPort) ?? '',
      remember: connection?.remember ?? true,
    },
    onSubmitFail: () => {
      setError(t('live_connection:connection_set_error'));
    },
  });

  const disconnect = () => {
    const remember = form.getValues('remember');

    if (!remember) {
      dispatch(streamingAction.reset());
    }

    closeConnection();
    onSubmitSuccess();
  };

  return (
    <Box
      accessibilityLabel="connection-form"
      {...props}
      onPress={e => e.stopPropagation()}
    >
      <FormProvider {...form}>
        <XStack justifyContent="center">
          <Text
            textAlign="center"
            mb={20}
            color="$darkerGrey3"
            fontSize={20}
            fontWeight="700"
            mr={6}
          >
            {t('live_connection:connect_to_server')}
          </Text>

          {connecting && (
            <ActivityIndicator
              accessibilityLabel="connection-form-loader"
              size="small"
              mb={18}
            />
          )}
        </XStack>

        <Text color="$darkerGrey3" fontSize={18} fontWeight="700">
          {t('live_connection:ip')}:
        </Text>

        <Box borderColor="$darkerGrey2" px={4} borderWidth={0.5}>
          <InputField
            editable={!connected}
            name="ipAddress"
            accessibilityLabel="connection-form-ip"
            mode="dark"
            style={[
              styles.input,
              {
                color: connected ? palette.grey2 : palette.darkerGrey2,
                borderBottomColor: connected
                  ? palette.grey2
                  : palette.darkerGrey2,
              },
            ]}
            placeholder=""
          />
        </Box>

        <Text color="$darkerGrey3" fontSize={18} mt={8} fontWeight="700">
          {t('live_connection:port')}:
        </Text>

        <Box borderColor="$darkerGrey2" px={4} mb={10} borderWidth={0.5}>
          <InputField
            mode="dark"
            editable={!connected}
            accessibilityLabel="connection-form-port"
            name="port"
            style={[
              styles.input,
              {
                color: connected ? palette.grey2 : palette.darkerGrey2,
                borderBottomColor: connected
                  ? palette.grey2
                  : palette.darkerGrey2,
              },
            ]}
            keyboardType="number-pad"
            placeholder=""
          />
        </Box>

        <XStack ai="center" my={8}>
          <CheckBoxField
            name="remember"
            accessibilityLabel="connection-form-remember"
            onCheckColor={palette.white}
            onFillColor={palette.grey}
            onTintColor={palette.grey}
            tintColor={palette.grey}
            disabled={connected}
          >
            <Text
              fontWeight="700"
              ml={12}
              color={connected ? palette.grey2 : palette.darkerGrey2}
              accessibilityLabel="connection-form-remember-status"
              fontSize={16}
            >
              {t('live_connection:remember')}
            </Text>
          </CheckBoxField>
        </XStack>

        {(error && (
          <Text accessibilityLabel="connection-form-error" style={styles.error}>
            {error}
          </Text>
        )) || <></>}

        {connected ? (
          <Button
            accessibilityLabel="connection-form-disconnect-btn"
            br={4}
            mt={10}
            onPress={disconnect}
          >
            {t('live_connection:disconnect')}
          </Button>
        ) : (
          <Button
            accessibilityLabel="connection-form-connect-btn"
            br={4}
            mt={10}
            isLoading={connecting}
            onPress={submit}
          >
            {t('live_connection:connect')}
          </Button>
        )}
      </FormProvider>
    </Box>
  );
};
