import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { XStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, HourMinute, isIphoneX } from '@shared/lib';
import { ListSeparator, BackButton, Text, Box } from '@shared/ui';
import TimeRemaining from '@shared/ui/TimeRemaining.tsx';

import HeaderProgress from './HeaderProgress.tsx';

type Props = {
  showWatermark: boolean;
  watermark?: string | null;
  activityName: string;
  flowId?: string;
  eventId: string;
  appletId: string;
  entityStartedAt: number;
  timer: HourMinute | null;
};

function Header({
  showWatermark,
  watermark,
  activityName,
  flowId,
  eventId,
  appletId,
  entityStartedAt,
  timer,
}: Props) {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const { t } = useTranslation();
  const hasNotch = DeviceInfo.hasNotch();
  const isNotIPhoneX = !isIphoneX();

  const [showTimeLeft, setShowTimeLeft] = useState(!!timer);

  const [timerHeight, setTimerHeight] = useState(0);

  const timerMarginTop = hasNotch ? (safeAreaTop - timerHeight) / 2 : 16;

  return (
    <Box>
      {showTimeLeft && (
        <TimeRemaining
          mt={timerMarginTop}
          left={16}
          zIndex={1}
          entityStartedAt={entityStartedAt}
          timerSettings={timer as HourMinute}
          clockIconShown={isNotIPhoneX}
          opacity={timerHeight ? 1 : 0}
          onTimeElapsed={() => setShowTimeLeft(false)}
          onLayout={e => {
            setTimerHeight(e.nativeEvent.layout.height);
          }}
        />
      )}
      <XStack
        w="100%"
        alignItems="center"
        p={10}
        mt={showTimeLeft ? 0 : safeAreaTop}
      >
        {showWatermark && watermark && (
          <Box style={styles.watermarkContainer}>
            <CachedImage
              source={watermark}
              style={styles.watermark}
              accessibilityLabel="watermark-image"
            />
          </Box>
        )}
        <Text fontSize={16} numberOfLines={2} marginRight={100}>
          {activityName}
        </Text>
        <XStack ml="auto">
          <BackButton accessibilityLabel="close-button">
            <Text color={colors.blue3}>{t('activity_navigation:exit')}</Text>
          </BackButton>
        </XStack>
      </XStack>
      <HeaderProgress appletId={appletId} eventId={eventId} flowId={flowId} />
      <ListSeparator mt={10} bg={colors.lighterGrey7} />
    </Box>
  );
}

const styles = StyleSheet.create({
  watermark: {
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
  watermarkContainer: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    overflow: 'hidden',
    marginRight: 10,
  },
});
export default Header;
