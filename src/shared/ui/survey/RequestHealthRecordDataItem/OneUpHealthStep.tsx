import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, StyleSheet, TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';

import { EntityProgressionInProgress } from '@app/abstract/lib/types/entityProgress';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useOneUpHealthSystemSearchApi } from '@app/shared/api/hooks/useOneUpHealthSystemSearchApi';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getEntityProgression } from '@app/shared/lib/utils/survey/survey';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Button } from '@app/shared/ui/Button';
import { CloseIcon } from '@app/shared/ui/icons';
import { Input } from '@app/shared/ui/Input';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';

import { HealthSystemItem } from './HealthSystemItem';
import { Center } from '../../Center';

export const OneUpHealthStep: FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

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
                  >
                    <TouchableOpacity
                      onPress={() => handleSearch('')}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={styles.clearButton}
                    >
                      <CloseIcon size={16} color="$darkGrey" />
                    </TouchableOpacity>
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

          <FlatList
            data={results}
            renderItem={({ item }) => (
              <HealthSystemItem
                {...item}
                onPress={() => handleItemPress(item.id)}
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
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  clearButtonContainer: {
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  clearButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// This isn't technically a ViewStyle object, but serves the same purpose
const buttonTextStyle = {
  textColor: '$darkGrey',
  fontWeight: '500',
  fontSize: 16,
};
