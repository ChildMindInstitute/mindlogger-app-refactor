import { TestIndex, DeviceType } from '@entities/abTrail';
import { TestIndex as StabilityTrackerTestIndex } from '@entities/stabilityTracker';

export type TutorialType = 'AbTrails' | 'StabilityTracker';

type AbTutorialPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};

type ABTutorial = {
  type: 'AbTrails';
} & AbTutorialPayload;

type StabilityTrackerTutorialPayload = {
  testIndex: StabilityTrackerTestIndex;
};

type StabilityTrackerTutorial = {
  type: 'StabilityTracker';
} & StabilityTrackerTutorialPayload;

export type Tutorial = ABTutorial | StabilityTrackerTutorial;
