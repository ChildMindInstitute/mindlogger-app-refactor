import { useMemo, PropsWithChildren } from 'react';
import { SectionList, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { EntityType } from '@app/abstract/lib';
import { ActivityCard, ActivityModel, ActivityListItem, MediaFilesCleaner } from '@entities/activity';
import { AppletModel, clearStorageRecords } from '@entities/applet';
import { Box, Text, YStack } from '@shared/ui';

import { ActivityListGroup } from '../lib';

type Props = {
  appletId: string;
  groups: Array<ActivityListGroup>;
};

function ActivitySectionList({ appletId, groups }: Props) {
  const { t } = useTranslation();
  const { navigate, isFocused } = useNavigation();

  const sections = useMemo(() => {
    return groups
      .filter((g) => g.activities.length)
      .map((group) => {
        return {
          data: group.activities,
          key: t(group.name),
        };
      });
  }, [t, groups]);

  const { startFlow, startActivity } = AppletModel.useStartEntity({
    hasMediaReferences: ActivityModel.MediaLookupService.hasMediaReferences,
    cleanUpMediaFiles: MediaFilesCleaner.cleanUp,
    hasActivityWithHiddenAllItems: ActivityModel.ItemsVisibilityValidator.hasActivityWithHiddenAllItems,
  });

  function navigateSurvey(entityId: string, entityType: EntityType, eventId: string) {
    navigate('InProgressActivity', {
      appletId,
      entityId,
      entityType,
      eventId,
    });
  }

  const startActivityOrFlow = ({ activityId, eventId, flowId, isTimerElapsed, name }: ActivityListItem) => {
    if (flowId) {
      startFlow(appletId, flowId, eventId, name, isTimerElapsed).then((result) => {
        if (result.cannotBeStartedDueToMediaFound || result.cannotBeStartedDueToAllItemsHidden) {
          return;
        }

        if (result.startedFromScratch) {
          clearStorageRecords.byEventId(eventId);
        }

        navigateSurvey(flowId, 'flow', eventId);
      });
    } else {
      startActivity(appletId, activityId, eventId, name, isTimerElapsed).then((result) => {
        if (result.cannotBeStartedDueToMediaFound || result.cannotBeStartedDueToAllItemsHidden) {
          return;
        }

        if (result.startedFromScratch) {
          clearStorageRecords.byEventId(eventId);
        }

        navigateSurvey(activityId, 'regular', eventId);
      });
    }
  };

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={({ section }) => <SectionHeader>{section.key}</SectionHeader>}
      renderItem={({ item }) => (
        <ActivityCard
          activity={item}
          disabled={false}
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
