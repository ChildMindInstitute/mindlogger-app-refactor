import { FC, useMemo } from 'react';

import { format } from 'date-fns';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

import { ResponseConfig, SliderResponseConfig } from '@app/shared/api';
import {
  areDatesEqual,
  colors,
  DAYS_OF_WEEK_NUMBERS,
  DAYS_OF_WEEK_SHORT_NAMES,
  getCurrentWeekDates,
  range,
} from '@shared/lib';
import { Box } from '@shared/ui';

import { ChartAxisDot, ChartItem } from '../types';

type LineChartDataItem = {
  date: string;
  value: number | null;
};

type Props = {
  data: Array<ChartItem>;
  config: ResponseConfig;
};

const LineChart: FC<Props> = ({ data, config }) => {
  const dateFormat = 'yyyy dd MM';
  const { maxValue } = config as SliderResponseConfig;

  const getXAxisDots = (): Array<ChartAxisDot> =>
    range(8).map(item => ({ dot: item, value: 0 }));

  console.log(maxValue);

  console.log(data);

  const getYAxisDots = (): Array<ChartAxisDot> =>
    range(maxValue + 1).map(item => ({ dot: 1, value: item * 2 }));

  const lineChartData: Array<LineChartDataItem> = useMemo(() => {
    const currentWeekDates = getCurrentWeekDates();

    return currentWeekDates.flatMap(currentWeekDate => {
      const currentWeekDayValues = data.map(dataItem =>
        areDatesEqual(dataItem.date, currentWeekDate) &&
        dataItem.value &&
        dataItem.value < maxValue
          ? dataItem.value * 2
          : null,
      );

      const values = currentWeekDayValues.map(currentWeekDayValue => {
        return {
          date: format(currentWeekDate, dateFormat),
          value: currentWeekDayValue,
        };
      });

      return values;
    });
  }, [data, maxValue]);

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
