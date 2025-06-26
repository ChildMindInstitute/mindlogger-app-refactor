import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';

import { ChangeLanguageSelector } from '@app/features/change-language/ui/ChangeLanguageSelector';

export const ChangeLanguageScreen: FC = () => {
  const navigation = useNavigation();

  const onLanguageChanged = () => {
    navigation.goBack();
  };

  return (
    <ChangeLanguageSelector
      onLanguageChanged={onLanguageChanged}
      px={16}
      my={32}
    />
  );
};
