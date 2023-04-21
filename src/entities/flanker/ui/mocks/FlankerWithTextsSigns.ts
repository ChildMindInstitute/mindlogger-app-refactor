import { FlankerConfiguration } from '../../lib/types';

export const FlankerWithTextsSigns: FlankerConfiguration = {
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
  blocks: [
    {
      name: 'Block 1',
      order: [
        'left-con',
        'right-con',
        'left-inc',
        'right-inc',
        'left-neut',
        'right-neut',
      ],
    },
    {
      name: 'Block 2',
      order: [
        'left-con',
        'right-con',
        'left-inc',
        'right-inc',
        'left-neut',
        'right-neut',
      ],
    },
    {
      name: 'Block 3',
      order: [
        'left-con',
        'right-con',
        'left-inc',
        'right-inc',
        'left-neut',
        'right-neut',
      ],
    },
    {
      name: 'Block 4',
      order: [
        'left-con',
        'right-con',
        'left-inc',
        'right-inc',
        'left-neut',
        'right-neut',
      ],
    },
    {
      name: 'Block 5',
      order: [
        'left-con',
        'right-con',
        'left-inc',
        'right-inc',
        'left-neut',
        'right-neut',
      ],
    },
  ],
  buttons: [
    { text: '<', value: 0, image: '' },
    { text: '>', value: 1, image: '' },
  ],
  showFixation: true,
  showFeedback: true,
  showResults: true,
  samplingMethod: 'randomize-order',
  nextButton: 'OK',
  sampleSize: 1,
  trialDuration: 3000,
  fixationDuration: 500,
  fixationScreen: { value: '-----', image: '' },
  minimumAccuracy: 80,
  isLastPractice: false,
  blockType: 'practice',
};
