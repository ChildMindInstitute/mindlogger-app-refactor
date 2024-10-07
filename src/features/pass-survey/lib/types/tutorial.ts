import { AbTutorialPayload } from '@app/abstract/lib/types/abTrails';

export type TutorialType = 'AbTrails' | 'Gyroscope';

type ABTutorial = {
  type: 'AbTutorial';
} & AbTutorialPayload;

export type Tutorial = ABTutorial;
