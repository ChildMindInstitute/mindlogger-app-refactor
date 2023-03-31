import { FC, useMemo } from 'react';

import { format } from 'date-fns';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

import {
  colors,
  DAYS_OF_WEEK_NUMBERS,
  DAYS_OF_WEEK_SHORT_NAMES,
  getCurrentWeekDates,
} from '@app/shared/lib';
import { Box } from '@shared/ui';

import { ChartAxisDot, ChartItem } from '../types';

type LineChartDataItem = {
  date: string;
  value: number | null;
};

type Props = {
  data: Array<ChartItem>;
};

const LineChart: FC<Props> = ({ data }) => {
  const dateFormat = 'yyyy dd MM';

  const generateXAxisDots = (): Array<ChartAxisDot> =>
    Array.from(Array(8).keys()).map(item => ({ dot: item, value: 0 }));

  const generateYAxisDots = (): Array<ChartAxisDot> =>
    Array.from(Array(6).keys()).map(item => ({ dot: 1, value: item * 2 }));

  const formattedDataDate: Array<{ date: string; value: number }> = useMemo(
    () =>
      data.map(dataItem => ({
        ...dataItem,
        date: format(dataItem.date, dateFormat),
      })),
    [data],
  );

  const lineChartData: Array<LineChartDataItem> = useMemo(() => {
    const currentWeekDates = getCurrentWeekDates();

    return currentWeekDates.map(currentWeekDate => {
      return {
        date: format(currentWeekDate, dateFormat),
        value:
          formattedDataDate.find(
            newDateItem =>
              newDateItem.date === format(currentWeekDate, dateFormat),
          )?.value || null,
      };
    });
  }, [formattedDataDate]);

  return (
    <Box>
      <VictoryChart>
        <VictoryScatter
          style={{ data: { fill: colors.lightGrey2 } }}
          data={generateXAxisDots()}
          x="dot"
          y="value"
          size={5}
        />

        <VictoryScatter
          style={{ data: { fill: colors.lightGrey2 } }}
          data={generateYAxisDots()}
          x="dot"
          y="value"
          size={5}
        />

        <VictoryAxis
          style={{ axis: { stroke: colors.lightGrey } }}
          dependentAxis
          tickFormat={() => null}
          domain={{ y: [0, 10] }}
        />

        <VictoryAxis
          tickValues={DAYS_OF_WEEK_NUMBERS}
          style={{
            axis: { stroke: colors.lighterGrey, fill: colors.lightGrey2 },
            axisLabel: { fill: colors.lighterGrey },
            tickLabels: { fill: colors.grey },
          }}
          tickCount={7}
          tickFormat={(_, index) => {
            return DAYS_OF_WEEK_SHORT_NAMES[index];
          }}
        />

        <VictoryLine
          style={{ data: { stroke: colors.primary } }}
          data={lineChartData}
          x="date"
          y="value"
        />

        <VictoryScatter
          style={{ data: { fill: colors.primary } }}
          data={lineChartData}
          x="date"
          y="value"
          size={5}
        />
      </VictoryChart>
    </Box>
  );
};

export default LineChart;
