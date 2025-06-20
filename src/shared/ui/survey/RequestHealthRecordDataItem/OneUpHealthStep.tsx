import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Linking, StyleSheet } from 'react-native';

import { StackStyle } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { EntityProgressionInProgress } from '@app/abstract/lib/types/entityProgress';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useOneUpHealthSystemSearchApi } from '@app/shared/api/hooks/useOneUpHealthSystemSearchApi';
import { OneUpHealthSystemItem } from '@app/shared/api/services/IOneUpHealthService';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getEntityProgression } from '@app/shared/lib/utils/survey/survey';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Center } from '@app/shared/ui/Center';
import { CloseIcon } from '@app/shared/ui/icons';
import { Input } from '@app/shared/ui/Input';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';

import { HealthSystemItem } from './HealthSystemItem';
import { GradientOverlay } from '../../GradientOverlay';
import { SubmitButton } from '../../SubmitButton';

export const OneUpHealthStep: FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  const { appletId, activityId, flowId, eventId, targetSubjectId } = useContext(
    ActivityIdentityContext,
  );

  const progressions = useAppSelector(selectAppletsEntityProgressions);
  const progression = useMemo(
    () =>
      getEntityProgression(
        appletId,
        flowId ?? activityId,
        eventId,
        targetSubjectId,
        progressions,
      ) as EntityProgressionInProgress | undefined,
    [appletId, flowId, activityId, eventId, targetSubjectId, progressions],
  );

  const submitId = progression?.submitId;

  const {
    search,
    loadMore,
    results,
    isTokenLoading,
    isResultsLoading,
    selectedHealthSystemId,
    setSelectedHealthSystemId,
    healthSystemUrl,
    isHealthSystemUrlLoading,
    // TODO: Handle error states
    // https://mindlogger.atlassian.net/browse/M2-8981
    error: _error,
  } = useOneUpHealthSystemSearchApi({ appletId, submitId, activityId });

  const handleSearch = (query = searchQuery) => {
    setSearchQuery(query);
    search(query);
    flatListRef.current?.scrollToOffset({
      animated: false,
      offset: 0,
    });
  };

  const handleItemPress = (id: number) => {
    setSelectedHealthSystemId(id);
  };

  useEffect(() => {
    if (healthSystemUrl) {
      Linking.openURL(healthSystemUrl).catch(() => {
        getDefaultLogger().error(
          `[HealthSystemItem] Failed to open Health System URL`,
        );
      });
      setSelectedHealthSystemId(null);
    }
  }, [healthSystemUrl, setSelectedHealthSystemId]);

  return (
    <YStack gap={8} pt="$5" flex={1} bg="$surface1">
      {!isTokenLoading && (
        <>
          <YStack px={16} gap="$2">
            <Text fontWeight="700">
              {t('requestHealthRecordData:enterYourHealthSystem')}
            </Text>
            <XStack
              alignItems="center"
              justifyContent="space-between"
              space="$2"
            >
              <Box position="relative" flex={1}>
                <Input
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={() => handleSearch()}
                  blurOnSubmit={false}
                  returnKeyType="search"
                  placeholder={t('requestHealthRecordData:healthSystemName')}
                  mode="light"
                  px={0}
                  pr={searchQuery ? '$8' : 0}
                  flex={1}
                />
                {searchQuery && (
                  <Box
                    position="absolute"
                    right="$1"
                    top="50%"
                    style={styles.clearButtonContainer}
                    onPress={() => handleSearch('')}
                    animation="fast"
                    pressStyle={pressStyle}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    p={4}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CloseIcon size={16} color={palette.darkGrey} />
                  </Box>
                )}
              </Box>
              <SubmitButton
                onPress={() => handleSearch()}
                mode="tonal"
                textProps={buttonTextStyle}
              >
                {t('requestHealthRecordData:search')}
              </SubmitButton>
            </XStack>
          </YStack>

          <Box flex={1}>
            <FlatList<OneUpHealthSystemItem>
              ref={flatListRef}
              data={results}
              renderItem={({ item }) => (
                <HealthSystemItem
                  {...item}
                  onPress={() => handleItemPress(item.id)}
                  isDisabled={isHealthSystemUrlLoading}
                  isLoading={
                    selectedHealthSystemId === item.id &&
                    isHealthSystemUrlLoading
                  }
                />
              )}
              keyExtractor={item => String(item.id)}
              refreshing={isResultsLoading}
              contentContainerStyle={styles.contentContainer}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                <Center py="$2">
                  <Spinner size={24} isVisible={isResultsLoading} />
                </Center>
              }
              ListEmptyComponent={
                isResultsLoading ? null : (
                  <Text>{t('requestHealthRecordData:noResults')}</Text>
                )
              }
            />
            <GradientOverlay />
          </Box>
        </>
      )}

      <Spinner withOverlay isVisible={isTokenLoading} />
    </YStack>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 12,
    padding: 16,
  },
  clearButtonContainer: {
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
});

// This isn't technically a ViewStyle object, but serves the same purpose
const buttonTextStyle = {
  textColor: '$darkGrey',
  fontWeight: '400',
  fontSize: 16,
} as const;

const pressStyle: StackStyle = {
  opacity: 0.5,
};
