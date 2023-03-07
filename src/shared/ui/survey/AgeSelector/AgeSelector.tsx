import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import AgeSelectorConfig from './types';
import Dropdown from '../../Dropdown';

type SelectedAgeValue = {
  value: string | number;
};

type Props = {
  config: AgeSelectorConfig;
  value?: string | number;
  onChange: (value: SelectedAgeValue) => void;
};

const AgeSelector: FC<Props> = ({ config, value, onChange }) => {
  const { t } = useTranslation();

  const ageRange = useMemo(
    () =>
      Array.from({ length: config.maxAge - config.minAge + 1 }, (_, index) =>
        String(index + config.minAge),
      ).map(item => ({ label: String(item), value: item })),
    [config],
  );

  const mappedValue = useMemo(
    () => ({ label: String(value), value: String(value) }),
    [value],
  );

  const onValueChange = (selection: string | number) => {
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
