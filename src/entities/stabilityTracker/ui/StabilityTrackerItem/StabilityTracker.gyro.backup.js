import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { GestureResponderEvent } from 'react-native';

import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import Svg, { Circle } from 'react-native-svg';

import {
  TASK_LOOP_RATE,
  INITIAL_LAMBDA,
  BOUND_HIT_ANIMATION_DURATION,
  MAX_RADIUS,
  PLAYGROUND_WIDTH,
  center,
  PANEL_RADIUS,
  POINT_RADIUS,
  OUTER_CIRCLE_RADIUS,
  INNER_CIRCLE_RADIUS,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  CENTER_COORDINATES,
  TARGET_POSITION,
} from '@entities/stabilityTracker/lib/constants';
import { IS_IOS } from '@shared/lib';
import { YStack } from '@shared/ui';

import ControlBar from './ControlBar';
import PlayGround from './PlayGround';
import Score from './Score';
import styles, { colors } from './StabilityTrackerItem.styles';
import { useAnimationFrame } from '../../lib/hooks';
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
    lambdaSlope: number,
    durationInMinutes: number,
    numberOfTrials: number,
    userInputType: 'gyroscope' | 'touch',
    phase: 'focus-phase' | 'trial',
  },
  onChange: () => void,
  appletId: string,
  maxLambda: number,
  onComplete: (response: StabilityTrackerResponse) => void,
};

setUpdateIntervalForType(SensorTypes.gyroscope, TASK_LOOP_RATE * 500);

const StabilityTrackerItemScreen = (props: Props) => {
  const {
    onChange,
    config: initialConfig,
    maxLambda, // comes from redux in legacy
    // appletId,
    onComplete,
  } = props;

  const config = {
    lambdaSlope: initialConfig?.lambdaSlope || 190.0,
    durationInMinutes: initialConfig?.durationInMinutes || 1, //5,
    numberOfTrials: initialConfig?.numberOfTrials || 2,
    phase: initialConfig?.phase ?? 'trial',
  };

  const targetPoints = generateTargetTrajectory(
    config.durationInMinutes,
    TASK_LOOP_RATE,
    1,
    center,
  );

  const [isMoving, setMoving] = useState(false);
  // const [tickNumber, setTickNumber] = useState(0);
  const [userInputType, setUserInputType] = useState(
    initialConfig?.userInputType ?? 'touch',
  );
  const [score, setScore] = useState < number > 0;
  const numberOfTrials = useRef(0);
  const userPosition = useRef < Coordinate > CENTER_COORDINATES;
  const circlePosition = useRef < Coordinate > CENTER_COORDINATES;
  const [tick, setTickNumber] = useState < number > 0;
  const boundWasHit = useRef(false);
  const lambdaSlope = useRef(config.lambdaSlope);
  const boundHitAnimationDuration = useRef(0);
  const responses = useRef([]);
  const showControlBar = useRef(true);
  const gyroListener = useRef();
  const baseOri = useRef();
  const lambdaValue = useRef(INITIAL_LAMBDA);
  const startPosition = useRef(0);
  const IS_TOUCH = useMemo(() => userInputType === 'touch', [userInputType]);
  const IS_TRIAL = config.phase === 'trial';

  const lambdaLimit = IS_TRIAL ? 0 : maxLambda * 0.3;

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
    onComplete(['atata']);

    setMoving(false);
    return;
    alert('finishing response');
    boundWasHit.current = false;
    setNumberOfTrials(0);
    setScore(0);
    lambdaValue.current = INITIAL_LAMBDA;
    circlePosition.current = CENTER_COORDINATES;
    lambdaSlope.current = config?.lambdaSlope;
    return;
    return;

    boundWasHit.current = false;

    let maxLambda = 0;
    for (const response of responses.current) {
      if (maxLambda < response.lambda) {
        maxLambda = response.lambda;
      }
    }

    onChange(
      {
        maxLambda,
        value: [...responses.current],
        phaseType: config.phase,
      },
      true,
    );

    // reset values
  };

  const restartTrial = () => {
    setScore((score * 3) / 4);
    lambdaValue.current = lambdaValue.current / 2;
    circlePosition.current = CENTER_COORDINATES;

    numberOfTrials.current += 1;

    if (IS_TRIAL) {
      lambdaSlope.current = (lambdaSlope.current * 95) / 100;
    }
    console.log(numberOfTrials.current, 'numbaaa', IS_TRIAL, 'iz');
    if (numberOfTrials.current >= config.numberOfTrials && IS_TRIAL) {
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
      BLOCK_HEIGHT,
      PLAYGROUND_WIDTH - BLOCK_HEIGHT,
    );

    if (!inBounds) {
      boundHitAnimationDuration.current = 0;
      boundWasHit.current = true;
      showControlBar.current = true;
      userPosition.current = [center, center];
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

  useAnimationFrame(animationCallback, isMoving);

  useEffect(() => {
    if (IS_TOUCH) {
      return gyroListener?.current?.unsubscribe;
    }
    let rolla = 0;
    if (isMoving) {
      gyroListener.current = gyroscope.subscribe(
        ({ x: roll }) => {
          if (!baseOri.current) {
            rolla = roll;
            baseOri.current = roll;
          } else {
            const y =
              center +
              (((IS_IOS ? 1 : -1) * (roll - baseOri.current)) / MAX_RADIUS) *
                PANEL_RADIUS;

            userPosition.current = [center, y];
            rolla = roll;
          }
        },
        e => {
          alert(e.toString());
          console.warn(e, 'Error initiating gyroscope');
          setUserInputType('touch');
        },
      );
    } else {
      gyroListener?.current?.unsubscribe();
    }

    return () => {
      gyroListener?.current?.unsubscribe();
    };
  }, [isMoving]);

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
            BLOCK_WIDTH={BLOCK_WIDTH}
            availableWidth={PLAYGROUND_WIDTH}
            BLOCK_HEIGHT={BLOCK_HEIGHT}
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
            r={POINT_RADIUS}
            fill={colors.targetPointColor}
            id="targetPoint"
          />
        </Svg>

        <ControlBar
          availableWidth={PLAYGROUND_WIDTH}
          BLOCK_HEIGHT={BLOCK_HEIGHT}
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

export default StabilityTrackerScreen;
