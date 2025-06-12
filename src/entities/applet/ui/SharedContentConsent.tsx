import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { ConsentCheckBox } from './ConsentCheckBox';
import { onDataSharingConsentDetails } from '../lib/alerts';
import { selectAppletConsents } from '../model/selectors';
import { appletActions } from '../model/slice';
import { YStackProps } from '@tamagui/stacks';

type Props = {
  appletId: string;
} & YStackProps;

const Public = () => {
  const { t } = useTranslation();

  return (
    <Text
      fontWeight="bold"
      color="$primary"
      pressStyle={StyleSheet.flatten({ opacity: 0.2 })}
      onPress={onDataSharingConsentDetails}
    >
      {t('data_sharing:public')}
    </Text>
  );
};

export function SharedContentConsent({ appletId, ...boxProps }: Props) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const consents = useAppSelector(state =>
    selectAppletConsents(state, appletId),
  );

  const toggleShareConsent = () => {
    dispatch(
      appletActions.shareConsentChanged({
        appletId,
        value: !consents?.shareToPublic,
      }),
    );
  };

  const toggleMediaConsent = () => {
    dispatch(
      appletActions.mediaConsentChanged({
        appletId,
        value: !consents?.shareMediaToPublic,
      }),
    );
  };

  return (
    <YStack {...boxProps} gap={10}>
      <ConsentCheckBox
        value={!!consents?.shareToPublic}
        onChange={toggleShareConsent}
        label={
          <Text ml={10}>
            {t('data_sharing:consent')} {<Public />}.
          </Text>
        }
      />

      <ConsentCheckBox
        value={!!consents?.shareMediaToPublic}
        onChange={toggleMediaConsent}
        label={
          <Text ml={10}>
            {t('data_sharing:media_consent')} {<Public />}.
          </Text>
        }
        ml={26}
      />
    </YStack>
  );
}
