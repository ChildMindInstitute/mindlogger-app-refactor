import { Answers, PipelineItem } from '@app/features/pass-survey';
import { AnswerDto } from '@app/shared/api';

export default function isObject<TObj>(obj: TObj) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

export function mapAnswersToDto(
  pipeline: PipelineItem[],
  answers: Answers,
  flowId: string | null,
): Array<AnswerDto> {
  const filteredAnswers = Object.entries(answers).filter(([_, answer]) => {
    return answer.answer != null;
  });
  const activityItemIds = filteredAnswers.map(([step]) => {
    return pipeline[Number(step)]?.id!;
  });

  const result = filteredAnswers.map(([step, answer]) => {
    const dto: AnswerDto = {
      activityId: pipeline[Number(step)]?.id!,
      flowId: flowId,
      itemIds: activityItemIds,
      answer: {
        value: answer.answer as any, //TODO: fix when all types of answers DTOs are done
      },
    };

    const pipelineItem = pipeline[+step];

    if (answer.additionalAnswer) {
      dto.answer.additionalText = answer.additionalAnswer;
    }

    if (pipelineItem.type === 'TextInput') {
      dto.answer.shouldIdentifyResponse =
        pipelineItem.payload.shouldIdentifyResponse;
    }

    return dto;
  });

  return result;
}
