import { TestIndex, DeviceType } from '@entities/abTrail';

export type TutorialType = 'AbTrails' | 'Gyroscope';

type AbTutorialPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};

type ABTutorial = {
  type: 'AbTrails';
} & AbTutorialPayload;

export type Tutorial = ABTutorial;
