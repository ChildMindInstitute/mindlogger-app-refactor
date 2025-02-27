import { FC, PropsWithChildren } from 'react';

import { FontLanguage } from '@tamagui/core';

import { useFontLanguage } from '@app/shared/hooks/useFontLanguage';

export const FontLanguageProvider: FC<PropsWithChildren> = ({ children }) => {
  const fontLanguage = useFontLanguage();

  return <FontLanguage body={fontLanguage}> {children}</FontLanguage>;
};
