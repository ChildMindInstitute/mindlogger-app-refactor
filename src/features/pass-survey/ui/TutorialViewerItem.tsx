import { forwardRef } from 'react';

import { AbTutorialViewer, AbTutorialViewerProps } from '@entities/abTrail';

type AbTutorialProps = {
  type: 'AbTutorial';
} & AbTutorialViewerProps;

type Props = AbTutorialProps;

export type TutorialViewerRef = {
  next: () => boolean;
  back: () => boolean;
};

const TutorialViewerItem = forwardRef<TutorialViewerRef, Props>(
  (props: Props, ref) => {
    switch (props.type) {
      case 'AbTutorial':
        return <AbTutorialViewer ref={ref} {...props} />;

      default:
        return <></>;
    }
  },
);

export default TutorialViewerItem;
