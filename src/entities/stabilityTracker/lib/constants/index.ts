import { Dimensions } from 'react-native';

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

export const center = PLAYGROUND_WIDTH / 2;
export const panelRadius = center;
export const pointRadius = PLAYGROUND_WIDTH / 152;
export const OUTER_CIRCLE_RADIUS = PLAYGROUND_WIDTH / 19;
export const INNER_CIRCLE_RADIUS = PLAYGROUND_WIDTH / 38;
export const blockHeight = PLAYGROUND_WIDTH / 6 / 2;
export const blockWidth = PLAYGROUND_WIDTH / 3;
export const CENTER_COORDINATES: Coordinate = [center, center];
export const TARGET_POSITION: Coordinate = CENTER_COORDINATES;
