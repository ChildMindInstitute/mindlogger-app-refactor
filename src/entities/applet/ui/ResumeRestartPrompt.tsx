import { FC, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ActionModal } from '@app/shared/ui/ActionModal';

export type ResumeRestartChoice = 'resume' | 'restart' | 'dismiss';

type PromptRequest = {
  resolve: (choice: ResumeRestartChoice) => void;
};

let showPrompt: ((request: PromptRequest) => void) | null = null;

export function promptResumeRestart(): Promise<ResumeRestartChoice> {
  return new Promise(resolve => {
    if (!showPrompt) {
      getDefaultLogger().warn(
        '[promptResumeRestart] ResumeRestartPromptHost is not mounted',
      );
      resolve('dismiss');
      return;
    }

    showPrompt({ resolve });
  });
}

export const ResumeRestartPromptHost: FC = () => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<'choose' | 'confirm'>('choose');

  const requestRef = useRef<PromptRequest | null>(null);

  const finish = (choice: ResumeRestartChoice) => {
    requestRef.current?.resolve(choice);
    requestRef.current = null;
    setIsVisible(false);
  };

  useEffect(() => {
    showPrompt = request => {
      // Never leave a caller waiting: an older open prompt counts as dismissed
      requestRef.current?.resolve('dismiss');
      requestRef.current = request;
      setStep('choose');
      setIsVisible(true);
    };

    return () => {
      showPrompt = null;
      requestRef.current?.resolve('dismiss');
      requestRef.current = null;
    };
  }, []);

  const isConfirmStep = step === 'confirm';

  return (
    <ActionModal
      visible={isVisible}
      testID="resume-restart-modal"
      title={
        isConfirmStep
          ? t('additional:restart_activity_title')
          : t('additional:activity_in_progress_title')
      }
      body={
        isConfirmStep
          ? t('additional:restart_activity_body')
          : t('additional:activity_in_progress_body')
      }
      primaryLabel={
        isConfirmStep ? t('additional:restart') : t('additional:resume')
      }
      primaryMode={isConfirmStep ? 'destructive' : 'primary'}
      onPrimary={() => finish(isConfirmStep ? 'restart' : 'resume')}
      secondaryLabel={
        isConfirmStep ? t('additional:back') : t('additional:restart')
      }
      onSecondary={() => setStep(isConfirmStep ? 'choose' : 'confirm')}
      onDismiss={() => finish('dismiss')}
    />
  );
};
