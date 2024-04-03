import { BoxProps } from '@app/shared/ui';
import { DrawingStreamEvent, StreamEventLoggable } from '@shared/lib';

import DrawingTestLegacy from './DrawingTestLegacy';
import DrawingTestWithRatio from './DrawingTestWithRatio';
import { DrawLine, DrawResult } from '../../lib';

type Props = {
  value: { lines: DrawLine[]; fileName: string | null };
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  ratio: {
    exampleImage: number;
    canvas: number;
  } | null;
  onResult: (result: DrawResult) => void;
  toggleScroll: (isScrollEnabled: boolean) => void;
} & StreamEventLoggable<DrawingStreamEvent> &
  BoxProps;

const DrawingTest = (props: Props) => {
  return props.ratio ? (
    <DrawingTestWithRatio {...props} ratio={props.ratio} />
  ) : (
    <DrawingTestLegacy {...props} />
  );
};

export type DrawingTestProps = Props;

export default DrawingTest;
