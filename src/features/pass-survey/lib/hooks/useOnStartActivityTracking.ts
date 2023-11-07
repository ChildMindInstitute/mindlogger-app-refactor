import { useEffect, useRef } from 'react';

import { AnalyticsService } from '@app/shared/lib';

export function useOnStartActivityTracking(step: number) {
  const initialStepRef = useRef(step);

  useEffect(() => {
    if (initialStepRef.current === 0) {
      AnalyticsService.track('Assessment Started');
    }
  }, []);
}
