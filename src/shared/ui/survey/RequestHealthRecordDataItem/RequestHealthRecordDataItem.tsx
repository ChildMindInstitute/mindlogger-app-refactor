import React, { FC, useMemo } from 'react';

import { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
  RequestHealthRecordDataResponse,
} from '@app/features/pass-survey/lib/types/payload';

import { AdditionalPromptStep } from './AdditionalPromptStep';
import { ConsentPromptStep } from './ConsentPromptStep';
import { OneUpHealthStep } from './OneUpHealthStep';
import { PartnershipStep } from './PartnershipStep';

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
  const content = useMemo(() => {
    switch (item.subStep) {
      case RequestHealthRecordDataItemStep.ConsentPrompt:
        return (
          <ConsentPromptStep
            item={item}
            onChange={onChange}
            responseValue={responseValue}
            textReplacer={textReplacer}
            assignment={assignment}
          />
        );

      case RequestHealthRecordDataItemStep.Partnership:
        return <PartnershipStep />;

      case RequestHealthRecordDataItemStep.OneUpHealth:
        return <OneUpHealthStep />;

      case RequestHealthRecordDataItemStep.AdditionalPrompt:
        return <AdditionalPromptStep item={item} textReplacer={textReplacer} />;
    }
  }, [assignment, item, onChange, responseValue, textReplacer]);

  return content;
};
