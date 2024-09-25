import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Language } from '@app/shared/lib/types/language';
import { changeLanguage } from '@app/shared/lib/utils/common';
import { BoxProps, YStack } from '@app/shared/ui/base';
import { RowButton } from '@app/shared/ui/RowButton';

type Props = {
  onLanguageChanged: () => void;
} & BoxProps;

export const ChangeLanguageSelector: FC<Props> = props => {
  const { onLanguageChanged } = props;
  const { t, i18n } = useTranslation();
  const languagesAvailable = Object.keys(
    i18n.services.resourceStore.data,
  ) as Language[];
  const { resolvedLanguage } = i18n;

  const onLanguagePress = async (locale: Language) => {
    if (locale === resolvedLanguage) {
      return;
    }
    await changeLanguage(locale);
    onLanguageChanged();
  };

  return (
    <YStack accessibilityLabel="change-language-list" {...props}>
      {languagesAvailable.map(locale => {
        return (
          <RowButton
            accessibilityLabel={`change-language-button-${locale}`}
            onPress={() => onLanguagePress(locale)}
            key={`${locale}`}
            bg={resolvedLanguage === locale ? '$aqua' : 'transparent'}
            title={t(`language_screen:${locale}`)}
          />
        );
      })}
    </YStack>
  );
};
