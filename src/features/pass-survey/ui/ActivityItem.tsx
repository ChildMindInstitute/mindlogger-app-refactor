import { AbTest } from '@entities/abTrail';

import { PipelineItem, PipelineItemResponse } from '../lib';

type Props = {
  pipelineItem: PipelineItem;
  onResponse: (response: PipelineItemResponse) => void;
};

function ActivityItem({ pipelineItem, onResponse }: Props) {
  switch (pipelineItem.type) {
    case 'AbTest':
      return <AbTest {...pipelineItem.payload} onResponse={onResponse} />;

    default:
      return <></>;
  }
}

export default ActivityItem;
