import { FC, useMemo, useState } from 'react';

import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbShapes from './AbShapes';
import { DeviceType, TestIndex } from '../lib';
import { transformCoordinates } from '../lib/utils';
import {
  MobileTests,
  MobileTutorials,
  TabletTests,
  TabletTutorials,
} from '../model';

type Props = {
  testIndex: TestIndex;
  tutorialStepIndex: number;
  deviceType: DeviceType;
} & BoxProps;

const ShapesRectPadding = 15;
const ContentPadding = 5;

const AbTutorial: FC<Props> = props => {
  const { testIndex, tutorialStepIndex, deviceType } = props;

  const [width, setWidth] = useState<number | null>(null);

  const { shapesData, tutorialRecord } = useMemo(() => {
    if (!width) {
      return {};
    }
    const tests = deviceType === 'Phone' ? MobileTests : TabletTests;

    const transformed = transformCoordinates(
      tests[testIndex],
      width - ContentPadding * 2,
    );

    const tutorials =
      deviceType === 'Phone' ? MobileTutorials : TabletTutorials;

    const textLine = tutorials[testIndex][tutorialStepIndex];

    return { shapesData: transformed, tutorialRecord: textLine };
  }, [width, deviceType, testIndex, tutorialStepIndex]);

  return (
    <Box
      onLayout={x =>
        setWidth(x.nativeEvent.layout.width - ShapesRectPadding * 2)
      }
    >
      {!!tutorialRecord && (
        <Text alignSelf="center" mx={ShapesRectPadding} mb={24} fontSize={15}>
          {tutorialRecord.text}
        </Text>
      )}

      {width && (
        <XStack jc="center">
          <Box
            w={width}
            h={width}
            borderWidth={1}
            borderColor="$lightGrey2"
            p={ContentPadding}
          >
            {shapesData && (
              <AbShapes
                testData={shapesData}
                greenRoundOrder={tutorialRecord?.nodeLabel ?? null}
                deviceType={deviceType}
              />
            )}
          </Box>
        </XStack>
      )}
    </Box>
  );
};

export default AbTutorial;
