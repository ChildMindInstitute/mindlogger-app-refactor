import React, { useState, useRef, useMemo } from 'react';
import { GestureResponderEvent } from 'react-native';

import Svg, { Circle } from 'react-native-svg';

import {
  TASK_LOOP_RATE,
  INITIAL_LAMBDA,
  BOUND_HIT_ANIMATION_DURATION,
  PLAYGROUND_WIDTH,
  center,
  pointRadius,
  OUTER_CIRCLE_RADIUS,
  INNER_CIRCLE_RADIUS,
  blockWidth,
  blockHeight,
  CENTER_COORDINATES,
  TARGET_POSITION,
} from '@entities/stabilityTracker/lib/constants';
import { YStack } from '@shared/ui';

import ControlBar from './ControlBar';
import PlayGround from './PlayGround';
import Score from './Score';
import styles, { colors } from './StabilityTrackerItem.styles';
import { useAnimation } from '../../lib/hooks';
import {
  TargetInCircleStatus,
  Coordinate,
  StabilityTrackerResponse,
} from '../../lib/types';
import {
  generateTargetTrajectory,
  computeDxDt,
  getNewLambda,
  getScoreChange,
  getDiskStatus,
  computeDistance,
  getBonusMultiplier,
  isInBounds,
} from '../../lib/utils';

type Props = {
  config: {
    lambdaSlope: number;
    durationInMinutes: number;
    numberOfTrials: number;
    userInputType: 'gyroscope' | 'touch';
    phase: 'focus-phase' | 'trial';
  };
  onChange: () => void;
  appletId: string;
  maxLambda: number;
  onComplete: (response: StabilityTrackerResponse) => void;
};

const StabilityTrackerItemScreen = (props: Props) => {
  const {
    config: initialConfig,
    maxLambda = 0.3, // comes from redux in legacy
    // appletId,
    onComplete,
  } = props;

  const config = {
    lambdaSlope: initialConfig?.lambdaSlope || 20.0,
    durationInMinutes: initialConfig?.durationInMinutes || 1,
    numberOfTrials: initialConfig?.numberOfTrials || 2,
    phase: initialConfig?.phase ?? 'trial',
  };

  const targetPoints = generateTargetTrajectory(
    config.durationInMinutes,
    TASK_LOOP_RATE,
    1,
    center,
  );

  const IS_TOUCH = useMemo(
    () => initialConfig?.userInputType === 'touch',
    [initialConfig?.userInputType],
  );
  const IS_TRIAL = config.phase === 'trial';

  // we are using refs instead of state , because useAnimation hook is much faster, than react can (or needs) to be rerendered

  const [isMoving, setMoving] = useState(false);
  const [score, setScore] = useState<number>(0);
  const numberOfTrials = useRef(0);
  const userPosition = useRef<Coordinate>(CENTER_COORDINATES);
  const circlePosition = useRef<Coordinate>(CENTER_COORDINATES);
  // following useState is needed to force react rerender
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tick, setTickNumber] = useState<number>(0);
  const boundWasHit = useRef(false);
  const lambdaSlope = useRef(config.lambdaSlope);
  const boundHitAnimationDuration = useRef(0);
  const showControlBar = useRef(true);
  const lambdaValue = useRef(INITIAL_LAMBDA);
  const startPosition = useRef(0);

  const lambdaLimit = IS_TRIAL ? 0 : maxLambda * 0.3;

  const updateUserPosition = (x: number, y: number) => {
    userPosition.current = [x, y];

    userPosition.current[1] = Math.max(0, userPosition.current[1]);
    userPosition.current[1] = Math.min(
      userPosition.current[1],
      PLAYGROUND_WIDTH - blockHeight * 2 + OUTER_CIRCLE_RADIUS * 2,
    );
    userPosition.current[1] += blockHeight - OUTER_CIRCLE_RADIUS;
  };

  const onUserStartedMoving = (event: GestureResponderEvent) => {
    if (IS_TOUCH) {
      startPosition.current = event.nativeEvent.locationY;
    }
  };

  const onUserStoppedMoving = (event: GestureResponderEvent) => {
    if (IS_TOUCH) {
      if (isMoving) {
        updateUserPosition(
          event.nativeEvent.locationX,
          center + event.nativeEvent.locationY - startPosition.current,
        );
      } else {
        updateUserPosition(
          event.nativeEvent.locationX,
          event.nativeEvent.locationY,
        );
      }
      startPosition.current = 0;
    }
    setMoving(true);

    showControlBar.current = false;
  };

  const onUserMove = (event: GestureResponderEvent) => {
    if (IS_TOUCH && !showControlBar.current) {
      updateUserPosition(
        event.nativeEvent.locationX,
        center + event.nativeEvent.locationY - startPosition.current,
      );
    }
  };

  const finishResponse = () => {
    setMoving(false);
    boundWasHit.current = false;
    numberOfTrials.current = 0;
    lambdaValue.current = INITIAL_LAMBDA;
    circlePosition.current = CENTER_COORDINATES;
    lambdaSlope.current = config?.lambdaSlope;
    boundWasHit.current = false;
    onComplete({
      score,
    });
    setScore(0);
  };

  const restartTrial = () => {
    setScore(prevScore => (prevScore * 3) / 4);
    lambdaValue.current = lambdaValue.current / 2;
    circlePosition.current = CENTER_COORDINATES;

    numberOfTrials.current += 1;

    if (!IS_TRIAL) {
      return;
    }

    lambdaSlope.current = (lambdaSlope.current * 95) / 100;

    if (numberOfTrials.current >= config.numberOfTrials) {
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
    setScore(prevScore => prevScore + scoreChange);
  };

  const updateCirclePosition = (timeElapsed: number, deltaTime: number) => {
    const delta = computeDxDt(
      circlePosition.current,
      userPosition.current,
      lambdaValue.current,
      center,
    );
    const newCirclePositionY =
      (delta[1] * deltaTime) / 1000 + circlePosition.current[1];

    circlePosition.current = [center, newCirclePositionY];
  };

  const updateLambdaValue = (deltaTime: number) => {
    const inBounds = isInBounds(
      circlePosition.current[1],
      blockHeight,
      PLAYGROUND_WIDTH - blockHeight,
    );

    if (!inBounds) {
      boundHitAnimationDuration.current = 0;
      boundWasHit.current = true;
      showControlBar.current = true;
      userPosition.current = [center, center];
    } else {
      if (!IS_TRIAL) {
        return;
      }
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
    if (
      timeElapsed >= config.durationInMinutes * 60 * 1000 ||
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
    }
    setTickNumber(tickNumber);
  };

  useAnimation(animationCallback, isMoving);

  const targetInCircleStatus = getDiskStatus(
    circlePosition.current,
    TARGET_POSITION,
    INNER_CIRCLE_RADIUS,
    OUTER_CIRCLE_RADIUS,
  );

  return (
    <YStack style={styles.container}>
      <Score score={score} />

      <YStack>
        <Svg width={PLAYGROUND_WIDTH} height={PLAYGROUND_WIDTH}>
          <PlayGround
            blockWidth={blockWidth}
            availableWidth={PLAYGROUND_WIDTH}
            blockHeight={blockHeight}
            outerCircleRadius={OUTER_CIRCLE_RADIUS}
            center={center}
            boundWasHit={boundWasHit.current}
            boundHitAnimationDurationFromConfig={BOUND_HIT_ANIMATION_DURATION}
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
            r={pointRadius}
            fill={colors.targetPointColor}
            id="targetPoint"
          />
        </Svg>

        <ControlBar
          availableWidth={PLAYGROUND_WIDTH}
          blockHeight={blockHeight}
          outerCircleRadius={OUTER_CIRCLE_RADIUS}
          isMoving={isMoving}
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
