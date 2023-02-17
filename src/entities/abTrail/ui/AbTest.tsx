import { FC, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbCanvas from './AbCanvas';
import {
  DeviceTests,
  DeviceType,
  MessageType,
  MessageTypeStrings,
  TestIndexes,
  TestScreenPayload,
} from '../lib';
import { MobileTests, TabletTests } from '../model';

type Props = {
  testIndex: TestIndexes | null;
  deviceType: DeviceType;
} & BoxProps;

const ShapesRectPadding = 15;

const MessageTimeout = 2000;

const AbTest: FC<Props> = props => {
  const { t } = useTranslation();

  const { testIndex, deviceType } = props;

  const [width, setWidth] = useState<number | null>(null);

  const [message, setMessage] = useState<MessageType | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setStartTime(new Date().getTime());
  }, []);

  useEffect(() => {
    if (message === MessageType.Completed) {
      return;
    }
    const id = setTimeout(() => {
      setMessage(null);
    }, MessageTimeout);

    return () => {
      clearTimeout(id);
    };
  }, [message]);

  const getTests = (): DeviceTests => {
    return deviceType === 'Phone' ? MobileTests : TabletTests;
  };

  const getTestData = (): TestScreenPayload | null => {
    if (testIndex !== null) {
      return getTests()[testIndex];
    } else {
      return null;
    }
  };

  const isMessageError = (): boolean => {
    return (
      message === MessageType.IncorrectLine ||
      message === MessageType.IncorrectStartPoint
    );
  };

  const getDisplayMessage = () => {
    const tests = getTests();

    const isLastTest = Object.keys(tests).length === Number(testIndex) + 1;

    if (message === MessageType.Completed && isLastTest) {
      return t('cognitive:finished_complete');
    }
    if (message === MessageType.Completed && !isLastTest) {
      return t('cognitive:finished_continue');
    }
    if (message) {
      return t(MessageTypeStrings[message]);
    }
    return ' ';
  };

  const testData = getTestData();

  return (
    <Box
      onLayout={x =>
        setWidth(x.nativeEvent.layout.width - ShapesRectPadding * 2)
      }
      {...props}
    >
      <Text
        alignSelf="center"
        mx={ShapesRectPadding}
        mb={38}
        fontSize={15}
        color={isMessageError() ? colors.red : colors.black}
      >
        {getDisplayMessage()}
      </Text>

      {width && testData && (
        <XStack jc="center">
          <AbCanvas
            testData={testData}
            deviceType={deviceType}
            width={width}
            height={width}
            onLogResult={logData =>
              console.log('logData: ', { ...logData, width, startTime })
            }
            onMessage={msg => setMessage(msg)}
            onComplete={() => setCompleted(true)}
            readonly={completed}
          />
        </XStack>
      )}
    </Box>
  );
};

export default AbTest;
