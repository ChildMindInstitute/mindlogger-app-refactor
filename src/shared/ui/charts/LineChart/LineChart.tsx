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

  const getXAxisDots = (): Array<ChartAxisDot> =>
    Array.from(Array(8).keys()).map(item => ({ dot: item, value: 0 }));

  const getYAxisDots = (): Array<ChartAxisDot> =>
    Array.from(Array(6).keys()).map(item => ({ dot: 1, value: item * 2 }));

  const lineChartData: Array<LineChartDataItem> = useMemo(() => {
    const currentWeekDates = getCurrentWeekDates();

    return currentWeekDates.map(currentWeekDate => {
      return {
        date: format(currentWeekDate, dateFormat),
        value:
          data.find(
            newDateItem =>
              format(newDateItem.date, dateFormat) ===
              format(currentWeekDate, dateFormat),
          )?.value || null,
      };
    });
  }, [data]);

  return (
    <Box>
      <VictoryChart>
        <VictoryScatter
          style={{ data: { fill: colors.lightGrey2 } }}
          data={getXAxisDots()}
          x="dot"
          y="value"
          size={5}
        />

        <VictoryScatter
          style={{ data: { fill: colors.lightGrey2 } }}
          data={getYAxisDots()}
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
