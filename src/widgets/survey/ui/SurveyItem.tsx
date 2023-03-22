import { ActivityStepper } from '@app/features/pass-survey';
import { colors } from '@app/shared/lib';
import { BackButton, Box, CrossIcon } from '@app/shared/ui';

import FinishItem from './FinishItem';
import IntermediateItem from './IntermediateItem';
import { FlowPipelineItem } from '../model';

type Props = {
  onClose: () => void;
  onBack: () => void;
  onComplete: () => void;
} & FlowPipelineItem;

function SurveyItem({ type, payload, onBack, onClose, onComplete }: Props) {
  switch (type) {
    case 'Stepper': {
      return (
        <Box flex={1}>
          <BackButton alignSelf="flex-end" mr={16} mt={10} mb={4}>
            <CrossIcon color={colors.tertiary} size={30} />
          </BackButton>

          <ActivityStepper
            {...payload}
            onClose={onClose}
            onFinish={onComplete}
          />
        </Box>
      );
    }

    case 'Intermediate': {
      return (
        <IntermediateItem {...payload} onClose={onBack} onFinish={onComplete} />
      );
    }

    case 'Finish': {
      return <FinishItem {...payload} onClose={onClose} />;
    }
  }
}

export default SurveyItem;
