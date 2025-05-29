import React, { FC, useCallback, useRef } from 'react';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
  RequestHealthRecordDataResponse,
} from '@app/features/pass-survey/lib/types/payload';
import { usePreviousValue } from '@app/shared/lib/hooks/usePreviousValue';

import { AdditionalPromptStep } from './AdditionalPromptStep';
import { ConsentPromptStep } from './ConsentPromptStep';
import { OneUpHealthStep } from './OneUpHealthStep';
import { PartnershipStep } from './PartnershipStep';
import { ScrollableContent } from '../../ScrollableContent';
import { ViewSlider, ViewSliderRef } from '../../ViewSlider';

type RequestHealthRecordDataItemProps = {
  item: RequestHealthRecordDataPipelineItem;
  onChange: (value: RequestHealthRecordDataResponse) => void;
  responseValue?: RequestHealthRecordDataResponse;
  textReplacer: (markdown: string) => string;
  assignment: Assignment | null;
};

export const RequestHealthRecordDataItem: FC<
  RequestHealthRecordDataItemProps
> = ({ item, onChange, responseValue, textReplacer, assignment }) => {
  const ref = useRef<ViewSliderRef>(null);

  const getContent = useCallback(
    ({ index }: { index: number }) => {
      switch (index) {
        case RequestHealthRecordDataItemStep.ConsentPrompt:
          return (
            <ScrollableContent>
              <ConsentPromptStep
                item={item}
                onChange={onChange}
                responseValue={responseValue}
                textReplacer={textReplacer}
                assignment={assignment}
              />
            </ScrollableContent>
          );

        case RequestHealthRecordDataItemStep.Partnership:
          return (
            <ScrollableContent>
              <PartnershipStep
                textReplacer={textReplacer}
                assignment={assignment}
              />
            </ScrollableContent>
          );

        case RequestHealthRecordDataItemStep.OneUpHealth:
          return <OneUpHealthStep />;

        case RequestHealthRecordDataItemStep.AdditionalPrompt:
          return (
            <ScrollableContent>
              <AdditionalPromptStep
                item={item}
                textReplacer={textReplacer}
                assignment={assignment}
              />
            </ScrollableContent>
          );

        default:
          return <></>;
      }
    },
    [assignment, item, onChange, responseValue, textReplacer],
  );

  const prevSubStep = usePreviousValue(item.subStep);

  // Custom animation direction logic
  if (prevSubStep !== null) {
    // If additional EHRs have been requested:
    if (item.additionalEHRs === 'requested') {
      // and if we're moving between OneUpHealth and AdditionalPrompt steps:
      if (
        item.subStep === RequestHealthRecordDataItemStep.AdditionalPrompt &&
        prevSubStep === RequestHealthRecordDataItemStep.OneUpHealth
      ) {
        // animate as if we're moving backward
        ref.current?.back(1);
      }
      // or if we're moving from AdditionalPrompt back to OneUpHealth:
      else if (
        item.subStep === RequestHealthRecordDataItemStep.OneUpHealth &&
        prevSubStep === RequestHealthRecordDataItemStep.AdditionalPrompt
      ) {
        // animate as if we're moving forward
        ref.current?.next(1);
      }
    }
    // Default animation behavior for all other cases
    else if (prevSubStep < item.subStep) {
      ref.current?.next(1);
    } else if (prevSubStep > item.subStep) {
      ref.current?.back(1);
    }
  }

  return (
    <ViewSlider
      viewCount={Object.values(RequestHealthRecordDataItemStep).length}
      step={item.subStep}
      ref={ref}
      renderView={getContent}
    />
  );
};
