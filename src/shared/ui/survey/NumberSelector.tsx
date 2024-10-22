import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Dropdown } from '../Dropdown';

type NumberSelectorConfig = {
  max: number;
  min: number;
};

type Props = {
  config: NumberSelectorConfig;
  value: string;
  onChange: (value: string) => void;
};

export const NumberSelector: FC<Props> = ({ config, value, onChange }) => {
  const { t } = useTranslation();

  const numberRange = useMemo(
    () =>
      Array.from(
        { length: config.max - config.min + 1 },
        (_, index) => index + config.min,
      ).map(item => ({ label: String(item), value: String(item) })),
    [config],
  );

  const mappedValue = useMemo(
    () => (value ? { label: String(value), value: value } : undefined),
    [value],
  );

  return (
    <Dropdown
      onValueChange={onChange}
      placeholder={t('select:select_one')}
      items={numberRange}
      value={mappedValue}
    />
  );
};
