import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@app/shared/lib';
import { YStack, Text, BoxProps } from '@app/shared/ui';

import ConsentCheckBox from './ConsentCheckBox';
import { onDataSharingConsentDetails } from '../lib';
import { actions } from '../model';
import { selectAppletConsents } from '../model/selectors';

type Props = {
  appletId: string;
} & BoxProps;

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

function SharedContentConsent({ appletId, ...boxProps }: Props) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const consents = useAppSelector(state =>
    selectAppletConsents(state, appletId),
  );

  const toggleShareConsent = () => {
    dispatch(
      actions.shareConsentChanged({
        appletId,
        value: !consents?.shareToPublic,
      }),
    );
  };

  const toggleMediaConsent = () => {
    dispatch(
      actions.mediaConsentChanged({
        appletId,
        value: !consents?.shareMediaToPublic,
      }),
    );
  };

  return (
    <YStack {...boxProps} space={10}>
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

export default SharedContentConsent;
