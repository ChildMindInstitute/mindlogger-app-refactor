import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Linking, StyleSheet } from 'react-native';

import { StackStyleProps } from '@tamagui/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { EntityProgressionInProgress } from '@app/abstract/lib/types/entityProgress';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useOneUpHealthSystemSearchApi } from '@app/shared/api/hooks/useOneUpHealthSystemSearchApi';
import { OneUpHealthSystemItem } from '@app/shared/api/services/IOneUpHealthService';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getEntityProgression } from '@app/shared/lib/utils/survey/survey';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { Center } from '@app/shared/ui/Center';
import { CloseIcon } from '@app/shared/ui/icons';
import { Input } from '@app/shared/ui/Input';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';

import { HealthSystemItem } from './HealthSystemItem';

export const OneUpHealthStep: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const [healthSystemUrl, setHealthSystemUrl] = useState<string | null>(null);
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

  // Clear 1UpHealth API cache for each new session
  useOnFocus(() => {
    queryClient.invalidateQueries({
      queryKey: ['oneup-health-system-search'],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ['oneup-health-health-system-url'],
      exact: false,
    });
  });

  return (
    <YStack gap="$5" pt="$5" flex={1}>
      {isTokenLoading ? (
        <Center flex={1}>
          <Spinner />
        </Center>
      ) : (
        <>
          <YStack px="$4" gap="$2">
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
                  mode="dark"
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
                    <CloseIcon size={16} color={colors.darkGrey} />
                  </Box>
                )}
              </Box>
              <Button
                onPress={() => handleSearch()}
                isLoading={isResultsLoading}
                touchableStyles={styles.touchable}
                bg="$lighterGrey2"
                px="$5"
                py="$3"
                borderColor="$outlineGrey"
                borderWidth={1}
                textStyles={buttonTextStyle}
              >
                {t('requestHealthRecordData:search')}
              </Button>
            </XStack>
          </YStack>

          <FlatList<OneUpHealthSystemItem>
            ref={flatListRef}
            data={results}
            renderItem={({ item }) => (
              <HealthSystemItem
                {...item}
                onPress={() => handleItemPress(item.id)}
                // onPress={() => {
                //   setHealthSystemUrl(
                //     'https://authorization.cerner.com/session-api/realm/ec2458f2-1e24-41c8-b71b-0e701af7583d-ch?to=https%3A%2F%2Fauthorization.cerner.com%2Ftenants%2Fec2458f2-1e24-41c8-b71b-0e701af7583d%2Fprotocols%2Foauth2%2Fprofiles%2Fsmart-v1%2Fpersonas%2Fpatient%2Fauthorize%3FinitialRequestId%3Dee36c165-14fe-4bbd-96e6-0666f176f3ea%26isForceAuthn%3Dtrue&forceAuthn=true',
                //   );
                // }}
                isDisabled={isHealthSystemUrlLoading}
                isLoading={
                  selectedHealthSystemId === item.id && isHealthSystemUrlLoading
                }
              />
            )}
            keyExtractor={item => String(item.id)}
            refreshing={isResultsLoading}
            contentContainerStyle={styles.contentContainer}
            style={styles.flatList}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isResultsLoading ? (
                <Center py="$2">
                  <Spinner size={24} />
                </Center>
              ) : null
            }
            ListEmptyComponent={
              isResultsLoading ? null : (
                <Text>{t('requestHealthRecordData:noResults')}</Text>
              )
            }
          />
        </>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: 'auto',
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  clearButtonContainer: {
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
});

// This isn't technically a ViewStyle object, but serves the same purpose
const buttonTextStyle = {
  textColor: '$darkGrey',
  fontWeight: '500',
  fontSize: 16,
};

const pressStyle: StackStyleProps = {
  opacity: 0.5,
};
