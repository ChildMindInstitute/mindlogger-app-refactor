import { ActivityDetails } from '@app/entities/activity';

import { getAbTrailsPipeline } from './precompiled-pipelines';
import { PipelineItem } from '../lib';

export function buildPipeline(activity: ActivityDetails): PipelineItem[] {
  const pipeline: PipelineItem[] = activity.items
    .map(item => {
      switch (item.inputType) {
        case 'AbTest': {
          return getAbTrailsPipeline(item.config.device);
        }

        case 'Splash': {
          return {
            type: item.inputType,
            payload: null,
          };
        }

        case 'DrawingTest': {
          return {
            type: item.inputType,
            payload: item.config,
            question: item.question,
          };
        }

        case 'Flanker': {
          return {
            type: item.inputType,
            payload: item.config,
          };
        }
      }
    })
    .reduce<PipelineItem[]>((items, item) => {
      return Array.isArray(item) ? [...items, ...item] : [...items, item];
    }, []);

  return pipeline;
}
