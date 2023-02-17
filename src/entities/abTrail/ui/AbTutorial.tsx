import { FC, useEffect, useState } from 'react';

import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbShapes from './AbShapes';
import {
  DeviceType,
  TestIndexes,
  TestScreenPayload,
  TutorialRecord,
} from '../lib';
import { transformCoordinates } from '../lib/utils';
import {
  MobileTests,
  MobileTutorials,
  TabletTests,
  TabletTutorials,
} from '../model';

type Props = {
  testIndex: TestIndexes | null;
  tutorialStepIndex: number | null;
  deviceType: DeviceType;
} & BoxProps;

const ShapesRectPadding = 15;
const ContentPadding = 5;

const AbTutorial: FC<Props> = props => {
  const { testIndex, tutorialStepIndex, deviceType } = props;

  const [testData, setTestData] = useState<TestScreenPayload | null>(null);

  const [shapesData, setShapesData] = useState<TestScreenPayload | null>(null);

  const [tutorialRecord, setTutorialRecord] = useState<TutorialRecord | null>(
    null,
  );

  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (testIndex === null || tutorialStepIndex === null) {
      return;
    }
    const tests = deviceType === 'Phone' ? MobileTests : TabletTests;
    const tutorials =
      deviceType === 'Phone' ? MobileTutorials : TabletTutorials;

    setTestData(tests[testIndex]);
    setTutorialRecord(tutorials[testIndex][tutorialStepIndex]);
  }, [testIndex, tutorialStepIndex, deviceType]);

  useEffect(() => {
    if (!testData || !width) {
      return;
    }
    const transformed = transformCoordinates(
      testData,
      width - ContentPadding * 2,
    );
    setShapesData(transformed);
  }, [testData, width]);

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
