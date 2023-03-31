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

import { ChartItem } from '../types';

type Props = {
  data: Array<ChartItem>;
};

const LineChart: FC<Props> = ({ data }) => {
  const generateXAxisDots = () =>
    Array.from(Array(8).keys()).map(item => ({ dot: item, value: 0 }));

  const generateYAxisDots = () =>
    Array.from(Array(6).keys()).map(item => ({ dot: 1, value: item * 2 }));

  const mappedData = useMemo(() => {
    const dateFormat = 'yyyy dd MM';
    const currentWeekDates = getCurrentWeekDates(dateFormat);

    const formattedDataDate = () =>
      data.map(dataItem => ({
        ...dataItem,
        date: format(new Date(dataItem.date), dateFormat),
      }));

    return currentWeekDates.map(currentWeekDate => {
      return {
        date: currentWeekDate,
        value:
          formattedDataDate().find(
            newDateItem => newDateItem.date === currentWeekDate,
          )?.value || null,
      };
    });
  }, [data]);

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

        <VictoryAxis
          style={{ axis: { stroke: colors.lightGrey } }}
          dependentAxis
          tickFormat={() => null}
          domain={{ y: [0, 10] }}
        />

        <VictoryLine
          style={{ data: { stroke: colors.primary } }}
          data={mappedData}
          x="date"
          y="value"
        />

        <VictoryScatter
          style={{ data: { fill: colors.primary } }}
          data={mappedData}
          x="date"
          y="value"
          size={5}
        />
      </VictoryChart>
    </Box>
  );
};

export default LineChart;
