import { format } from 'date-fns';

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

export type Answer = DateAnswer | TimeRangeAnswer | string | string[] | number;

type InputAnswer =
  | DateInput
  | TimeRangeInput
  | TextInput
  | RadioInput
  | CheckBoxInput
  | AgeSelectorInput
  | SliderInput;

export type ActivityItems = {
  variableName: string;
  inputType: InputAnswer['inputType'];
  valueConstraints: {
    itemList: { name: string; value: string | number }[];
  };
}[];

export class MarkdownVariableReplacer {
  private readonly activityItems: ActivityItems;
  private readonly answers;

  constructor(activityItems: ActivityItems, answers: Answer[]) {
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

    if (!this.answers?.length || !variableNames?.length) {
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
