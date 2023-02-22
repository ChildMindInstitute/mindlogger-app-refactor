import { FC } from 'react';

import RadioActivityItem from './RadioActivityItem';
import RadioOption from './types';
import { Box } from '../..';

type Config = {
  isOptionOrderRandomized: boolean;
  options: Array<RadioOption>;
  isOptionalText: boolean;
};

const config: Config = {
  isOptionOrderRandomized: true,
  options: [
    {
      name: { en: 'No' },
      value: '1',
      color: '',
      isVisible: true,
      description: 'Hello',
      image:
        'https://i.discogs.com/J4bH_-A4UcQHFSUBDyyqXbTzr7XWM8S0NfNoYgwXAiI/rs:fit/g:sm/q:90/h:400/w:400/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTE0MDAz/MTctMTMzNTcxNzQ3/Ni5wbmc.jpeg',
    },
    {
      name: { en: 'Option 1' },
      value: '2',
      color: '',
      description: '',
      isVisible: true,
      image:
        'https://i.discogs.com/J4bH_-A4UcQHFSUBDyyqXbTzr7XWM8S0NfNoYgwXAiI/rs:fit/g:sm/q:90/h:400/w:400/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTE0MDAz/MTctMTMzNTcxNzQ3/Ni5wbmc.jpeg',
    },
    {
      name: { en: 'Option 2' },
      value: '3',
      color: '',
      description: 'Once more',
      isVisible: true,
    },
    {
      name: { en: 'Yes' },
      value: '4',
      color: '',
      isVisible: true,
      description: '',
    },
    {
      name: { en: 'No' },
      value: '5',
      color: '',
      isVisible: true,
      description: '',
    },
    {
      name: { en: 'Option 1' },
      value: '6',
      description: '',
      color: '',
      isVisible: true,
    },
    {
      name: { en: 'Option 2' },
      value: '7',
      color: '',
      isVisible: true,
      description: 'Test op 2',
    },
  ],
  isOptionalText: true,
};

export const RadioPage: FC = () => {
  return (
    <Box style={{ marginTop: 39, paddingHorizontal: 16 }}>
      <RadioActivityItem config={config} onResponseSet={() => {}} />
    </Box>
  );
};
