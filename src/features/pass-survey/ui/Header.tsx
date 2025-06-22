import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { useNavigation } from '@react-navigation/native';
import { XStack, YStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { IS_TABLET } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { Box } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { Text } from '@app/shared/ui/Text';

import { HeaderProgress } from './HeaderProgress';

type Props = {
  showWatermark: boolean;
  watermark?: string | null;
  activityName: string;
  flowId?: string;
  eventId: string;
  appletId: string;
  targetSubjectId: string | null;
};

export function Header({
  showWatermark,
  watermark,
  activityName,
  flowId,
  eventId,
  appletId,
  targetSubjectId,
}: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <YStack
      pt={IS_TABLET ? 16 : 10}
      px={16}
      pb={16}
      gap={8}
      borderBottomColor="$surface_variant"
      borderBottomWidth={1}
    >
      <XStack w="100%" alignItems="center" gap={12}>
        {showWatermark && watermark && (
          <Box style={styles.watermarkContainer}>
            <CachedImage
              source={watermark}
              style={styles.watermark}
              accessibilityLabel="watermark-image"
            />
          </Box>
        )}
        <Text numberOfLines={2} flex={1}>
          {activityName}
        </Text>
        <Button
          aria-label="close-button"
          bg="$secondary_container"
          h={40}
          px={14}
          textProps={{
            color: palette.on_secondary_container,
            fontSize: 14,
            lineHeight: 18,
            letterSpacing: 0.1,
            textAlign: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          {t('activity_navigation:exit')}
        </Button>
      </XStack>

      <HeaderProgress
        appletId={appletId}
        eventId={eventId}
        flowId={flowId}
        targetSubjectId={targetSubjectId}
      />
    </YStack>
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
    borderRadius: 4,
    overflow: 'hidden',
  },
});
