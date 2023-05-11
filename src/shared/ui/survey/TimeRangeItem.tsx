import { FC } from 'react';

import { format } from 'date-fns';

import { colors } from '@app/shared/lib';
import { YStack, DateTimePicker, AlarmIcon, BedIcon } from '@shared/ui';

type TimeRangeValue = {
  endTime: string;
  startTime: string;
};

type Props = {
  value?: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
};

const TimeRangeItem: FC<Props> = ({
  value = { startTime: new Date().toString(), endTime: new Date().toString() },
  onChange,
}) => {
  const transformTimeIntoDateObject = (dateString: string) =>
    new Date(dateString);

  const formatTime = (time: Date) => format(time, 'HH:MM');

  const onFromChangeTime = (time: Date) =>
    onChange({ ...value, startTime: formatTime(time) });

  const onToChangeTime = (time: Date) =>
    onChange({ ...value, endTime: formatTime(time) });

  return (
    <YStack>
      <DateTimePicker
        label="From"
        onChange={onFromChangeTime}
        dateDisplayFormat="h:mm a"
        value={transformTimeIntoDateObject(value.startTime)}
        mode="time"
        iconAfter={<BedIcon color={colors.grey2} size={15} />}
      />

      <DateTimePicker
        label="To"
        onChange={onToChangeTime}
        dateDisplayFormat="h:mm a"
        mode="time"
        value={transformTimeIntoDateObject(value.endTime)}
        iconAfter={<AlarmIcon color={colors.grey2} size={15} />}
      />
    </YStack>
  );
};

export default TimeRangeItem;
