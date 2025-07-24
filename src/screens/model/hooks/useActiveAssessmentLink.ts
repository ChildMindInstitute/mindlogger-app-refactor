import { useContext } from 'react';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useActivityStorageRecord } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { useActivityState } from '@app/features/pass-survey/model/hooks/useActivityState';
import { RootStackParamList } from '@app/screens/config/types';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

/**
 * This hook handles specific logic for resuming an active assessment when called via the
 * `active-assessment` deep link.
 *
 * Must be called within the context of the `InProgressActivity` screen and the
 * `ActivityIdentityContext`.
 */
export const useActiveAssessmentLink = () => {
  const {
    params: { fromActiveAssessmentLink },
  } = useRoute<RouteProp<RootStackParamList, 'InProgressActivity'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { appletId, activityId, eventId, targetSubjectId, order } = useContext(
    ActivityIdentityContext,
  );

  const { getCurrentActivityStorageRecord } = useActivityStorageRecord({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const { setSubStep, setItemCustomProperty } = useActivityState({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  if (fromActiveAssessmentLink) {
    // Flag that we've handled the deep link until the next time the deep link is called
    navigation.setParams({ fromActiveAssessmentLink: false });

    getDefaultLogger().info(
      `[useActiveAssessmentLink] Resuming activity ${activityId} via 'active-assessment' deep link`,
    );

    /* Specific handling of activities containing EHR item types:
     *
     * When the activity contains an EHR item type that's in the OneUpHealth step, and we're
     * resuming the activity via `active-assessment` deep link, advance the item's state to the last
     * sub-step (after the OneUpHealth step). Also reset the additional EHRs request to unanswered.
     =================================================== */
    const activityProgress = getCurrentActivityStorageRecord();

    const ehrItemIndex =
      activityProgress?.items.findIndex(
        item => item.type === 'RequestHealthRecordData',
      ) ?? -1;
    const ehrItem =
      ehrItemIndex >= 0 ? activityProgress?.items[ehrItemIndex] : null;

    if (
      ehrItem &&
      activityProgress?.step === ehrItemIndex &&
      ehrItem.subStep === RequestHealthRecordDataItemStep.OneUpHealth
    ) {
      setSubStep(
        ehrItemIndex,
        RequestHealthRecordDataItemStep.AdditionalPrompt,
      );
      setItemCustomProperty<RequestHealthRecordDataPipelineItem>(
        ehrItemIndex,
        'additionalEHRs',
        null,
      );
      setItemCustomProperty<RequestHealthRecordDataPipelineItem>(
        ehrItemIndex,
        'ehrSearchSkipped',
        false,
      );
      setItemCustomProperty<RequestHealthRecordDataPipelineItem>(
        ehrItemIndex,
        'ehrShareSuccess',
        true,
      );
    }
  }
};
