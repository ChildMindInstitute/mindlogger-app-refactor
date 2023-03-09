import { shuffle } from '@app/shared/lib';

import {
  BlockConfiguration,
  ButtonConfiguration,
  FlankerConfiguration,
  FlankerWebViewConfiguration,
  SamplingMethod,
  StringOrNull,
  TestChoice,
  TestScreen,
  TestTrial,
} from '../types';

type ConfigurationBuilder = {
  buildForWebView: (
    configuration: FlankerConfiguration,
  ) => FlankerWebViewConfiguration;

  buildForNativeIOS: (configuration: FlankerConfiguration) => void;

  parseToWebViewConfigString: (
    testConfiguration: FlankerWebViewConfiguration,
  ) => string;
};

const createConfigurationBuilder = (): ConfigurationBuilder => {
  const getImageForIOSNative = (image: StringOrNull, alt: string): string => {
    if (image) {
      return image;
    }
    return alt;
  };

  const getImageForWebView = (
    image: StringOrNull,
    alt: string,
    isButton: boolean = false,
  ): string => {
    if (image) {
      return `<img src="${image}" alt="${alt}">`;
    }
    if (isButton) {
      return `<span class="button-text">${alt}</span>`;
    }
    return alt;
  };

  const getScreens = (
    configuration: FlankerConfiguration,
    isWebView: boolean,
  ): Array<TestScreen> => {
    return configuration.stimulusTrials.map<TestScreen>(trial => ({
      id: trial.id,
      stimulus: {
        en: !isWebView
          ? getImageForIOSNative(trial.image, trial.text)
          : getImageForWebView(trial.image, trial.text),
      },
      correctChoice: trial.value === null ? -1 : trial.value,
      weight:
        trial.weight === null || trial.weight === undefined ? 1 : trial.weight,
    }));
  };

  const getTestTrials = (
    screens: Array<TestScreen>,
    blocks: Array<BlockConfiguration>,
    buttons: Array<ButtonConfiguration>,
    samplingMethod: SamplingMethod,
    isWebView: boolean,
  ): Array<TestTrial> => {
    const trials: TestTrial[] = [];

    const choices: TestChoice[] = buttons.map(button => ({
      value: button.value,
      name: {
        en: !isWebView
          ? getImageForIOSNative(button.image, button.text)
          : getImageForWebView(button.image, button.text, true),
      },
    }));

    for (const block of blocks) {
      const order =
        samplingMethod === 'randomize-order'
          ? shuffle([...block.order])
          : block.order;

      for (const item of order) {
        const screen = screens.find(s => s.id === item);
        if (screen) {
          trials.push({
            ...screen,
            choices: choices,
          });
        }
      }
    }

    return trials;
  };

  const parseToWebViewString = (
    testConfiguration: FlankerWebViewConfiguration,
  ): string => {
    const injectConfig = `
    try {
      const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
      console = {
        log: (log) => consoleLog('log', log),
        debug: (log) => consoleLog('debug', log),
        info: (log) => consoleLog('info', log),
        warn: (log) => consoleLog('warn', log),
        error: (log) => consoleLog('error', log),
      };
    } catch {}

    window.CONFIG = ${JSON.stringify(testConfiguration)};
    start();
  `;
    return injectConfig;
  };

  const buildForNativeIOS = () => {};

  const buildForWebView = (configuration: FlankerConfiguration) => {
    const fixation: string = getImageForWebView(
      configuration.fixationScreen.image,
      configuration.fixationScreen.value,
    );

    const screens: TestScreen[] = getScreens(configuration, true);

    const testTrials: TestTrial[] = getTestTrials(
      screens,
      configuration.blocks,
      configuration.buttons,
      configuration.samplingMethod,
      true,
    );

    const continueText = [
      `Press the button below to ${
        configuration.isLastTest ? 'finish' : 'continue'
      }.`,
    ];
    const restartText = [
      'Remember to respond only to the central arrow.',
      'Press the button below to end current block and restart.',
    ];

    const result: FlankerWebViewConfiguration = {
      trials: testTrials,
      fixationDuration: configuration.fixationDuration,
      fixation,
      showFixation: configuration.showFixation !== false && fixation.length > 0,
      showFeedback: configuration.showFeedback !== false,
      showResults: configuration.showResults !== false,
      trialDuration: configuration.trialDuration || 1500,
      samplingMethod: 'fixed-order',
      samplingSize: configuration.sampleSize,
      buttonLabel:
        (!configuration.isLastTest && configuration.nextButton) || 'Finish',
      minimumAccuracy: configuration.minimumAccuracy || 0,
      continueText,
      restartText: configuration.isLastPractice ? continueText : restartText,
      buttons: configuration.buttons.map(x => ({
        image: x.image,
        name: { en: x.text },
        value: x.value,
      })),
    };

    return result;
  };

  return {
    buildForWebView,
    buildForNativeIOS,
    parseToWebViewConfigString: parseToWebViewString,
  };
};

export default createConfigurationBuilder();
