import { useTranslation } from 'react-i18next';

import { BoxProps, Stepper, StepperProps } from '@shared/ui';

type Props = BoxProps & {
  stepper: Omit<StepperProps, 'startFrom' | 'stepsCount'>;
};

function StaticNavigationPanel(props: Props) {
  const { t } = useTranslation();

  return (
    <Stepper startFrom={0} stepsCount={0} {...props.stepper}>
      <Stepper.Progress />

      <Stepper.NavigationPanel {...props}>
        <></>
        <></>
        <Stepper.NextButton accessibilityLabel="done-button">{t('activity_navigation:done')}</Stepper.NextButton>
      </Stepper.NavigationPanel>
    </Stepper>
  );
}

export default StaticNavigationPanel;
