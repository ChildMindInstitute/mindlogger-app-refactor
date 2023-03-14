import { FC } from 'react';

import { colors } from '@app/shared/lib';
import { YStack, DateTimePicker, AlarmIcon, BedIcon } from '@shared/ui';

type TimeRangeValue = {
  from: string;
  to: string;
};

type Props = {
  value?: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
};

const TimeRangeItem: FC<Props> = ({
  value = { from: new Date().toString(), to: new Date().toString() },
  onChange,
}) => {
  const formatTime = (dateString: string) => new Date(dateString);

  const onFromChangeTime = (time: any) =>
    onChange({ ...value, from: time.toString() });

  const onToChangeTime = (time: any) =>
    onChange({ ...value, to: time.toString() });

  return (
    <YStack>
      <DateTimePicker
        label="From"
        onChange={onFromChangeTime}
        dateDisplayFormat="h:mm a"
        value={formatTime(value.from)}
        mode="time"
        iconAfter={<BedIcon color={colors.black} size={15} />}
      />

      <DateTimePicker
        onChange={onToChangeTime}
        label="To"
        mode="time"
        dateDisplayFormat="h:mm a"
        value={formatTime(value.to)}
        iconAfter={<AlarmIcon color={colors.black} size={15} />}
      />
    </YStack>
  );
};

export default TimeRangeItem;
