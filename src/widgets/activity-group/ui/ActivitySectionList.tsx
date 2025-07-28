import { useMemo, PropsWithChildren } from 'react';
import { Linking, SectionList, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import {
  CheckAvailability,
  CompleteEntityIntoUploadToQueue,
  EntityType,
} from '@app/abstract/lib/types/entity';
import { getDefaultMediaFilesCleaner } from '@app/entities/activity/lib/services/mediaFilesCleanerInstance';
import { ActivityListItem } from '@app/entities/activity/lib/types/activityListItem';
import { getDefaultItemsVisibilityValidator } from '@app/entities/activity/model/services/itemsVisibilityValidatorInstsance';
import { getDefaultMediaLookupService } from '@app/entities/activity/model/services/mediaLookupServiceInstance';
import { ActivityCard } from '@app/entities/activity/ui/ActivityCard';
import { clearStorageRecords } from '@app/entities/applet/lib/storage/helpers';
import { useStartEntity } from '@app/entities/applet/model/hooks/useStartEntity';
import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { DEEP_LINK_PREFIXES } from '@app/shared/lib/constants';
import { useUploadObservable } from '@app/shared/lib/hooks/useUploadObservable';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';
import {
  getIsWebOnly,
  getSupportsMobile,
} from '@app/shared/lib/utils/responseTypes';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { GradientOverlay } from '@app/shared/ui/GradientOverlay';
import { ChecklistIcon } from '@app/shared/ui/icons/ChecklistIcon';
import { Text } from '@app/shared/ui/Text';

import { EmptyState } from './EmptyState';
import { ActivityListGroup } from '../lib/types/activityGroup';
import { useAvailabilityEvaluator } from '../model/hooks/useAvailabilityEvaluator';

type Props = {
  appletId: string;
  activityResponseTypes: Record<string, ResponseType[]>;
  groups: Array<ActivityListGroup>;
  completeEntity: CompleteEntityIntoUploadToQueue;
  checkAvailability: CheckAvailability;
};

export function ActivitySectionList({
  activityResponseTypes = {},
  appletId,
  checkAvailability,
  completeEntity,
  groups,
}: Props) {
  const { t } = useTranslation();

  const { navigate, isFocused } = useNavigation();

  const { isUploading } = useUploadObservable();

  const sections = useMemo(
    () =>
      groups.map(group => ({
        data: group.activities,
        name: group.name,
      })),
    [groups],
  );

  const { startFlow, startActivity } = useStartEntity({
    hasMediaReferences: getDefaultMediaLookupService().hasMediaReferences,
    cleanUpMediaFiles: getDefaultMediaFilesCleaner().cleanUp,
    hasActivityWithHiddenAllItems:
      getDefaultItemsVisibilityValidator().hasActivityWithHiddenAllItems,
    evaluateAvailableTo: useAvailabilityEvaluator().evaluateAvailableTo,
    completeEntityIntoUploadToQueue: completeEntity,
    checkAvailability,
  });

  function navigateSurvey(
    entityId: string,
    entityType: EntityType,
    eventId: string,
    targetSubjectId: string | null,
  ) {
    navigate('InProgressActivity', {
      appletId,
      entityId,
      entityType,
      eventId,
      targetSubjectId,
    });
  }

  const startActivityOrFlow = async ({
    activityId,
    eventId,
    flowId,
    targetSubjectId,
    isExpired: isTimerElapsed,
    name,
    activityFlowDetails,
  }: ActivityListItem) => {
    if (getMutexDefaultInstanceManager().getAutoCompletionMutex().isBusy()) {
      getDefaultLogger().log(
        '[ActivitySectionList.startActivityOrFlow] Postponed due to AutoCompletionMutex is busy',
      );
      return;
    }

    const responseTypes = activityResponseTypes[flowId || activityId];
    const isWebOnly = responseTypes.some(getIsWebOnly);

    if (isWebOnly) {
      await Linking.openURL(
        `${DEEP_LINK_PREFIXES[0]}/protected/applets/${appletId}` || '',
      );
      return;
    }

    const autocomplete = () => {
      Emitter.emit<AutocompletionEventOptions>('autocomplete', {
        logTrigger: 'expired-while-alert-opened',
      });
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
        targetSubjectId,
        responseTypes,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId, targetSubjectId);
      }

      navigateSurvey(flowId, 'flow', eventId, targetSubjectId);
    } else {
      const result = await startActivity(
        appletId,
        activityId,
        eventId,
        entityName,
        isTimerElapsed,
        targetSubjectId,
        responseTypes,
      );

      if (result.failReason === 'expired-while-alert-opened') {
        return autocomplete();
      }

      if (result.failed) {
        return;
      }

      if (result.fromScratch) {
        clearStorageRecords.byEventId(eventId, targetSubjectId);
      }

      navigateSurvey(activityId, 'regular', eventId, targetSubjectId);
    }
  };

  return (
    <>
      <SectionList
        sections={sections}
        renderSectionHeader={({ section }) => (
          <SectionHeader>{t(section.name)}</SectionHeader>
        )}
        renderItem={({ item, section }) => {
          const entityId = item.flowId || item.activityId;
          const responseTypes = activityResponseTypes[entityId];
          const supportsApp = responseTypes.every(getSupportsMobile);
          const isWebOnly = responseTypes.some(getIsWebOnly);

          return (
            <ActivityCard
              activity={item}
              disabled={isUploading || (!isWebOnly && !supportsApp)}
              isWebOnly={isWebOnly}
              onPress={() => {
                if (isFocused()) {
                  startActivityOrFlow(item).catch(console.error);
                }
              }}
              sectionName={section.name}
            />
          );
        }}
        // SectionList doesn't provide a prop for section empty components, so we use
        // renderSectionFooter to conditionally render any empty sections.
        renderSectionFooter={({ section }) =>
          section.data.length ? null : (
            <EmptyState
              icon={<ChecklistIcon />}
              description={t('activity_list_component:no_activities')}
            />
          )
        }
        ItemSeparatorComponent={ItemSeparator}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.sectionList}
      />
      <GradientOverlay position="top" />
      <GradientOverlay position="bottom" />
    </>
  );
}

const SectionHeader = ({ children }: PropsWithChildren) => (
  <XStack ai="center" my={16}>
    <Text accessibilityLabel="activity-group-name-text" color="$outline" mx={8}>
      {children}
    </Text>

    <Box flex={1} height={1} bc="$surface_variant" />
  </XStack>
);

const ItemSeparator = () => <YStack my={8} />;

const styles = StyleSheet.create({
  sectionList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
});
