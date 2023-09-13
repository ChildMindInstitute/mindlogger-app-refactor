import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { GestureResponderEvent } from 'react-native';

import { orientation } from 'react-native-sensors';
import Svg, { Circle } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

import { StabilityTrackerAnswerValue } from '@shared/api';
import { useForceUpdate, useSendEvent } from '@shared/lib';
import { YStack } from '@shared/ui';

import ControlBar from './ControlBar';
import PlayGround from './PlayGround';
import Score from './Score';
import styles, { colors } from './StabilityTrackerItem.styles';
import {
  TASK_LOOP_RATE,
  INITIAL_LAMBDA,
  BOUND_HIT_ANIMATION_DURATION,
  PLAYGROUND_WIDTH,
  CENTER,
  POINT_RADIUS,
  OUTER_CIRCLE_RADIUS,
  INNER_CIRCLE_RADIUS,
  BLOCK_HEIGHT,
  CENTER_COORDINATES,
  TARGET_POSITION,
  PANEL_RADIUS,
  MAX_RADIUS,
  SENSORS_DATA_MULTIPLIER,
} from '../lib';
import { useAnimation } from '../lib/hooks';
import {
  TargetInCircleStatus,
  Coordinate,
  StabilityTrackerResponse,
  Response,
  OrientationSubscription,
} from '../lib/types';
import {
  generateTargetTrajectory,
  computeDxDt,
  getNewLambda,
  getScoreChange,
  getDiskStatus,
  computeDistance,
  getBonusMultiplier,
  isInBounds,
} from '../lib/utils';

type Props = {
  config: {
    lambdaSlope: number;
    durationMinutes: number;
    trialsNumber: number;
    userInputType: 'gyroscope' | 'touch';
    phase: 'test' | 'practice';
  };
  onComplete: (response: StabilityTrackerResponse) => void;
  onMaxLambdaChange: (contextKey: string, contextValue: unknown) => void;
  maxLambda?: number;
};

const StabilityTrackerItemScreen = (props: Props) => {
  const toast = useToast();
  const reRender = useForceUpdate();
  const { sendLiveEvent } = useSendEvent();

  const {
    config: initialConfig,
    onComplete,
    onMaxLambdaChange,
    maxLambda = 0,
  } = props;

  const config = {
    lambdaSlope: initialConfig?.lambdaSlope || 20.0,
    durationMinutes: initialConfig?.durationMinutes || 1,
    trialsNumber: initialConfig?.trialsNumber || 2,
    phase: initialConfig?.phase ?? 'practice',
  };

  const targetPoints = generateTargetTrajectory(
    config.durationMinutes,
    TASK_LOOP_RATE,
    1,
    CENTER,
  );
  const IS_TRIAL = config.phase === 'practice';

  // we are using refs instead of state , because useAnimation hook is much faster, than react can (or needs) to be rerendered
  const [isRunning, setIsRunning] = useState(false);
  const [userInputType, setUserInputType] = useState<'touch' | 'gyroscope'>(
    initialConfig?.userInputType,
  );

  const score = useRef(0);
  const trialsNumber = useRef(0);
  const userPosition = useRef<Coordinate>(CENTER_COORDINATES);
  const circlePosition = useRef<Coordinate>(CENTER_COORDINATES);
  const boundWasHit = useRef(false);
  const lambdaSlope = useRef(config.lambdaSlope);
  const boundHitAnimationDuration = useRef(0);
  const showControlBar = useRef(true);
  const lambdaValue = useRef(INITIAL_LAMBDA);
  const startPosition = useRef(0);
  const responses = useRef<Response[]>([]);
  const orientationSubscription = useRef<OrientationSubscription>();
  const initialOrientation = useRef<number>();

  const lambdaLimit = IS_TRIAL ? 0 : 0.3 * maxLambda;

  const IS_TOUCH = useMemo(() => {
    return userInputType === 'touch';
  }, [userInputType]);

  const handleGyroscopeError = useCallback(
    (error: Error) => {
      toast.show(error.toString());
      setUserInputType('touch');
      updateUserPosition(CENTER, CENTER + 1);
    },
    [setUserInputType, toast],
  );

  useEffect(() => {
    if (IS_TOUCH) {
      return;
    }

    if (isRunning) {
      orientationSubscription.current = orientation.subscribe({
        next: ({ pitch }) => {
          if (!initialOrientation.current) {
            initialOrientation.current = pitch;
          } else {
            const newPositionY =
              CENTER +
              ((SENSORS_DATA_MULTIPLIER *
                (pitch - initialOrientation.current)) /
                MAX_RADIUS) *
                PANEL_RADIUS;

            updateUserPosition(CENTER, newPositionY);
          }
        },
        error: handleGyroscopeError,
      });
    } else {
      orientationSubscription?.current?.unsubscribe();
    }
    return () => {
      orientationSubscription?.current?.unsubscribe();
    };
  }, [handleGyroscopeError, isRunning, IS_TOUCH]);

  const updateUserPosition = (x: number, y: number) => {
    userPosition.current = [x, y];

    userPosition.current[1] = Math.max(0, userPosition.current[1]);
    userPosition.current[1] = Math.min(
      userPosition.current[1],
      PLAYGROUND_WIDTH - BLOCK_HEIGHT * 2 + OUTER_CIRCLE_RADIUS * 2,
    );
    userPosition.current[1] += BLOCK_HEIGHT - OUTER_CIRCLE_RADIUS;
  };

  const onUserStartedMoving = (event: GestureResponderEvent) => {
    if (IS_TOUCH) {
      startPosition.current = event.nativeEvent.locationY;
    }
  };

  const onUserStoppedMoving = (event: GestureResponderEvent) => {
    if (IS_TOUCH) {
      if (isRunning) {
        updateUserPosition(
          event.nativeEvent.locationX,
          CENTER + event.nativeEvent.locationY - startPosition.current,
        );
      } else {
        updateUserPosition(
          event.nativeEvent.locationX,
          event.nativeEvent.locationY,
        );
      }
      startPosition.current = 0;
    }
    setIsRunning(true);

    showControlBar.current = false;
  };

  const onUserMove = (event: GestureResponderEvent) => {
    if (IS_TOUCH && !showControlBar.current) {
      updateUserPosition(
        event.nativeEvent.locationX,
        CENTER + event.nativeEvent.locationY - startPosition.current,
      );
    }
  };

  const finishResponse = () => {
    let latestMaxLambda = 0;

    responses.current.forEach((response: Response) => {
      latestMaxLambda = Math.max(response.lambda, latestMaxLambda);
    });

    setIsRunning(false);

    boundWasHit.current = false;
    trialsNumber.current = 0;
    lambdaValue.current = INITIAL_LAMBDA;
    circlePosition.current = CENTER_COORDINATES;
    lambdaSlope.current = config?.lambdaSlope;
    boundWasHit.current = false;

    onMaxLambdaChange('maxLambda', latestMaxLambda);

    onComplete({
      maxLambda: latestMaxLambda,
      value: responses.current,
      phaseType: config.phase,
    });

    score.current = 0;
  };

  const restartTrial = () => {
    score.current = (score.current * 3) / 4;
    lambdaValue.current = lambdaValue.current / 2;
    circlePosition.current = CENTER_COORDINATES;

    trialsNumber.current += 1;

    if (!IS_TRIAL) {
      return;
    }

    lambdaSlope.current = (lambdaSlope.current * 95) / 100;

    if (trialsNumber.current >= config.trialsNumber) {
      finishResponse();
    }
  };

  const updateScore = (deltaTime: number) => {
    const distance = computeDistance(circlePosition.current, TARGET_POSITION);
    const bonusMultiplier = getBonusMultiplier(
      distance,
      INNER_CIRCLE_RADIUS,
      OUTER_CIRCLE_RADIUS,
    );
    const scoreChange = getScoreChange(bonusMultiplier, deltaTime);

    score.current = score.current + scoreChange;
  };

  const updateCirclePosition = (timeElapsed: number, deltaTime: number) => {
    const delta = computeDxDt(
      circlePosition.current,
      userPosition.current,
      lambdaValue.current,
      CENTER,
    );

    const newCirclePositionY =
      (delta[1] * deltaTime) / 1000 + circlePosition.current[1];

    circlePosition.current = [CENTER, newCirclePositionY];
  };

  const updateLambdaValue = (deltaTime: number) => {
    const inBounds = isInBounds(
      circlePosition.current[1],
      BLOCK_HEIGHT,
      PLAYGROUND_WIDTH - BLOCK_HEIGHT,
    );

    if (!inBounds) {
      boundHitAnimationDuration.current = 0;
      boundWasHit.current = true;
      showControlBar.current = true;
      userPosition.current = [CENTER, CENTER];
    } else {
      lambdaValue.current = getNewLambda(
        lambdaValue.current,
        deltaTime / 1000,
        lambdaSlope.current,
        lambdaLimit,
      );
    }
  };

  const animationCallback = (
    timeElapsed: number,
    tickNumber: number,
    deltaTime: number,
  ) => {
    let shouldSendLiveEvent = true;

    if (
      timeElapsed >= config.durationMinutes * 60 * 1000 ||
      tickNumber >= targetPoints.length
    ) {
      finishResponse();
      return;
    }

    if (boundWasHit.current) {
      boundHitAnimationDuration.current += deltaTime;

      if (
        boundHitAnimationDuration.current >
        BOUND_HIT_ANIMATION_DURATION * 1000
      ) {
        boundHitAnimationDuration.current = 0;
        boundWasHit.current = false;
        restartTrial();
      }
    } else if (!showControlBar.current) {
      updateCirclePosition(timeElapsed, deltaTime);
      updateLambdaValue(deltaTime);
      updateScore(deltaTime);
    } else {
      shouldSendLiveEvent = false;
    }

    reRender();
    saveResponses(shouldSendLiveEvent);
  };

  const saveResponses = (shouldSendLiveEvent: boolean) => {
    const response = {
      timestamp: new Date().getTime(),
      circlePosition: [circlePosition.current[1] / PANEL_RADIUS - 1],
      userPosition: [userPosition.current[1] / PANEL_RADIUS - 1],
      targetPosition: [0],
      lambda: lambdaValue.current,
      score: score.current,
      lambdaSlope: lambdaSlope.current,
    };

    if (shouldSendLiveEvent) {
      const liveEvent: StabilityTrackerAnswerValue = {
        timestamp: response.timestamp,
        stimPos: response.circlePosition,
        targetPos: response.targetPosition,
        userPos: response.userPosition,
        score: response.score,
        lambda: response.lambda,
        lambdaSlope: response.lambdaSlope,
      };

      sendLiveEvent(liveEvent);
    }

    responses.current.push(response);
  };

  useAnimation(animationCallback, isRunning);

  const targetInCircleStatus = getDiskStatus(
    circlePosition.current,
    TARGET_POSITION,
    INNER_CIRCLE_RADIUS,
    OUTER_CIRCLE_RADIUS,
  );

  return (
    <YStack shouldRasterizeIOS style={styles.container}>
      <Score score={score.current} />

      <YStack flex={1}>
        <Svg width={PLAYGROUND_WIDTH} height={PLAYGROUND_WIDTH}>
          <PlayGround
            boundWasHit={boundWasHit.current}
            boundHitAnimationDuration={boundHitAnimationDuration.current}
          />

          <>
            <Circle
              cx={circlePosition.current[0]}
              cy={circlePosition.current[1]}
              r={OUTER_CIRCLE_RADIUS}
              fill={
                targetInCircleStatus === TargetInCircleStatus.IN_OUTER_CIRCLE
                  ? colors.outerCircleActiveMargin
                  : colors.outerCircleInactiveMargin
              }
              stroke={colors.outerCircleBorder}
              strokeWidth={1}
              id="outerCircle"
            />

            <Circle
              cx={circlePosition.current[0]}
              cy={circlePosition.current[1]}
              r={INNER_CIRCLE_RADIUS}
              fill={
                targetInCircleStatus === TargetInCircleStatus.IN_INNER_CIRCLE
                  ? colors.innerCircleActiveMargin
                  : colors.innerCircleInactiveMargin
              }
              stroke={colors.innerCircleBorder}
              strokeWidth={1}
              id="innerCircle"
            />
          </>

          <Circle
            cx={TARGET_POSITION[0]}
            cy={TARGET_POSITION[1]}
            r={POINT_RADIUS}
            fill={colors.targetPointColor}
            id="targetPoint"
          />
        </Svg>

        <ControlBar
          isTestRunning={isRunning}
          showControlBar={showControlBar.current}
          onStartTouch={onUserStartedMoving}
          onMove={onUserMove}
          onReleaseTouch={onUserStoppedMoving}
        />
      </YStack>
    </YStack>
  );
};

export default StabilityTrackerItemScreen;
