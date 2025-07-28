import { useCallback, useContext, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { PipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { PipelineItemAnswer } from '@app/features/pass-survey/lib/types/pipelineItemAnswer';
import { EHRConsent } from '@app/shared/api/services/ActivityItemDto';
import { QueryDataUtils } from '@app/shared/api/services/QueryDataUtils';
import { getResponseTypesMap } from '@app/shared/lib/utils/responseTypes';
import { trackEHRProviderSearchSkipped } from '@app/widgets/survey/lib/surveyStateAnalytics';

import { useActivityState } from '../useActivityState';

type UseSubStepsProps = {
  /** Current step of the item in the activity */
  itemStep: number;
  item?: PipelineItem;
  answer?: PipelineItemAnswer['value'];
  setSubStep: (subStep: number) => void;
};

export function useSubSteps({
  itemStep,
  item,
  answer,
  setSubStep,
}: UseSubStepsProps) {
  const queryClient = useQueryClient();
  const { appletId, activityId, flowId, eventId, targetSubjectId, order } =
    useContext(ActivityIdentityContext);

  const { setItemCustomProperty } = useActivityState({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const subStep = useMemo(() => {
    if (item?.type === 'RequestHealthRecordData') {
      return item.subStep;
    }

    return null;
  }, [item]);

  /**
   * Returns true if there is a next sub-step (and handleNextSubStep should be called when the
   * Next button is pressed), false otherwise.
   */
  const hasNextSubStep = useMemo(() => {
    if (!item || subStep === null) return false;

    if (item.type === 'RequestHealthRecordData') {
      return (
        // Go to the next substep only if the user has opted in to sharing EHR data, and
        answer?.answer === EHRConsent.OptIn &&
        // we're not on the OneUpHealth step (user should be skipped to next item instead), and
        subStep !== RequestHealthRecordDataItemStep.OneUpHealth &&
        // we're before the last sub-step OR additional EHRs have been requested
        (subStep < RequestHealthRecordDataItemStep.AdditionalPrompt ||
          item.additionalEHRs === 'requested')
      );
    }

    return false;
  }, [subStep, item, answer]);

  /**
   * Returns true if there is a previous sub-step (and handlePrevSubStep should be called when the
   * Back button is pressed), false otherwise.
   */
  const hasPrevSubStep = useMemo(() => {
    if (!item || subStep === null) return false;

    if (item.type === 'RequestHealthRecordData') {
      return (
        // Go to the previous substep only if we're after the first step, and
        subStep > RequestHealthRecordDataItemStep.ConsentPrompt &&
        // we're not on the AdditionalPrompt step
        subStep !== RequestHealthRecordDataItemStep.AdditionalPrompt
      );
    }

    return false;
  }, [subStep, item]);

  /**
   * Handle any submission logic for a sub-step, called before navigating to the next sub-step (or
   * submitting the activity, if the item is the last step).
   */
  const handleSubmitSubStep = useCallback(() => {
    if (!item || subStep === null) return;

    if (item.type === 'RequestHealthRecordData') {
      if (subStep === RequestHealthRecordDataItemStep.OneUpHealth) {
        // When clicking next on this step, it means the user has skipped the EHR search
        if (item.additionalEHRs === null) {
          // Only track a skipped status (used for Mixpanel tracking) and Mixpanel event if no
          // additional EHRs have been requested yet
          setItemCustomProperty<RequestHealthRecordDataPipelineItem>(
            itemStep,
            'ehrSearchSkipped',
            true,
          );

          const baseInfo = new QueryDataUtils(queryClient).getBaseInfo(
            appletId,
          );
          const itemTypesMap = baseInfo ? getResponseTypesMap(baseInfo) : {};

          trackEHRProviderSearchSkipped({
            appletId,
            activityId,
            flowId,
            itemTypes: itemTypesMap[activityId],
          });
        }
      }
    }
  }, [
    item,
    subStep,
    setItemCustomProperty,
    itemStep,
    queryClient,
    appletId,
    activityId,
    flowId,
  ]);

  /**
   * Handles the logic for controlling navigation to the next sub-step when the Next button is
   * pressed.
   */
  const handleNextSubStep = useCallback(() => {
    if (!item || !hasNextSubStep || subStep === null) {
      return;
    }

    if (item.type === 'RequestHealthRecordData') {
      if (subStep === RequestHealthRecordDataItemStep.AdditionalPrompt) {
        if (item.additionalEHRs === 'requested') {
          // If requested to add additional EHRs, return to OneUpHealth step
          setSubStep(RequestHealthRecordDataItemStep.OneUpHealth);
        }
      } else {
        // Go to next sub-step
        setSubStep(subStep + 1);
      }
    }
  }, [hasNextSubStep, subStep, item, setSubStep]);

  /**
   * Handles the logic for controlling navigation to the previous sub-step when the Back button is
   * pressed.
   */
  const handlePrevSubStep = useCallback(() => {
    if (!item || !hasPrevSubStep || subStep === null) {
      return;
    }

    if (item.type === 'RequestHealthRecordData') {
      if (
        subStep === RequestHealthRecordDataItemStep.OneUpHealth &&
        item.additionalEHRs === 'requested'
      ) {
        // Go back to the AdditionalPrompt step if we're on the OneUpHealth step and
        // additional EHRs have been requested
        setSubStep(RequestHealthRecordDataItemStep.AdditionalPrompt);
      } else {
        // Else go to previous sub-step
        setSubStep(subStep - 1);
      }
    }
  }, [hasPrevSubStep, subStep, item, setSubStep]);

  /**
   * Returns the text to be displayed on the "Next" button.
   */
  const nextButtonText = useMemo(() => {
    if (item?.type === 'RequestHealthRecordData') {
      if (subStep === RequestHealthRecordDataItemStep.OneUpHealth) {
        return 'activity_navigation:skip';
      }
    }

    return undefined;
  }, [item, subStep]);

  return {
    subStep,
    hasNextSubStep,
    hasPrevSubStep,
    handleSubmitSubStep,
    handleNextSubStep,
    handlePrevSubStep,
    nextButtonText,
  };
}
