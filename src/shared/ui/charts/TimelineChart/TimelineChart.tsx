import { FC, useCallback, useMemo } from 'react';

import { VictoryAxis, VictoryChart, VictoryScatter } from 'victory-native';

import {
  ResponseConfig,
  SelectionsResponseConfig,
} from '@app/shared/api/services/AppletAnalyticsDto';
import { DAYS_OF_WEEK_NUMBERS } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { range, getCurrentWeekDates } from '@app/shared/lib/utils/common';
import { areDatesEqual } from '@app/shared/lib/utils/dateTime';

import { Box } from '../../base';
import { getWeekDaysWithLocale } from '../lib/getWeekDaysWithLocale';
import { ChartAxisDot, ChartItem } from '../types/types';

type TimelineChartOption = {
  name: string;
  value: number;
};

type Timeline = { date: Date; value: number | null };

type TimelineChartData = {
  optionName: string;
  timelines: Array<Timeline>;
};

type Props = {
  config: ResponseConfig;
  data: Array<ChartItem>;
};

const getScatterDots = (chartDataItem: TimelineChartData) => {
  return chartDataItem.timelines.map((timeline, i) => {
    return {
      y: 0,
      x: timeline.value !== null ? i : null,
    };
  });
};

export const TimelineChart: FC<Props> = ({ data, config }) => {
  const { options } = config as SelectionsResponseConfig;

  const getXAxisDots = (): Array<ChartAxisDot> =>
    range(7).map(item => ({ dot: item, value: 0 }));

  const getValueForChartItem: (
    option: TimelineChartOption,
    currentWeekDate: Date,
  ) => number | null = useCallback(
    (option: TimelineChartOption, currentWeekDate: Date) => {
      const chartItem = data.find(dateItem => {
        return (
          areDatesEqual(dateItem.date, currentWeekDate) &&
          dateItem.value === option.value
        );
      });

      return !isNaN(Number(chartItem?.value)) ? chartItem!.value : null;
    },
    [data],
  );

  const getTimelineItems: (option: TimelineChartOption) => Array<Timeline> =
    useCallback(
      (option: TimelineChartOption) => {
        const currentWeekDates = getCurrentWeekDates();

        return currentWeekDates.map(currentWeekDate => {
          return {
            date: currentWeekDate,
            value: getValueForChartItem(option, currentWeekDate),
          };
        });
      },
      [getValueForChartItem],
    );

  const timelineChartData: Array<TimelineChartData> = useMemo(() => {
    return options.map(option => {
      return {
        optionName: option.name,
        timelines: getTimelineItems(option),
      };
    });
  }, [getTimelineItems, options]);

  const daysOfWeek = getWeekDaysWithLocale();

  return (
    <Box>
      {timelineChartData.map(option => (
        <VictoryChart key={option.optionName} height={60}>
          <VictoryScatter
            style={{ data: { fill: palette.surface_variant } }}
            data={getXAxisDots()}
            x="dot"
            y="value"
            domain={[0, 6]}
            size={5}
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

          <VictoryScatter
            data={getScatterDots(option)}
            x="x"
            y="y"
            size={5}
            style={{ data: { fill: palette.primary } }}
          />
        </VictoryChart>
      ))}
    </Box>
  );
};
