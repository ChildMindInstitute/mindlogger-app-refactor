/*
import { PipelineItem } from '../lib';

const PracticesCount = 3;
const TestsCount = 3;

export const buildFlankerPipeline = (
  settings: FlankerSettings,
  itemId: string,
): PipelineItem[] => {
  const result: PipelineItem[] = [];

  result.push({
    type: 'Message',
    timer: null,
    isAbleToMoveBack: false,
    isSkippable: false,
    question: settings.general.instruction,
    payload: null,
  });

  result.push({
    type: 'Message',
    timer: null,
    isAbleToMoveBack: false,
    isSkippable: false,
    question:
      '## Instructions\n\nNow you will have a chance to practice the task before moving on to the test phase. Remember to respond only to the central arrow ',
    payload: null,
  });

  for (let i = 0; i < PracticesCount; i++) {
    const practice: PipelineItem = {
      type: 'Flanker',
      id: itemId,
      payload: buildPractice(settings, i === 0, i === PracticesCount - 1),
      timer: null,
    };
    result.push(practice);

    if (i < PracticesCount - 1) {
      result.push({
        type: 'Message',
        timer: null,
        isAbleToMoveBack: false,
        isSkippable: false,
        question: '## Instructions\n\nPress the Next button to restart block.',
        payload: null,
      });
    }
  }

  result.push({
    type: 'Message',
    timer: null,
    isAbleToMoveBack: false,
    isSkippable: false,
    question: settings.test.instruction,
    payload: null,
  });

  for (let i = 0; i < TestsCount; i++) {
    const test: PipelineItem = {
      type: 'Flanker',
      id: itemId,
      payload: buildTest(settings, i === TestsCount - 1),
      timer: null,
    };
    result.push(test);

    if (i < TestsCount - 1) {
      result.push({
        type: 'Message',
        timer: null,
        isAbleToMoveBack: false,
        isSkippable: false,
        question:
          '## Instructions\n\nPress the Next button to start next block.',
        payload: null,
      });
    }
  }

  return result;
};

const buildPractice = (
  settings: FlankerSettings,
  isFirst: boolean,
  isLast: boolean,
): FlankerConfiguration => {
  const result: FlankerConfiguration = {
    blocks: [],
    stimulusTrials: [],
    buttons: [],
    blockType: 'practice',
    fixationDuration: settings.general.fixation?.duration ?? 0,
    fixationScreen: {
      value: settings.general.fixation?.alt ?? '',
      image: settings.general.fixation?.image ?? '',
    },
    sampleSize: 1,
    samplingMethod: settings.practice.randomizeOrder
      ? 'randomize-order'
      : 'fixed-order',
    showFeedback: settings.practice.showFeedback,
    showFixation: !!settings.general.fixation,
    showResults: settings.practice.showSummary,
    trialDuration: settings.practice.stimulusDuration,
    minimumAccuracy: settings.practice.threshold,
    nextButton: 'OK',
    isLastPractice: isLast,
    isFirstPractice: isFirst,
    isLastTest: false,
  };

  result.blocks = settings.practice.blocks.map<BlockConfiguration>(x => ({
    name: x.name,
    order: x.order,
  }));

  result.buttons = settings.general.buttons.map<ButtonConfiguration>(x => ({
    image: x.image,
    text: x.name,
    value: x.value,
  }));

  result.stimulusTrials =
    settings.general.stimulusTrials.map<StimulusConfiguration>(x => ({
      id: x.id,
      image: x.image,
      text: x.text ?? '',
      value: x.value,
      weight: x.weight,
    }));

  return result;
};

const buildTest = (
  settings: FlankerSettings,
  isLast: boolean,
): FlankerConfiguration => {
  const result: FlankerConfiguration = {
    blocks: [],
    stimulusTrials: [],
    buttons: [],
    blockType: 'test',
    fixationDuration: settings.general.fixation?.duration ?? 0,
    fixationScreen: {
      value: settings.general.fixation?.alt ?? '',
      image: settings.general.fixation?.image ?? '',
    },
    sampleSize: 1,
    samplingMethod: settings.test.randomizeOrder
      ? 'randomize-order'
      : 'fixed-order',
    showFeedback: settings.test.showFeedback,
    showFixation: !!settings.general.fixation,
    showResults: settings.test.showSummary,
    trialDuration: settings.test.stimulusDuration,
    nextButton: isLast ? 'Finish' : 'Continue',
    isLastPractice: false,
    isFirstPractice: false,
    isLastTest: isLast,
  };

  result.blocks = settings.test.blocks.map<BlockConfiguration>(x => ({
    name: x.name,
    order: x.order,
  }));

  result.buttons = settings.general.buttons.map<ButtonConfiguration>(x => ({
    image: x.image,
    text: x.name,
    value: x.value,
  }));

  result.stimulusTrials =
    settings.general.stimulusTrials.map<StimulusConfiguration>(x => ({
      id: x.id,
      image: x.image,
      text: x.text ?? '',
      value: x.value,
      weight: x.weight,
    }));

  return result;
};
*/
export {};
