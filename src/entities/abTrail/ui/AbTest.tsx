import { FC, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { AbTestPayload } from '@app/abstract/lib';
import { colors } from '@app/shared/lib';
import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbCanvas from './AbCanvas';
import {
  AbTestResponse,
  LogLine,
  MessageType,
  MessageTypeStrings,
} from '../lib';

type Props = {
  testData: AbTestPayload;
  onResponse?: (response: AbTestResponse) => void;
  onComplete: (logLines: LogLine[]) => void;
} & BoxProps;

const ShapesRectPadding = 15;

const MessageTimeout = 2000;

const AbTest: FC<Props> = props => {
  const { t } = useTranslation();

  const { testData, onResponse, onComplete } = props;

  const [width, setWidth] = useState<number | null>(null);

  const [message, setMessage] = useState<MessageType | null>(null);

  const startTime = useMemo<number>(() => new Date().getTime(), []);

  const [completed, setCompleted] = useState(false);

  const isLastTest = testData.isLast;

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

  const isMessageError = (): boolean => {
    return (
      message === MessageType.IncorrectLine ||
      message === MessageType.IncorrectStartPoint
    );
  };

  const getDisplayMessage = () => {
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

  return (
    <Box
      flex={1}
      justifyContent="center"
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
