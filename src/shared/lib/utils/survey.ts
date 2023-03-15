import { format } from 'date-fns';

import { colors } from '@shared/lib/constants';

export const invertColor = (hex: string) => {
  const RED_RATIO = 299;
  const GREEN_RATIO = 587;
  const BLUE_RATIO = 114;
  const hexColor = hex.replace('#', '');
  const red = parseInt(hexColor.substring(0, 2), 16);
  const green = parseInt(hexColor.substring(2, 4), 16);
  const blue = parseInt(hexColor.substring(4, 6), 16);
  const yiqColorSpaceValue =
    (red * RED_RATIO + green * GREEN_RATIO + blue * BLUE_RATIO) / 1000;
  return yiqColorSpaceValue >= 128 ? colors.darkerGrey : colors.white;
};

export const replaceTextWithScreenVariables = (markdown: string): string => {
  const activityItems: ActivityItems = []; //@todo get these from some storage?
  const answers: Answer[] = [];
  const replacer = new MarkdownVariableReplacer(
    markdown,
    activityItems,
    answers,
  );
  return replacer.process();
};

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

type TimeRangeInput = {
  inputType: 'timeRange';
  answer: TimeRangeAnswer;
};

type DateAnswer = {
  year: number;
  month: number;
  day: number;
};

type DateInput = {
  inputType: 'date';
  answer: DateAnswer;
};

type TextInput = {
  inputType: 'text';
  answer: string;
};

type RadioInput = {
  inputType: 'radio';
  answer: number;
};

type AgeSelectorInput = {
  inputType: 'ageSelector';
  answer: number;
};

type SliderInput = {
  inputType: 'slider';
  answer: number;
};

type CheckBoxInput = {
  inputType: 'checkbox';
  answer: string[];
};

type Answer = DateAnswer | TimeRangeAnswer | string | string[] | number;

type InputAnswer =
  | DateInput
  | TimeRangeInput
  | TextInput
  | RadioInput
  | CheckBoxInput
  | AgeSelectorInput
  | SliderInput;

type ActivityItems = {
  variableName: string;
  inputType: InputAnswer['inputType'];
  valueConstraints: {
    itemList: { name: string; value: string | number }[];
  };
}[];

export class MarkdownVariableReplacer {
  private markdown = '';
  private readonly activityItems: ActivityItems;
  private readonly answers;

  constructor(
    markdown: string,
    activityItems: ActivityItems,
    answers: Answer[],
  ) {
    this.markdown = markdown;
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

  private updateMarkdown = (variableName: string, replaceValue: string) => {
    const reg = new RegExp(`\\[\\[${variableName}\\]\\]`, 'gi');
    this.markdown = this.markdown.replace(reg, replaceValue);
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

  public process = () => {
    const variableNames = this.extractVariables(this.markdown);

    if (!this.answers?.length || !variableNames?.length) {
      return this.markdown;
    }

    try {
      variableNames.forEach(variableName => {
        const updated = this.getReplaceValue(variableName);
        this.updateMarkdown(variableName, updated);
      });
    } catch (error) {
      console.warn(error);
    }

    return this.markdown;
  };

  private escapeSpecialChars = (value: number | string) => {
    return value.toString().replace(/(?=[$&])/g, '\\');
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
    const inputAnswer: InputAnswer = <InputAnswer>{
      inputType: activityItem.inputType,
      answer: this.answers[foundIndex],
    };
    const itemList = activityItem?.valueConstraints?.itemList;

    switch (inputAnswer.inputType) {
      case 'slider':
      case 'ageSelector':
      case 'text':
        updated = this.escapeSpecialChars(inputAnswer.answer);
        break;
      case 'radio':
        const filteredItem = itemList.find(
          ({ value }) => value === inputAnswer.answer,
        );
        if (filteredItem) {
          updated = filteredItem.name;
        }
        break;
      case 'checkbox':
        const filteredItems = itemList
          .filter(({ value }) => inputAnswer.answer?.includes(value as string))
          .map(({ name }) => name);
        if (filteredItems) {
          updated = filteredItems.toString();
        }
        break;
      case 'timeRange':
        updated = `${this.formatTime(
          inputAnswer.answer?.from,
        )} - ${this.formatTime(inputAnswer.answer?.to)}`;
        break;
      case 'date':
        updated = this.formatDate(inputAnswer.answer);
        break;
    }
    return updated;
  };
}
