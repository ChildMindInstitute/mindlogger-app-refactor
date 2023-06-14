import { forwardRef } from 'react';

import { AbTutorialViewer, AbTutorialViewerProps } from '@entities/abTrail';
import {
  StabilityTrackerTutorialViewer,
  StabilityTrackerTutorialViewerProps,
} from '@entities/stabilityTracker';

type AbTutorialProps = {
  type: 'AbTrails';
} & AbTutorialViewerProps;

type StabilityTrackerProps = {
  type: 'StabilityTracker';
} & StabilityTrackerTutorialViewerProps;

type Props = StabilityTrackerProps | AbTutorialProps;

export type TutorialViewerRef = {
  next: () => boolean;
  back: () => boolean;
};

const TutorialViewerItem = forwardRef<TutorialViewerRef, Props>(
  (props: Props, ref) => {
    switch (props.type) {
      case 'AbTrails':
        return <AbTutorialViewer ref={ref} {...props} />;

      case 'StabilityTracker':
        return <StabilityTrackerTutorialViewer ref={ref} {...props} />;

      default:
        return <></>;
    }
  },
);

export default TutorialViewerItem;
