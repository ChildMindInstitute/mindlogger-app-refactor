import { MarkdownVariableReplacer } from './survey';

describe('MarkdownVariableReplacer', () => {
  const activityItems = [
    {
      variableName: 'name',
      inputType: 'text',
    },
    {
      variableName: 'age',
      inputType: 'ageSelector',
    },
    {
      variableName: 'birthDate',
      inputType: 'date',
    },
    {
      variableName: 'timeRange',
      inputType: 'timeRange',
    },
    {
      variableName: 'favoriteColor',
      inputType: 'radio',
      valueConstraints: {
        itemList: [
          { name: 'Blue', value: 1 },
          { name: 'Green', value: 2 },
          { name: 'Red', value: 3 },
        ],
      },
    },
    {
      variableName: 'hobbies',
      inputType: 'checkbox',
      valueConstraints: {
        itemList: [
          { name: 'Reading', value: 0 },
          { name: 'Gardening', value: 'gardening' },
          { name: 'Hiking', value: 'hiking' },
        ],
      },
    },
    {
      variableName: 'height',
      inputType: 'slider',
    },
    {
      variableName: 'invalidVar',
      inputType: 'invalid',
    },
  ];

  const answers = [
    'Alice!@#$%^&*()_+_)',
    25,
    { year: 1998, month: 3, day: 14 },
    { from: { hour: 10, minute: 0 }, to: { hour: 12, minute: 0 } },
    2,
    [0, 'gardening'],
    170,
    'aljkfhhjashfjakhjfas',
  ];

  it('should replace all variables in the markdown', () => {
    const md = `My name is [[name]], I am [[age]] years old and my birthday is on [[birthDate]]. 
    My favorite color is [[favoriteColor]] and my hobbies are [[hobbies]]. 
    My height is [[height]] cm and I am free from [[timeRange]] [[invalidVar]].`;
    const expected = `My name is Alice!@#\\$%^\\&*()_+_), I am 25 years old and my birthday is on 1998-04-14. 
    My favorite color is Green and my hobbies are Reading,Gardening. 
    My height is 170 cm and I am free from 10:00 - 12:00 .`;
    // @ts-ignore
    const instance = new MarkdownVariableReplacer(md, activityItems, answers);
    const result = instance.process();
    expect(result).toEqual(expected);
  });

  it('should not replace variables that do not have answers', () => {
    const markdown = `My name is [[name]], I am [[age]] years old and my birthday is on [[birthDate]]. 
    My favorite color is [[favoriteColor]] and my hobbies are [[hobbies]]. 
    My height is [[height]] cm and I am free from [[timeRange]].`;
    const expected = `My name is Alice, I am [[age]] years old and my birthday is on 1998-04-14. 
    My favorite color is [[favoriteColor]] and my hobbies are [[hobbies]]. 
    My height is [[height]] cm and I am free from [[timeRange]].`;

    // @ts-ignore
    const instance = new MarkdownVariableReplacer(markdown, activityItems, [
      'Alice',
      null,
      { year: 1998, month: 3, day: 14 },
    ]);
    const result = instance.process();
    expect(result).toEqual(expected);
  });
  const inputType = 'checkbox';
  it('should ignore items with unknown values', () => {
    const variableName = 'hobbies';
    const itemList = [
      { name: 'reading', value: 'reading' },
      { name: 'music', value: 'music' },
    ];
    const items = [{ variableName, inputType, valueConstraints: { itemList } }];
    const ans = [['reading', 'swimming']];
    const markdown = `My hobbies are [[${variableName}]]`;
    // @ts-ignore
    const instance = new MarkdownVariableReplacer(markdown, items, ans);
    const result = instance.process();
    const expected = 'My hobbies are reading';
    expect(result).toBe(expected);
  });
});
