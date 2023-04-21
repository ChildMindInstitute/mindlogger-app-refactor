import { forwardRef } from 'react';

import { AbTutorialViewer, AbTutorialViewerProps } from '@entities/abTrail';

type AbTutorialProps = {
  type: 'AbTrails';
} & AbTutorialViewerProps;

type GyroscopeProps = {
  type: 'Gyroscope';
} & {};

type Props = AbTutorialProps | GyroscopeProps;

export type TutorialViewerRef = {
  next: () => boolean;
  back: () => boolean;
};

const TutorialViewerItem = forwardRef<TutorialViewerRef, Props>(
  (props: Props, ref) => {
    switch (props.type) {
      case 'AbTrails':
        return <AbTutorialViewer ref={ref} {...props} />;

      default:
        return <></>;
    }
  },
);

export default TutorialViewerItem;
