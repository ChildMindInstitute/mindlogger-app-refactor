import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import AgeSelectorConfigType from './types';
import Dropdown from '../../Dropdown';

type DropdownOnChangeValue = {
  value: string | number;
};

type Props = {
  config: AgeSelectorConfigType;
  value?: string | number;
  onChange: (value: DropdownOnChangeValue) => void;
};

const AgeSelector: FC<Props> = ({ config, value, onChange }) => {
  const { t } = useTranslation();

  const ageRange = useMemo(
    () =>
      Array.from(
        { length: config.maxAge - config.minAge + 1 },
        (_, index) => index + config.minAge,
      ),
    [config],
  );

  const onValueChange = (selection: string | number) => {
    onChange({ value: selection });
  };

  return (
    <Dropdown
      onValueChange={onValueChange}
      placeholder={t('select:select_one')}
      items={ageRange}
      value={value}
    />
  );
};

export default AgeSelector;
