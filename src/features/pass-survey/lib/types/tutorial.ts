import { TestIndex, DeviceType } from '@entities/abTrail';
import { TestIndex as GyroscopeTestIndex } from '@entities/gyroscope';

export type TutorialType = 'AbTrails' | 'Gyroscope';

type AbTutorialPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};

type ABTutorial = {
  type: 'AbTrails';
} & AbTutorialPayload;

type GyroscopeTutorialPayload = {
  testIndex: GyroscopeTestIndex;
};

type GyroscopeTutorial = {
  type: 'Gyroscope';
} & GyroscopeTutorialPayload;

export type Tutorial = ABTutorial | GyroscopeTutorial;
