import { format, intervalToDuration, isSameDay, addDays } from 'date-fns';

import { Item } from '@app/shared/ui/survey/CheckBox/types';

import { Answer, Answers } from './hooks/useActivityStorageRecord';
import {
  PipelineItem,
  PipelineItemResponse,
  RadioResponse,
  TimeRangeResponse,
} from './types/payload';

type Time = {
  hours: number;
  minutes: number;
};

export class MarkdownVariableReplacer {
  private readonly activityItems: PipelineItem[];
  private readonly answers: Answers;
  private readonly nickName: string;
  private readonly lastResponseTime: Date | number | null;
  private readonly now: number;

  constructor(
    activityItems: PipelineItem[],
    answers: Answers,
    lastResponseTime: Date | number | null,
    nickName: string = '',
  ) {
    this.activityItems = activityItems;
    this.answers = answers;
    this.nickName = nickName;
    this.lastResponseTime = lastResponseTime;
    this.now = Date.now();
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

  private formatTime = (time: Time | undefined): string => {
    if (time?.hours === 0) {
      time.hours = 12;
    }
    if (!time || !time.hours) {
      return '';
    }
    return `${time.hours}:${time.minutes < 10 ? '0' : ''}${time.minutes}`;
  };

  private parseBasicSystemVariables = (markdown: string) => {
    return markdown
      .replaceAll(/\[Now]/gi, format(this.now, 'h:mm aa') + ' today (now)')
      .replaceAll(/\[Nickname]/gi, this.nickName)
      .replaceAll(/\[sys.date]/gi, format(this.now, 'MM/dd/y'));
  };

  private cleanUpUnusedResponseVariables = (markdown: string) => {
    return markdown
      .replaceAll(/\[Time_Elapsed_Activity_Last_Completed]/gi, '')
      .replaceAll(/\[Time_Activity_Last_Completed]/gi, '');
  };

  public parseSystemVariables = (markdown: string) => {
    if (!this.lastResponseTime) {
      const cleanedUpMarkdown = this.cleanUpUnusedResponseVariables(markdown);
      return this.parseBasicSystemVariables(cleanedUpMarkdown);
    }

    markdown = markdown.replaceAll(
      /\[Time_Activity_Last_Completed] to \[Now]/gi,
      '[blue][Time_Activity_Last_Completed] to [Now]',
    );

    return this.parseBasicSystemVariables(markdown)
      .replaceAll(
        /\[Time_Elapsed_Activity_Last_Completed]/gi,
        this.getTimeElapsed(),
      )
      .replaceAll(
        /\[Time_Activity_Last_Completed]/gi,
        this.getLastResponseTime(),
      );
  };

  private getTimeElapsed = () => {
    const interval = intervalToDuration({
      start: this.lastResponseTime!,
      end: this.now,
    });
    let formattedString = '';

    if (interval.minutes) {
      formattedString = `${interval.minutes} minutes`;
    }
    if (interval.hours) {
      formattedString = `${interval.hours} hours and ` + formattedString;
    }
    if (interval.days) {
      formattedString = `${interval.days} days and ` + formattedString;
    }
    if (interval.months) {
      formattedString = `${interval.months} months and ` + formattedString;
    }

    if (interval.seconds && formattedString === '') {
      formattedString = 'minute';
    }

    return formattedString;
  };

  private getLastResponseTime = () => {
    if (isSameDay(this.now, this.lastResponseTime!)) {
      return `${format(this.lastResponseTime!, 'hh:mm aa')} today`;
    } else if (isSameDay(addDays(this.lastResponseTime!, 1), this.now)) {
      return `${format(this.lastResponseTime!, 'hh:mm aa')} yesterday`;
    }
    return format(this.lastResponseTime!, 'hh:mm aa dd/MM/y');
  };

  public process = (markdown: string) => {
    const variableNames = this.extractVariables(markdown);

    try {
      variableNames.forEach(variableName => {
        const updated = this.getReplaceValue(variableName);
        markdown = this.updateMarkdown(variableName, updated, markdown);
      });
    } catch (error) {
      console.warn(error);
    }

    return this.parseSystemVariables(markdown);
  };

  private escapeSpecialChars = (value: PipelineItemResponse) => {
    return value!.toString().replace(/(?=[$&])/g, '\\');
  };

  private getReplaceValue = (variableName: string): string => {
    const foundIndex = this.activityItems.findIndex(
      item => item.name === variableName,
    );
    const foundAnswerItem = this.answers[foundIndex as never] as Answer;
    const foundAnswer = foundAnswerItem?.answer;

    const answerNotFound = foundIndex < 0 || !foundAnswerItem || !foundAnswer;
    if (answerNotFound) {
      return `[[${variableName}]]`;
    }

    const activityItem = this.activityItems[foundIndex];
    let updated = '';

    if (
      activityItem.type === 'Slider' ||
      activityItem.type === 'NumberSelect' ||
      activityItem.type === 'TextInput'
    ) {
      updated = this.escapeSpecialChars(foundAnswer);
    } else if (activityItem.type === 'Radio') {
      const filteredItem = activityItem.payload.options.find(
        ({ id }) => id === (foundAnswer as RadioResponse).id,
      );
      if (filteredItem) {
        updated = filteredItem.text;
      }
    } else if (activityItem.type === 'Checkbox') {
      const selectedIds = (foundAnswer as Item[]).map((o: Item) => o.id);
      const filteredItems = activityItem.payload.options
        .filter(({ id }) => selectedIds.includes(id))
        .map(({ text }) => text);

      if (filteredItems) {
        updated = filteredItems.join(', ');
      }
    } else if (activityItem.type === 'TimeRange') {
      const startTime =
        (foundAnswer as TimeRangeResponse).startTime || undefined;
      const endTime = (foundAnswer as TimeRangeResponse).endTime || undefined;

      updated = `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
    } else if (activityItem.type === 'Date') {
      updated = foundAnswer as string;
    }

    const variablesLeftToProcess = this.extractVariables(updated);

    if (variablesLeftToProcess?.length) {
      return this.getReplaceValue(updated.replace(/[\[\]']+/g, ''));
    }

    return updated;
  };
}
