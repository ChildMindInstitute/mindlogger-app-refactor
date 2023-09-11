import { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@app/shared/lib';
import { useAppForm, useTCPSocket } from '@app/shared/lib';
import { Box, BoxProps, CheckBox, Text, XStack, Button } from '@app/shared/ui';
import { InputField } from '@app/shared/ui/form';
import { LiveConnectionModel } from '@entities/liveConnection';
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
  onSubmitSuccess: () => void;
} & BoxProps;

export const ConnectionForm: FC<Props> = ({ onSubmitSuccess, ...props }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const formDefaultValues = useAppSelector(
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
      connect(data.ipAddress, data.port);
      const remember = true;
      // @todo connect to form
      if (remember) {
        dispatch(LiveConnectionModel.actions.setHistory(data));
      } else {
        dispatch(LiveConnectionModel.actions.clearHistory());
      }
    },
    defaultValues: formDefaultValues ?? {},
  });

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
            keyboardType="number-pad"
            placeholder=""
          />
        </Box>

        <XStack onPress={() => {}} ai="center" mb="$5">
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
            // TODO: connect to FORM
            value={!!formDefaultValues}
          />

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
