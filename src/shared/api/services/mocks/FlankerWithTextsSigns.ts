import { FlankerSettingsDto } from '../FlankerSettingsDto';

// todo - remove after api integration and qa testing

export const flankerSettingsTextSignsDto: FlankerSettingsDto = {
  general: {
    buttons: [
      { name: '<', value: 0, image: '' },
      { name: '>', value: 1, image: '' },
    ],
    fixation: null || {
      duration: 1000,
      // alt: '-----',
      //image: '',
      alt: '',
      image:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    },
    instruction: `## General Instructions\n
You will see arrows presented at the center of the screen that point either to the left ‘<’ or right ‘>’.
Press the left button if the arrow is pointing to the left ‘<’ or press the right button if the arrow is pointing to the right ‘>’.
These arrows will appear in the center of a line of other items. Sometimes, these other items will be arrows pointing in the same direction, e.g.. ‘> > > > >’, or in the opposite direction, e.g. ‘< < > < <’.
Your job is to respond to the central arrow, no matter what direction the other arrows are pointing.
For example, you would press the left button for both ‘< < < < <’, and ‘> > < > >’ because the middle arrow points to the left.
Finally, in some trials dashes ‘ - ’ will appear beside the central arrow.
Again, respond only to the direction of the central arrow. Please respond as quickly and accurately as possible.`,
    stimulusTrials: [
      {
        text: '<<<<<',
        id: 'left-con',
        value: 0,
        image: '',
      },
      {
        text: '<<><<',
        id: 'right-inc',
        value: 1,
        image: '',
      },
      {
        text: '>><>>',
        id: 'left-inc',
        value: 0,
        image: '',
      },
      {
        text: '>>>>>',
        id: 'right-con',
        value: 1,
        image: '',
      },
      {
        text: '--<--',
        id: 'left-neut',
        value: 0,
        image: '',
      },
      {
        text: '-->--',
        id: 'right-neut',
        value: 1,
        image: '',
      },
    ],
  },
  practice: {
    blocks: [
      {
        name: 'Block 1',
        order: [
          'left-con',
          'right-con',
          'left-inc',
          'left-con',
          'right-con',
          'left-inc',
        ],
      },
    ],
    instruction:
      '## Instructions\n\nNow you will have a chance to practice the task before moving on to the test phase. Remember to respond only to the central arrow ',
    randomizeOrder: true,
    showFeedback: true,
    showSummary: true,
    stimulusDuration: 2000,
    threshold: 50,
  },
  test: {
    instruction:
      '## Test Instructions\n\nGood job on the practice blocks. You can now move on to the test blocks. You will do the same task as in the practice, responding to the direction of the central arrow. You will complete 3 blocks, each about 3-5 minutes long. You will have a short break in between these blocks ',
    randomizeOrder: true,
    showFeedback: true,
    showSummary: true,
    stimulusDuration: 1500,
    blocks: [
      {
        name: 'Block 1',
        order: [
          'left-con',
          'right-con',
          'left-inc',
          'left-con',
          'right-con',
          'left-inc',
        ],
      },
      {
        name: 'Block 2',
        order: [
          'left-con',
          'right-con',
          'left-inc',
          'left-con',
          'right-con',
          'left-inc',
        ],
      },
    ],
  },
};
