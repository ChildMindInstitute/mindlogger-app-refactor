import { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { colors, useAppDispatch, useAppSelector } from '@app/shared/lib';
import { useAppForm, useTCPSocket } from '@app/shared/lib';
import {
  Box,
  BoxProps,
  Text,
  XStack,
  Button,
  ActivityIndicator,
} from '@app/shared/ui';
import { CheckBoxField, InputField } from '@app/shared/ui/form';
import { LiveConnectionModel } from '@entities/liveConnection';

import { ConnectionFormSchema } from '../model';

type Props = {
  onSubmitSuccess: () => void;
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
    color: colors.errorRed,
    fontSize: 18,
  },
});

export const ConnectionForm: FC<Props> = ({ onSubmitSuccess, ...props }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const connection = useAppSelector(
    LiveConnectionModel.selectors.selectLiveConnectionHistory,
  );

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
        LiveConnectionModel.actions.setHistory({
          ipAddress,
          port,
          remember: Boolean(remember),
        }),
      );
    },
    defaultValues: {
      ipAddress: connection?.ipAddress,
      port: connection?.port,
      remember: connection?.remember,
    },
    onSubmitFail: () => {
      setError(t('live_connection:connection_set_error'));
    },
  });

  const disconnect = () => {
    const remember = form.getValues('remember');

    if (!remember) {
      dispatch(LiveConnectionModel.actions.setDefaultHistory());
    }

    closeConnection();
    onSubmitSuccess();
  };

  return (
    <Box {...props} onPress={e => e.stopPropagation()}>
      <FormProvider {...form}>
        <XStack justifyContent="center">
          <Text
            textAlign="center"
            mb={20}
            color="$darkerGrey3"
            fontSize={20}
            fontWeight="900"
            mr={6}
          >
            {t('live_connection:connect_to_server')}
          </Text>

          {connecting && <ActivityIndicator size="small" mb={18} />}
        </XStack>

        <Text color="$darkerGrey3" fontSize={18} fontWeight="700">
          {t('live_connection:ip')}:
        </Text>

        <Box borderColor="$darkerGrey2" px={4} borderWidth={0.5}>
          <InputField
            editable={!connected}
            name="ipAddress"
            mode="dark"
            style={[
              styles.input,
              {
                color: connected ? colors.grey2 : colors.darkerGrey2,
                borderBottomColor: connected
                  ? colors.grey2
                  : colors.darkerGrey2,
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
            name="port"
            style={[
              styles.input,
              {
                color: connected ? colors.grey2 : colors.darkerGrey2,
                borderBottomColor: connected
                  ? colors.grey2
                  : colors.darkerGrey2,
              },
            ]}
            keyboardType="number-pad"
            placeholder=""
          />
        </Box>

        <XStack ai="center" my={8}>
          <CheckBoxField
            name="remember"
            onCheckColor={colors.white}
            onFillColor={colors.grey}
            onTintColor={colors.grey}
            tintColor={colors.grey}
            disabled={connected}
          >
            <Text
              fontWeight="900"
              ml={12}
              color={connected ? colors.grey2 : colors.darkerGrey2}
              fontSize={16}
            >
              {t('live_connection:remember')}
            </Text>
          </CheckBoxField>
        </XStack>

        {(error && <Text style={styles.error}>{error}</Text>) || <></>}

        {connected ? (
          <Button br={4} mt={10} onPress={disconnect}>
            {t('live_connection:disconnect')}
          </Button>
        ) : (
          <Button br={4} mt={10} onPress={submit}>
            {t('live_connection:connect')}
          </Button>
        )}
      </FormProvider>
    </Box>
  );
};
