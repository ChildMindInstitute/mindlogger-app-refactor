import { AbTest } from '@entities/abTrail';
import { DrawingTest } from '@entities/drawer';

import { PipelineItem, PipelineItemResponse } from '../lib';

type Props = {
  value: any;
  pipelineItem: PipelineItem;
  onResponse: (response: PipelineItemResponse) => void;
};

function ActivityItem({ value, pipelineItem, onResponse }: Props) {
  switch (pipelineItem.type) {
    case 'AbTest':
      return <AbTest {...pipelineItem.payload} onComplete={onResponse} />;

    case 'DrawingTest':
      return (
        <DrawingTest
          flex={1}
          {...pipelineItem.payload}
          initialLines={value?.lines ?? []}
          onStarted={() => console.log('onStarted')}
          onResult={onResponse}
        />
      );

    default:
      return <></>;
  }
}

export default ActivityItem;
