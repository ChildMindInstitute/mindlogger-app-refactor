import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { XStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib';
import { ListSeparator, BackButton, Text, Box } from '@shared/ui';

import HeaderProgress from './HeaderProgress.tsx';

type Props = {
  showWatermark: boolean;
  watermark?: string | null;
  activityName: string;
  flowId?: string;
  eventId: string;
  appletId: string;
};

function Header({
  showWatermark,
  watermark,
  activityName,
  flowId,
  eventId,
  appletId,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <XStack w="100%" alignItems="center" p={10}>
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
    </>
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
