import { FC, useMemo } from 'react';

import { format } from 'date-fns';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

import {
  ResponseConfig,
  SliderResponseConfig,
} from '@app/shared/api/services/AppletAnalyticsDto';
import { DAYS_OF_WEEK_NUMBERS } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { range, getCurrentWeekDates } from '@app/shared/lib/utils/common';
import { areDatesEqual } from '@app/shared/lib/utils/dateTime';

import { Box } from '../../base';
import { getWeekDaysWithLocale } from '../lib/getWeekDaysWithLocale';
import { ChartAxisDot, ChartItem } from '../types/types';

type LineChartDataItem = {
  date: string;
  value: number | null;
};

type Props = {
  data: Array<ChartItem>;
  config: ResponseConfig;
};

export const LineChart: FC<Props> = ({ data, config }) => {
  const dateFormat = 'yyyy dd MM';
  const { maxValue } = config as SliderResponseConfig;

  const getXAxisDots = (): Array<ChartAxisDot> =>
    range(8).map(item => ({ dot: item, value: 0 }));

  const getYAxisDots = (): Array<ChartAxisDot> =>
    range(maxValue + 1).map(item => ({ dot: 1, value: item * 2 }));

  const numberValueExists = (value: number | null) =>
    !!value || typeof value === 'number';

  const lineChartData: Array<LineChartDataItem> = useMemo(() => {
    const currentWeekDates = getCurrentWeekDates();

    return currentWeekDates.flatMap(currentWeekDate => {
      const currentWeekDayValues = data.map(dataItem =>
        areDatesEqual(dataItem.date, currentWeekDate) &&
        numberValueExists(dataItem.value) &&
        dataItem.value! < maxValue
          ? dataItem.value! * 2
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

  const daysOfWeek = getWeekDaysWithLocale();

  return (
    <Box>
      <VictoryChart>
        <VictoryScatter
          style={{ data: { fill: palette.surface_variant } }}
          data={getXAxisDots()}
          x="dot"
          y="value"
          size={5}
        />

        <VictoryScatter
          style={{ data: { fill: palette.surface_variant } }}
          data={getYAxisDots()}
          x="dot"
          y="value"
          size={5}
        />

        <VictoryAxis
          style={{ axis: { stroke: palette.surface_variant } }}
          dependentAxis
          tickFormat={() => ''}
        />

        <VictoryAxis
          tickValues={DAYS_OF_WEEK_NUMBERS}
          style={{
            axis: {
              stroke: palette.surface_variant,
              fill: palette.surface_variant,
            },
            axisLabel: { fill: palette.surface_variant },
            tickLabels: { fill: palette.outline },
          }}
          tickCount={7}
          tickFormat={(_, index) => {
            return daysOfWeek[index];
          }}
        />

        <VictoryLine
          style={{ data: { stroke: palette.primary } }}
          data={lineChartData}
          x="date"
          y="value"
        />

        <VictoryScatter
          style={{ data: { fill: palette.primary } }}
          data={lineChartData}
          x="date"
          y="value"
          size={5}
        />
      </VictoryChart>
    </Box>
  );
};
