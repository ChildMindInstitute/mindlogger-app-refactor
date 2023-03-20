import { FC, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbCanvas from './AbCanvas';
import {
  AbTestResponse,
  DeviceTests,
  DeviceType,
  LogLine,
  MessageType,
  MessageTypeStrings,
  TestIndex,
  TestScreenPayload,
} from '../lib';
import { MobileTests, TabletTests } from '../model';

type Props = {
  testIndex: TestIndex | null;
  deviceType: DeviceType;
  onResponse?: (response: AbTestResponse) => void;
  onComplete: (logLines: LogLine[]) => void;
} & BoxProps;

const ShapesRectPadding = 15;

const MessageTimeout = 2000;

const AbTest: FC<Props> = props => {
  const { t } = useTranslation();

  const { testIndex, deviceType, onResponse, onComplete } = props;

  const [width, setWidth] = useState<number | null>(null);

  const [message, setMessage] = useState<MessageType | null>(null);

  const startTime = useMemo<number>(() => new Date().getTime(), []);

  const [completed, setCompleted] = useState(false);

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

  const complete = (logLines: LogLine[]) => {
    setCompleted(true);
    onComplete(logLines);
  };

  const testData = getTestData();

  return (
    <Box
      flex={1}
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
              onResponse?.({ ...logData, width, startTime })
            }
            onMessage={msg => setMessage(msg)}
            onComplete={complete}
            readonly={completed}
          />
        </XStack>
      )}
    </Box>
  );
};

export default AbTest;
