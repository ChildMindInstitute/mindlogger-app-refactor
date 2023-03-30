import { FC, useMemo } from 'react';

import { format } from 'date-fns';
import { VictoryAxis, VictoryGroup, VictoryScatter } from 'victory-native';

import { colors, getCurrentWeekDates } from '@shared/lib';

import { Box, Text } from '../..';

type TimelineChartOption = {
  name: string;
  value: number;
};

type TimelineChartItem = {
  date: string;
  value: number;
};

type Props = {
  options: Array<TimelineChartOption>;
  data: Array<TimelineChartItem>;
};

const daysOfWeekNumber = [0, 1, 2, 3, 4, 5, 6];
const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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

    const getValue = (o: TimelineChartOption, currentWeekDate: string) => {
      return formattedDates.find(newDateItem => {
        return (
          newDateItem.date === currentWeekDate && newDateItem.value === o.value
        );
      })?.value;
    };

    const singleTimelineItems = (option: TimelineChartOption) => {
      return currentWeekDates.map(currentWeekDate => {
        return {
          date: currentWeekDate,
          value: !isNaN(Number(getValue(option, currentWeekDate)))
            ? getValue(option, currentWeekDate)
            : null,
        };
      });
    };

    const res = options.map(option => {
      return {
        optionName: option.name,
        timelines: singleTimelineItems(option),
      };
    });

    console.log(res[0].optionName, res[0].timelines);
    console.log(res[1].optionName, res[1].timelines);
    console.log(res[2].optionName, res[2].timelines);

    return res;
  }, [data, options]);

  return (
    <Box>
      {mappedData.map(option => (
        <>
          <Box>
            <Text>{option.optionName}</Text>
          </Box>

          <VictoryGroup key={option.optionName} height={60}>
            <VictoryScatter
              data={option.timelines.map((timeline, i) => {
                console.log(option.optionName, timeline);

                return {
                  y: 0,
                  x: timeline.value !== null ? i : null,
                };
              })}
              x="x"
              y="y"
              size={5}
              style={{ data: { fill: colors.primary } }}
            />

            <VictoryScatter
              style={{ data: { fill: colors.lightGrey2 } }}
              data={generateXAxisDots()}
              x="dot"
              y="value"
              domain={[0, 6]}
              size={5}
            />

            <VictoryAxis
              tickValues={daysOfWeekNumber}
              style={{
                axis: { stroke: colors.lightGrey2, fill: colors.lightGrey2 },
                axisLabel: { fill: colors.lightGrey2 },
              }}
              tickCount={7}
              tickFormat={(_, index) => {
                return dayNames[index];
              }}
            />
          </VictoryGroup>
        </>
      ))}
    </Box>
  );
};

export default TimelineChart;
