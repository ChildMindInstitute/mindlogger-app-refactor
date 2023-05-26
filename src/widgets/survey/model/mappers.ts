import {
  Answers,
  PipelineItem,
  PipelineItemAnswer,
} from '@app/features/pass-survey';
import { AnswerDto } from '@app/shared/api';

type Answer = PipelineItemAnswer['value'];

export function mapAnswersToDto(
  pipeline: PipelineItem[],
  answers: Answers,
): Array<AnswerDto> {
  const filteredAnswers = Object.entries(answers).filter(([_, answer]) => {
    return answer.answer != null;
  });

  const result = filteredAnswers.map(([step, answer]) => {
    const pipelineItem = pipeline[+step];
    switch (pipelineItem.type) {
      case 'TextInput':
        return convertToTextAnswer(answer);

      case 'Radio':
        return convertToSingleSelectAnswer(answer);

      case 'Checkbox':
        return convertToCheckboxAnswer(answer);

      case 'Slider':
        return convertToSliderAnswer(answer);

      case 'NumberSelect':
        return null;

      default:
        return null;
    }
  });

  return result;
}

function convertToTextAnswer(answer: Answer) {
  return {
    value: answer.answer,
  };
}

function convertToSingleSelectAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}

function convertToSliderAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}

function convertToCheckboxAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}
