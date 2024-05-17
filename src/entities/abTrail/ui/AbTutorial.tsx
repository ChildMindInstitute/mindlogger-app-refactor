import { FC, useMemo, useState } from 'react';

import { AbTutorialPayload } from '@app/abstract/lib';
import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbShapes from './AbShapes';
import { transformCoordinates } from '../lib/utils';

type Props = {
  tutorialPayload: AbTutorialPayload;
  tutorialStepIndex: number;
} & BoxProps;

const ShapesRectPadding = 15;
const ContentPadding = 5;

const AbTutorial: FC<Props> = props => {
  const { tutorialStepIndex, tutorialPayload } = props;

  const [width, setWidth] = useState<number | null>(null);

  const { shapesData, tutorialRecord } = useMemo(() => {
    if (!width) {
      return {};
    }
    const test = tutorialPayload.test;

    const transformed = transformCoordinates(test, width - ContentPadding * 2);

    const tutorials = tutorialPayload.tutorials;

    const textLine = tutorials[tutorialStepIndex];

    return { shapesData: transformed, tutorialRecord: textLine };
  }, [width, tutorialPayload, tutorialStepIndex]);

  const getOrderIndexByLabel = (): number | null => {
    if (!tutorialRecord || !shapesData) {
      return null;
    }
    return (
      shapesData.nodes.find(
        x => x.label === tutorialRecord.nodeLabel?.toString(),
      )?.orderIndex ?? null
    );
  };

  return (
    <Box
      flex={1}
      onLayout={x =>
        setWidth(x.nativeEvent.layout.width - ShapesRectPadding * 2)
      }
    >
      {!!tutorialRecord && (
        <Text alignSelf="center" h={70} mx={ShapesRectPadding} fontSize={15}>
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
                greenRoundOrder={getOrderIndexByLabel()}
              />
            )}
          </Box>
        </XStack>
      )}
    </Box>
  );
};

export default AbTutorial;
