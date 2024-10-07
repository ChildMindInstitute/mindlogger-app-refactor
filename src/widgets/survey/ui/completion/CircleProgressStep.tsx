import { useTranslation } from 'react-i18next';

import { Box } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { CircleProgress } from './CircleProgress';

type Props = {
  circleSize: number;
  currentStep: number;
  totalSteps: number;
};

export const CircleProgressStep = ({
  circleSize,
  currentStep,
  totalSteps,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Box f={1} ai="center" jc="center" pos="relative">
      <CircleProgress progress={currentStep / totalSteps} size={circleSize} />

      <Box pos="absolute">
        <Text ta="center" tt="uppercase" fow="400" fos={10} ls={0.1}>
          {t('activity:step')}
        </Text>
        <Text
          fow="700"
          fos={12}
          ls={0.1}
        >{`${currentStep} of ${totalSteps}`}</Text>
      </Box>
    </Box>
  );
};
