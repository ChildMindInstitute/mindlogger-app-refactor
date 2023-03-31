import { FC, useCallback, useMemo } from 'react';

import { format } from 'date-fns';
import { VictoryAxis, VictoryChart, VictoryScatter } from 'victory-native';

import {
  colors,
  DAYS_OF_WEEK_NUMBERS,
  DAYS_OF_WEEK_SHORT_NAMES,
  getCurrentWeekDates,
} from '@shared/lib';

import { Box } from '../..';
import { ChartItem } from '../types';

type TimelineChartOption = {
  name: string;
  value: number;
};

type ChartAxisDot = {
  dot: number;
  value: number;
};

type Timeline = { date: Date; value: number | null };

type TimelineChartData = {
  optionName: string;
  timelines: Array<Timeline>;
};

type Props = {
  options: Array<TimelineChartOption>;
  data: Array<ChartItem>;
};

const TimelineChart: FC<Props> = ({ data, options }) => {
  const dateFormat = 'yyyy dd MM';

  const generateXAxisDots = (): Array<ChartAxisDot> =>
    Array.from(Array(7).keys()).map(item => ({ dot: item, value: 0 }));

  const getFormattedDateData: () => Array<{ date: string; value: number }> =
    useCallback(
      () =>
        data.map(dataItem => ({
          ...dataItem,
          date: format(dataItem.date, dateFormat),
        })),
      [data],
    );

  const getValueForChartItem: (
    option: TimelineChartOption,
    currentWeekDate: Date,
  ) => number | null = useCallback(
    (option: TimelineChartOption, currentWeekDate: Date) => {
      const formattedDataDates = getFormattedDateData();
      const chartItem = formattedDataDates.find(newDateItem => {
        return (
          newDateItem.date === format(currentWeekDate, dateFormat) &&
          newDateItem.value === option.value
        );
      });

      return !isNaN(Number(chartItem?.value)) ? chartItem!.value : null;
    },
    [getFormattedDateData],
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

  const getScatterDots = (chartDataItem: TimelineChartData) => {
    return chartDataItem.timelines.map((timeline, i) => {
      return {
        y: 0,
        x: timeline.value !== null ? i : null,
      };
    });
  };

  return (
    <Box>
      {timelineChartData.map(option => (
        <VictoryChart key={option.optionName} height={60}>
          <VictoryScatter
            style={{ data: { fill: colors.lighterGrey } }}
            data={generateXAxisDots()}
            x="dot"
            y="value"
            domain={[0, 6]}
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

          <VictoryScatter
            data={getScatterDots(option)}
            x="x"
            y="y"
            size={5}
            style={{ data: { fill: colors.primary } }}
          />
        </VictoryChart>
      ))}
    </Box>
  );
};

export default TimelineChart;
