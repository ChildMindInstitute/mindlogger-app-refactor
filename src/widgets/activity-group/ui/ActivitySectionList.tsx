import { useMemo, PropsWithChildren } from 'react';
import { SectionList, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityType,
} from '@app/abstract/lib';
import { Emitter, Logger, useUploadObservable } from '@app/shared/lib';
import { AutoCompletionMutex } from '@app/widgets/survey/model';
import {
  ActivityCard,
  ActivityModel,
  ActivityListItem,
  MediaFilesCleaner,
} from '@entities/activity';
import { AppletModel, clearStorageRecords } from '@entities/applet';
import { Box, Text, YStack } from '@shared/ui';

import { ActivityListGroup } from '../lib';
import { useAvailabilityEvaluator } from '../model';

type Props = {
  appletId: string;
  groups: Array<ActivityListGroup>;
  completeEntity: CompleteEntityIntoUploadToQueue;
  checkAvailability: CheckAvailability;
};

function ActivitySectionList({
  appletId,
  groups,
  completeEntity,
  checkAvailability,
}: Props) {
  const { t } = useTranslation();

  const { navigate, isFocused } = useNavigation();

  const { isUploading } = useUploadObservable();

  const sections = useMemo(() => {
    return groups
      .filter(g => g.activities.length)
      .map(group => {
        return {
          data: group.activities,
          key: t(group.name),
        };
      });
  }, [t, groups]);

  const { startFlow, startActivity } = AppletModel.useStartEntity({
    hasMediaReferences: ActivityModel.MediaLookupService.hasMediaReferences,
    cleanUpMediaFiles: MediaFilesCleaner.cleanUp,
    hasActivityWithHiddenAllItems:
      ActivityModel.ItemsVisibilityValidator.hasActivityWithHiddenAllItems,
    evaluateAvailableTo: useAvailabilityEvaluator().evaluateAvailableTo,
    completeEntityIntoUploadToQueue: completeEntity,
    checkAvailability,
  });

  function navigateSurvey(
    entityId: string,
    entityType: EntityType,
    eventId: string,
  ) {
    navigate('InProgressActivity', {
      appletId,
      entityId,
      entityType,
      eventId,
    });
  }

  const startActivityOrFlow = async ({
    activityId,
    eventId,
    flowId,
    isExpired: isTimerElapsed,
    name,
    activityFlowDetails,
  }: ActivityListItem) => {
    if (AutoCompletionMutex.isBusy()) {
      Logger.log(
        '[ActivitySectionList.startActivityOrFlow] Postponed due to AutoCompletionMutex is busy',
      );
      return;
    }

    const autocomplete = () => {
      Emitter.emit('autocomplete');
    };

    const entityName = activityFlowDetails
      ? activityFlowDetails.activityFlowName
      : name;

    if (flowId) {
      const result = await startFlow(
        appletId,
        flowId,
        eventId,
        entityName,
        isTimerElapsed,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId);
      }

      navigateSurvey(flowId, 'flow', eventId);
    } else {
      const result = await startActivity(
        appletId,
        activityId,
        eventId,
        entityName,
        isTimerElapsed,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId);
      }

      navigateSurvey(activityId, 'regular', eventId);
    }
  };

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={({ section }) => (
        <SectionHeader>{section.key}</SectionHeader>
      )}
      renderItem={({ item }) => (
        <ActivityCard
          activity={item}
          disabled={isUploading}
          onPress={() => {
            if (!isFocused()) {
              return;
            }

            startActivityOrFlow(item);
          }}
        />
      )}
      ItemSeparatorComponent={ItemSeparator}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.sectionList}
    />
  );
}

const SectionHeader = ({ children }: PropsWithChildren) => (
  <Box mb={10}>
    <Text
      accessibilityLabel="activity-group-name-text"
      mt={16}
      mb={4}
      fontSize={14}
      fontWeight="600"
      color="$darkGrey2"
    >
      {children}
    </Text>

    <Box width="100%" height={1} bc="$darkGrey2" />
  </Box>
);

const ItemSeparator = () => <YStack my={6} />;

const styles = StyleSheet.create({
  sectionList: {
    flexGrow: 1,
    paddingBottom: 42,
  },
});

export default ActivitySectionList;
