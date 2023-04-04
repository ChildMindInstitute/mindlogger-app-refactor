import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Box, HorizontalCalendar } from '@app/shared/ui';
import { BarChart } from '@app/shared/ui/charts';
import { AppletDetailsParamList } from '@screens/config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'Data'>;

const data = [
  {
    date: new Date('2023-04-06T21:00:00.000Z'),
    value: 5,
  },
  {
    date: new Date('2023-04-06T21:00:00.000Z'),
    value: 10,
  },
];

const AppletDataScreen: FC<Props> = () => {
  return (
    <Box flex={1}>
      <HorizontalCalendar mt={8} />
      <BarChart data={data} />
    </Box>
  );
};

export default AppletDataScreen;
