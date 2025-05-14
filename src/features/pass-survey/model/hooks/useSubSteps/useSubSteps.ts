import { useCallback, useMemo } from 'react';

import { RequestHealthRecordDataItemStep } from '@app/features/pass-survey/lib/types/payload';
import { PipelineItem } from '@app/features/pass-survey/lib/types/payload';
import { PipelineItemAnswer } from '@app/features/pass-survey/lib/types/pipelineItemAnswer';
import { EHRConsent } from '@app/shared/api/services/ActivityItemDto';

type UseSubStepsProps = {
  item?: PipelineItem;
  answer?: PipelineItemAnswer['value'];
  setSubStep: (subStep: number) => void;
};

export function useSubSteps({ item, answer, setSubStep }: UseSubStepsProps) {
  const subStep = useMemo(() => {
    if (item?.type === 'RequestHealthRecordData') {
      return item.subStep;
    }

    return null;
  }, [item]);

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
    handleNextSubStep,
    handlePrevSubStep,
    nextButtonText,
  };
}
