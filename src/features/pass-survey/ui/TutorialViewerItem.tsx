import { forwardRef } from 'react';

import { AbTutorialViewer, AbTutorialViewerProps } from '@entities/abTrail';
import {
  GyroscopeTutorialViewer,
  GyroscopeTutorialViewerProps,
} from '@entities/gyroscope';

type AbTutorialProps = {
  type: 'AbTrails';
} & AbTutorialViewerProps;

type GyroscopeProps = {
  type: 'Gyroscope';
} & GyroscopeTutorialViewerProps;

type Props = GyroscopeProps | AbTutorialProps;

export type TutorialViewerRef = {
  next: () => boolean;
  back: () => boolean;
};

const TutorialViewerItem = forwardRef<TutorialViewerRef, Props>(
  (props: Props, ref) => {
    switch (props.type) {
      case 'AbTrails':
        return <AbTutorialViewer ref={ref} {...props} />;

      case 'Gyroscope':
        return <GyroscopeTutorialViewer ref={ref} {...props} />;

      default:
        return <></>;
    }
  },
);

export default TutorialViewerItem;
