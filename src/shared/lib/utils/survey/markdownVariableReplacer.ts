import { format } from 'date-fns';

import { Answers } from '@features/pass-survey/lib/hooks';
import { PipelineItem } from '@features/pass-survey/lib/types';
import { PipelineItemResponse } from '@features/pass-survey/lib/types';

// @todo test this with other input types, finish timeRange and date types

type TimeRangeAnswer = {
  from: {
    hour: number;
    minute: number;
  };
  to: {
    hour: number;
    minute: number;
  };
};

type DateAnswer = {
  year: number;
  month: number;
  day: number;
};

type ActivityItems = PipelineItem[];

export class MarkdownVariableReplacer {
  private readonly activityItems: ActivityItems;
  private readonly answers: Answers;

  constructor(activityItems: ActivityItems, answers: Answers) {
    this.activityItems = activityItems;
    this.answers = answers;
  }

  private extractVariables = (markdown: string): string[] => {
    const regEx = /\[\[(.*?)]]/g;
    const matches = [];
    let found;
    while ((found = regEx.exec(markdown))) {
      matches.push(found[1]);
    }
    return matches;
  };

  private updateMarkdown = (
    variableName: string,
    replaceValue: string,
    markdown: string,
  ) => {
    const reg = new RegExp(`\\[\\[${variableName}\\]\\]`, 'gi');
    return markdown.replace(reg, replaceValue);
  };

  private formatTime = (
    timeObject: TimeRangeAnswer['to'] | undefined,
  ): string => {
    if (!timeObject) {
      return '';
    }
    const { hour, minute } = timeObject;
    return format(new Date(0, 0, 0, hour, minute), 'HH:mm');
  };

  private formatDate = (dateObject: undefined | DateAnswer): string => {
    if (!dateObject) {
      return '';
    }
    const { year, month, day } = dateObject;
    return format(new Date(year, month, day), 'y-MM-dd');
  };

  public process = (markdown: string) => {
    const variableNames = this.extractVariables(markdown);
    if (!Object.values(this.answers)?.length || !variableNames?.length) {
      return markdown;
    }

    try {
      variableNames.forEach(variableName => {
        const updated = this.getReplaceValue(variableName);
        markdown = this.updateMarkdown(variableName, updated, markdown);
      });
    } catch (error) {
      console.warn(error);
    }

    return markdown;
  };

  private escapeSpecialChars = (value: PipelineItemResponse) => {
    return value!.toString().replace(/(?=[$&])/g, '\\');
  };

  private getReplaceValue = (variableName: string) => {
    const foundIndex = this.activityItems.findIndex(
      item => item.variableName === variableName,
    );
    const answerNotFound = foundIndex < 0 || !this.answers[foundIndex];

    if (answerNotFound) {
      return `[[${variableName}]]`;
    }

    const activityItem = this.activityItems[foundIndex];
    let updated = '';
    const answer = this.answers[foundIndex].answer as string;

    switch (activityItem.type) {
      case 'Slider':
      case 'NumberSelect':
      case 'TextInput':
        updated = this.escapeSpecialChars(answer);
        break;
      case 'Radio':
        const filteredItem = activityItem.payload.options.find(
          ({ id }) => id === answer,
        );
        if (filteredItem) {
          updated = filteredItem.text;
        }
        break;
      case 'Checkbox':
        const filteredItems = activityItem.payload.options
          .filter(({ id }) => answer.includes(id))
          .map(({ text }) => text);

        if (filteredItems) {
          updated = filteredItems.toString();
        }
        break;
      // @todo
      // case 'timeRange':
      //   updated = `${this.formatTime(
      //     answer?.from,
      //   )} - ${this.formatTime(answer?.to)}`;
      //   break;
      // case 'date':
      //   updated = this.formatDate(answer);
      //   break;
    }
    return updated;
  };
}
