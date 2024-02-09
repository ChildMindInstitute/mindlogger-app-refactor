import { MarkdownVariableReplacer } from './markdownVariableReplacer';

describe('MarkdownVariableReplacer', () => {
  it('should return the same markdown string when no variables are present', () => {
    const activityItems = [];
    const answers = [];
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text';
    expect(replacer.process(markdown)).toEqual(markdown);
  });

  it('should return the markdown string with the variable replaced when only one variable is present', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [{ answer: 'bar' }];
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
    const answers = [{ answer: 'abc' }, { answer: '2' }, { answer: { id: '1', text: 'Option 1' } }];
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]] and [[bar]] and [[baz]]';
    const expected = 'This is some text abc and 2 and Option 1';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should escape special characters in the answer', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [{ answer: '$10' }];
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]]';
    const expected = 'This is some text \\$10';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should return the markdown string with the variable name when no answer is present', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [];
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[foo]]';
    const expected = 'This is some text [[foo]]';
    expect(replacer.process(markdown)).toEqual(expected);
  });

  it('should return the markdown string with the variable name when the activity item is not found', () => {
    const activityItems = [{ name: 'foo', type: 'TextInput' }];
    const answers = [{ answer: 'bar' }];
    const replacer = new MarkdownVariableReplacer(activityItems, answers);
    const markdown = 'This is some text [[baz]]';
    const expected = 'This is some text [[baz]]';
    expect(replacer.process(markdown)).toEqual(expected);
  });
  describe('process', () => {
    let activityItems;
    let answers;
    let replacer;

    beforeEach(() => {
      activityItems = [
        {
          id: '1',
          name: 'name1',
          type: 'TextInput',
          payload: {},
        },
        {
          id: '2',
          name: 'name2',
          type: 'Checkbox',
          payload: {
            options: [
              { id: '1', text: 'Option 1' },
              { id: '2', text: 'Option 2' },
              { id: '3', text: 'Option 3' },
            ],
          },
        },
        {
          id: '3',
          name: 'name3',
          type: 'Date',
          payload: {},
        },
        {
          id: '4',
          name: 'name4',
          type: 'TimeRange',
          payload: {},
        },
      ];
      answers = {
        0: { answer: 'John Doe' },
        1: {
          answer: [
            {
              id: '1',
              text: 'Option 1',
            },
            {
              id: '3',
              text: 'Option 3',
            },
          ],
        },
        2: {
          answer: '2022-02-02',
        },
        3: {
          answer: {
            startTime: {
              hours: 10,
              minutes: 0,
            },
            endTime: {
              hours: 22,
              minutes: 50,
            },
          },
        },
      };
      replacer = new MarkdownVariableReplacer(activityItems, answers);
    });

    it('should replace checkbox variable with selected options', () => {
      const markdown = 'Hello [[name1]], you selected [[name2]].';
      const expectedOutput = 'Hello John Doe, you selected Option 1, Option 3.';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });

    it('should replace Date variable with selected date', () => {
      const markdown = 'Hello [[name1]], you selected date [[name3]].';
      const expectedOutput = 'Hello John Doe, you selected date 2022-02-02.';
      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });

    it('should replace Date variable with selected timeRange', () => {
      const markdown = 'Hello [[name1]], you selected date [[name4]].';
      const expectedOutput = 'Hello John Doe, you selected date 10:00 - 22:50.';
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

    it('should replace nested variables', () => {
      const nestedActivityItems = [
        {
          id: 'df667c1a-a626-4f70-8081-95c504e7bfde',
          name: 'ItemText',
          type: 'TextInput',
          payload: {},
        },
        {
          id: '977c6e6c-dcd8-4cfa-9fe8-8aac7c7f574b',
          name: 'ItemSS',
          type: 'Radio',
          payload: {
            options: [
              {
                id: '871348a4-4820-43a5-8050-f5860a43d356',
                text: '[[ItemText]]',
                value: 0,
              },
              {
                id: '2abfccd7-89b6-4a72-86cf-66223dba5d00',
                text: 'opt2',
                value: 1,
              },
            ],
          },
        },
        {
          id: '50919a95-e9d3-4cee-a4be-bc70e3387826',
          name: 'ItemMS',
          type: 'Checkbox',
          payload: {
            options: [
              {
                id: '2819eb70-8843-4b9c-a73f-fe370cc6809c',
                text: '[[ItemSS]]',
                value: 0,
              },
              {
                id: '4ad7c96b-7c8f-4512-9293-4609950bfff1',
                text: 'opt4',
                value: 1,
              },
            ],
          },
        },
        {
          id: '3d696b71-48b6-426a-bc21-87833bda0351',
          name: 'ItemSl',
          type: 'Slider',
          payload: {},
        },
        {
          id: '90c99a5b-689e-45a0-8e63-c75e2335d85d',
          name: 'ItemNS',
          type: 'NumberSelect',
          payload: {},
        },
        {
          id: 'b1c54326-d856-492a-8c26-0c6f6e7b9653',
          name: 'ItemT',
          type: 'TextInput',
          payload: {},
        },
      ];
      const nestedAnswers = {
        0: { answer: 'My name is John doe' },
        1: {
          answer: {
            id: '871348a4-4820-43a5-8050-f5860a43d356',
            text: '[[ItemText]]',
            value: 0,
          },
        },
        2: {
          answer: [
            {
              id: '2819eb70-8843-4b9c-a73f-fe370cc6809c',
              text: '[[ItemSS]]',
              value: 0,
            },
          ],
        },
        3: { answer: 3 },
        4: { answer: '1' },
      };

      replacer = new MarkdownVariableReplacer(nestedActivityItems, nestedAnswers);

      const markdown = `**ItemText content:**
            Text: [[ItemText]]
            Single_Selection: [[ItemSS]]
            Multiple_Selection: [[ItemMS]]
            Slider: [[ItemSl]]
            Number_Selection: [[ItemNS]]`;

      const expectedOutput = `**ItemText content:**
            Text: My name is John doe
            Single_Selection: My name is John doe
            Multiple_Selection: My name is John doe
            Slider: 3
            Number_Selection: 1`;

      const processedMarkdown = replacer.process(markdown);
      expect(processedMarkdown).toEqual(expectedOutput);
    });
  });
});
