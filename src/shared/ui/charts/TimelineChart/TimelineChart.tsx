import { FC, useMemo } from 'react';

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

type ChartRowItem = {
  optionName: string;
  timelines: Array<{ date: string; value?: number | null }>;
};

type Props = {
  options: Array<TimelineChartOption>;
  data: Array<ChartItem>;
};

const TimelineChart: FC<Props> = ({ data, options }) => {
  const generateXAxisDots = () =>
    Array.from(Array(7).keys()).map(item => ({ dot: item, value: 0 }));

  const mappedData = useMemo(() => {
    const dateFormat = 'yyyy dd MM';
    const currentWeekDates = getCurrentWeekDates(dateFormat) as Array<string>;

    const formattedDataDate = () =>
      data.map(dataItem => ({
        ...dataItem,
        date: format(new Date(dataItem.date), dateFormat),
      }));

    const formattedDates = formattedDataDate();

    const getValue = (option: TimelineChartOption, currentWeekDate: string) => {
      return formattedDates.find(newDateItem => {
        return (
          newDateItem.date === currentWeekDate &&
          newDateItem.value === option.value
        );
      })?.value;
    };

    const getTimelineItems = (option: TimelineChartOption) => {
      return currentWeekDates.map(currentWeekDate => {
        return {
          date: currentWeekDate,
          value: !isNaN(Number(getValue(option, currentWeekDate)))
            ? getValue(option, currentWeekDate)
            : null,
        };
      });
    };

    const res: Array<ChartRowItem> = options.map(option => {
      return {
        optionName: option.name,
        timelines: getTimelineItems(option),
      };
    });

    return res;
  }, [data, options]);

  const getScatterDots = (option: ChartRowItem) => {
    return option.timelines.map((timeline, i) => {
      return {
        y: 0,
        x: timeline.value !== null ? i : null,
      };
    });
  };

  return (
    <Box>
      {mappedData.map(option => (
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
