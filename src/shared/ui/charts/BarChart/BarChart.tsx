import { FC, useMemo } from 'react';

import { format } from 'date-fns';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryScatter,
} from 'victory-native';

import { DAYS_OF_WEEK_NUMBERS } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { getCurrentWeekDates, range } from '@app/shared/lib/utils/common';
import { areDatesEqual } from '@app/shared/lib/utils/dateTime';

import { getWeekDaysWithLocale } from '../lib/getWeekDaysWithLocale';
import { ChartAxisDot, ChartItem } from '../types/types';

type BarChartDataItem = {
  date: string;
  value: number | null;
};

type Props = {
  data: Array<ChartItem>;
};

export const BarChart: FC<Props> = ({ data }) => {
  const dateFormat = 'yyyy dd MM';
  const getXAxisDots = (): Array<ChartAxisDot> =>
    range(8).map(item => ({ dot: item + 1, value: 0 }));

  const barChartData: Array<BarChartDataItem> = useMemo(() => {
    const currentWeekDates = getCurrentWeekDates();

    return currentWeekDates.map(currentWeekDate => {
      return {
        date: format(currentWeekDate, dateFormat),
        value:
          data.find(dataItem => areDatesEqual(dataItem.date, currentWeekDate))
            ?.value || null,
      };
    });
  }, [data]);

  const daysOfWeek = getWeekDaysWithLocale();

  return (
    <VictoryChart>
      <VictoryScatter
        style={{ data: { fill: palette.lighterGrey } }}
        data={getXAxisDots()}
        x="dot"
        y="value"
        size={5}
      />

      <VictoryAxis
        tickValues={DAYS_OF_WEEK_NUMBERS}
        style={{
          axis: { stroke: palette.lighterGrey, fill: palette.lightGrey2 },
          axisLabel: { fill: palette.lighterGrey },
          tickLabels: { fill: palette.grey },
        }}
        tickCount={6}
        tickFormat={(_, index) => {
          return daysOfWeek[index];
        }}
      />

      <VictoryBar
        style={{
          data: { fill: palette.primary },
          labels: { padding: -20, fill: palette.white },
        }}
        labels={({ datum }) => datum.value}
        data={barChartData}
        x="date"
        y="value"
      />
    </VictoryChart>
  );
};
