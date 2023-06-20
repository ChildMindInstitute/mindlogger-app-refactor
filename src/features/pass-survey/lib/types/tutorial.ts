import { TestIndex, DeviceType } from '@entities/abTrail';

type AbTutorialPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};

type ABTutorial = {
  type: 'AbTrails';
} & AbTutorialPayload;

export type Tutorial = ABTutorial;
