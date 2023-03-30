import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Box, HorizontalCalendar } from '@app/shared/ui';
import { TimelineChart } from '@app/shared/ui/charts';
import { AppletDetailsParamList } from '@screens/config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'Data'>;

const mockData = [
  {
    date: '2023-03-27T08:36:03.931000+00:00',
    value: 0,
  },
  {
    date: '2023-03-28T08:36:03.931000+00:00',
    value: 3,
  },
  {
    date: '2023-03-29T08:36:03.931000+00:00',
    value: 2,
  },
];

const mockOptions = [
  { name: 'Option 1', value: 0 },
  { name: 'Option 2', value: 1 },
  { name: 'Option 3', value: 2 },
  { name: 'Option 4', value: 3 },
];

const AppletDataScreen: FC<Props> = () => {
  return (
    <Box flex={1}>
      <HorizontalCalendar mt={8} />
      <TimelineChart data={mockData} options={mockOptions} />
    </Box>
  );
};

export default AppletDataScreen;
