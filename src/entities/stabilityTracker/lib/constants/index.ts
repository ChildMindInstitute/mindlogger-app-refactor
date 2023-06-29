import { Dimensions } from 'react-native';

import { IS_IOS } from '@shared/lib';

import { type Coordinate } from '../types';

const { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT } =
  Dimensions.get('window');

export const PLAYGROUND_WIDTH = Math.min(
  VIEWPORT_WIDTH - 10,
  VIEWPORT_HEIGHT - 110,
);

export const TASK_LOOP_RATE = 0.0167; // 60hz
export const INITIAL_LAMBDA = 0.075;
export const BOUND_HIT_ANIMATION_DURATION = 0.2;
export const MAX_RADIUS = 0.26167;

export const CENTER = PLAYGROUND_WIDTH / 2;
export const PANEL_RADIUS = CENTER;
export const POINT_RADIUS = PLAYGROUND_WIDTH / 152;
export const OUTER_CIRCLE_RADIUS = PLAYGROUND_WIDTH / 19;
export const INNER_CIRCLE_RADIUS = PLAYGROUND_WIDTH / 38;
export const BLOCK_HEIGHT = PLAYGROUND_WIDTH / 6 / 2;
export const BLOCK_WIDTH = PLAYGROUND_WIDTH / 3;
export const CENTER_COORDINATES: Coordinate = [CENTER, CENTER];
export const TARGET_POSITION: Coordinate = CENTER_COORDINATES;

export const SENSORS_DATA_MULTIPLIER = IS_IOS ? 1 : -1;
