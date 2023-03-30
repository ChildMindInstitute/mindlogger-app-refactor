import { PipelineItemResponse, TextInputPipelineItem } from '../lib';

export function TextResponseMapper(pipelineItem: TextInputPipelineItem) {
  return {
    toResponse(value: string): PipelineItemResponse {
      return value
        ? {
            text: value,
            shouldIdentifyResponse: pipelineItem.payload.shouldIdentifyResponse,
          }
        : undefined;
    },
  };
}
