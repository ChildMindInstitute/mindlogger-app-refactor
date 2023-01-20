import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';

import { Text, YStack, XStack } from '@shared/ui';

const AppletsDetailsScreen: FC = () => {
  const { t } = useTranslation();
  return (
    <YStack bg="$secondary" jc={'flex-start'} flex={1}>
      <CalendarProvider date={new Date().toISOString()}>
        <WeekCalendar
          minDate={new Date().toISOString()}
          maxDate={new Date().toISOString()}
          onDayPress={day => console.log(day)}
          allowShadow={false}
        />
      </CalendarProvider>

      <XStack py="$2.5" px="$2" ai="center" bbc="$grey" bbw={1}>
        <Text color="$darkerGrey">{t('additional:in_progress')}</Text>
      </XStack>
    </YStack>
  );
};

export default AppletsDetailsScreen;
