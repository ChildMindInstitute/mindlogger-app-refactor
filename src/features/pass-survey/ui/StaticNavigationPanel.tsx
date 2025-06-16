import { XStackProps } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { Stepper, StepperProps } from '@app/shared/ui/Stepper';

type Props = XStackProps & {
  stepper: Omit<StepperProps, 'startFrom' | 'stepsCount'>;
};

export function StaticNavigationPanel(props: Props) {
  const { t } = useTranslation();

  return (
    <Stepper startFrom={0} stepsCount={0} {...props.stepper}>
      <Stepper.Progress />

      <Stepper.NavigationPanel {...props}>
        <></>
        <></>
        <Stepper.NextButton accessibilityLabel="done-button">
          {t('activity_navigation:done')}
        </Stepper.NextButton>
      </Stepper.NavigationPanel>
    </Stepper>
  );
}
