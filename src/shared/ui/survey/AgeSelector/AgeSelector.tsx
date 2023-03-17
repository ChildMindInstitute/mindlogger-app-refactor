import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import AgeSelectorConfig from './types';
import Dropdown from '../../Dropdown';

type SelectedAgeValue = {
  value: string;
};

type Props = {
  config: AgeSelectorConfig;
  value?: string;
  onChange: (value: SelectedAgeValue) => void;
};

const AgeSelector: FC<Props> = ({ config, value, onChange }) => {
  const { t } = useTranslation();

  const ageRange = useMemo(
    () =>
      Array.from(
        { length: config.maxAge - config.minAge + 1 },
        (_, index) => index + config.minAge,
      ).map(item => ({ label: String(item), value: String(item) })),
    [config],
  );

  const mappedValue = useMemo(
    () => (value ? { label: String(value), value: value } : undefined),
    [value],
  );

  const onValueChange = (selection: string) => {
    onChange({ value: selection });
  };

  return (
    <Dropdown
      onValueChange={onValueChange}
      placeholder={t('select:select_one')}
      items={ageRange}
      value={mappedValue}
    />
  );
};

export default AgeSelector;
