import {
  DrawingStreamEvent,
  StreamEventLoggable,
} from '@app/shared/lib/tcp/types';
import { BoxProps } from '@app/shared/ui/base';

import { DrawingTestLegacyLayout } from './DrawingTestLegacyLayout';
import { DrawingTestNewLayout } from './DrawingTestNewLayout';
import { DrawLine, DrawResult } from '../../lib/types/draw';

type LegacySupportProps = {
  legacyLayoutSupport: boolean;
};

export type DrawingTestProps = {
  value: { lines: DrawLine[]; fileName: string | null };
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  dimensions: {
    height: number;
    width: number;
  };
  onResult: (result: DrawResult) => void;
  toggleScroll: (isScrollEnabled: boolean) => void;
} & StreamEventLoggable<DrawingStreamEvent> &
  BoxProps;

export const DrawingTest = ({
  legacyLayoutSupport,
  ...props
}: DrawingTestProps & LegacySupportProps) => {
  return legacyLayoutSupport ? (
    <DrawingTestLegacyLayout {...props} />
  ) : (
    <DrawingTestNewLayout {...props} />
  );
};
