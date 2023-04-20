import { Answers } from './hooks';
import { MarkdownVariableReplacer } from './markdownVariableReplacer';
import { PipelineItem } from './types';

describe('MarkdownVariableReplacer', () => {
  it('should return the same markdown string when no variables are present', () => {
    const activityItems: PipelineItem[] = [];
    // @ts-ignore
    const answers: Answers = [];
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text';
    expect(replacer.process(markdown)).toEqual(markdown);
  });

  it('should return the markdown string with the variable replaced when only one variable is present', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [{ answer: 'bar' }];
    // @ts-ignore
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]]';
    const expected = 'This is some text bar';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should return the markdown string with all variables replaced when multiple variables are present', () => {
    const activityItems = [
      { name: 'foo', type: 'TextInput' },
      { name: 'bar', type: 'NumberSelect' },
      {
        name: 'baz',
        type: 'Radio',
        payload: {
          options: [
            { id: '1', text: 'Option 1' },
            { id: '2', text: 'Option 2' },
          ],
        },
      },
    ];
    const answers = [{ answer: 'abc' }, { answer: '2' }, { answer: '1' }];
    // @ts-ignore
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]] and [[bar]] and [[baz]]';
    const expected = 'This is some text abc and 2 and Option 1';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should escape special characters in the answer', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [{ answer: '$10' }];
    // @ts-ignore
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]]';
    const expected = 'This is some text \\$10';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should return the markdown string with the variable name when no answer is present', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    // @ts-ignore
    const answers = [];
    // @ts-ignore
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]]';
    const expected = 'This is some text [[foo]]';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should return the markdown string with the variable name when the activity item is not found', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [{ answer: 'bar' }];
    // @ts-ignore
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[baz]]';
    const expected = 'This is some text [[baz]]';
    expect(replacer.process(markdown)).toEqual(expected);
  });
  describe('process', () => {
    let activityItems: PipelineItem[];
    let answers: Record<string, any>;
    let replacer: MarkdownVariableReplacer;

    beforeEach(() => {
      activityItems = [
        {
          id: '1',
          name: 'name1',
          type: 'TextInput',
          // @ts-ignore
          payload: {},
        },
        {
          id: '2',
          name: 'name2',
          type: 'Checkbox',
          payload: {
            options: [
              // @ts-ignore
              { id: '1', text: 'Option 1' },
              // @ts-ignore
              { id: '2', text: 'Option 2' },
              // @ts-ignore
              { id: '3', text: 'Option 3' },
            ],
          },
        },
        {
          id: '3',
          name: 'name3',
          type: 'TimeRange',
          // @ts-ignore
          payload: {},
        },
      ];
      answers = {
        0: { answer: 'John Doe' },
        1: { answer: ['1', '3'] },
        2: {
          answer: {
            from: 'Tue Apr 18 2023 13:55:02 GMT+0400',
            to: 'Tue Apr 18 2023 15:04:02 GMT+0400',
          },
        },
      };
      replacer = new MarkdownVariableReplacer(activityItems, answers);
    });

    it('should replace timeRange variable with selected time', () => {
      const markdown = 'Hello [[name1]], you selected [[name3]] time.';
      const expectedOutput = 'Hello John Doe, you selected 13:55 - 15:04 time.';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });

    it('should replace checkbox variable with selected options', () => {
      const markdown = 'Hello [[name1]], you selected [[name2]].';
      const expectedOutput = 'Hello John Doe, you selected Option 1,Option 3.';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });

    it('should leave checkbox variable as is if no options selected', () => {
      answers[1].answer = ['1', '2'];
      const markdown = 'Hello [[name1]], you selected [[name2]].';
      const expectedOutput = 'Hello John Doe, you selected Option 1,Option 2.';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });

    it('should leave checkbox variable as is if answer not found', () => {
      delete answers[1];
      const markdown = 'Hello [[name1]], you selected [[name2]].';
      const expectedOutput = 'Hello John Doe, you selected [[name2]].';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });

    it('should leave markdown as is if no variables found', () => {
      const markdown = 'Hello John Doe.';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(markdown);
    });

    it('should leave markdown as is if no answers found', () => {
      answers = {};
      replacer = new MarkdownVariableReplacer(activityItems, answers);
      const markdown = 'Hello [[name1]], you selected [[name2]].';
      const expectedOutput = 'Hello [[name1]], you selected [[name2]].';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });
  });
});
