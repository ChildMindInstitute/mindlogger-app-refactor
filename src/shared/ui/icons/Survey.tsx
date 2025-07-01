import React from 'react';
import { AccessibilityProps } from 'react-native';

import { Svg, Path, G, Rect, Circle } from 'react-native-svg';

type Props = {
  color: string;
  size?: number;
  tokenLogger?: boolean;
  isSelected: boolean;
} & AccessibilityProps;

export const SurveyIcon = ({
  color,
  size = 45,
  tokenLogger = false,
  accessibilityLabel,
}: Props) => {
  if (tokenLogger) {
    return (
      <Svg
        accessibilityLabel={accessibilityLabel}
        width={size}
        height={size}
        viewBox="0 0 52 37"
        fill="none"
      >
        <G transform="translate(-31 -847)">
          <Rect
            width="40"
            height="7"
            rx="3.5"
            transform="translate(43 862)"
            fill={color}
          />

          <Rect
            width="40"
            height="7"
            rx="3.5"
            transform="translate(43 847)"
            fill={color}
          />

          <Rect
            width="40"
            height="7"
            rx="3.5"
            transform="translate(43 877)"
            fill={color}
          />

          <Circle
            cx="3.5"
            cy="3.5"
            r="3.5"
            transform="translate(31 847)"
            fill={color}
          />

          <Circle
            cx="3.5"
            cy="3.5"
            r="3.5"
            transform="translate(31 862)"
            fill={color}
          />

          <Circle
            cx="3.5"
            cy="3.5"
            r="3.5"
            transform="translate(31 877)"
            fill={color}
          />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
      <Path
        d="M12.677 4.077c.121.05.232.125.325.219a1 1 0 010 1.47l-5.348 5.526a1.001 1.001 0 01-1.42 0L2.894 8a1.022 1.022 0 011.42-1.47l2.63 2.592 4.638-4.826a1 1 0 011.095-.22zM12.677 13.077a1 1 0 01.325.219 1 1 0 010 1.47l-5.348 5.526a1.001 1.001 0 01-1.42 0L2.894 17a1.021 1.021 0 111.42-1.47l2.63 2.592 4.638-4.826a1.002 1.002 0 011.095-.22zM14.582 8a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zM15.582 15a1 1 0 100 2h6a1 1 0 100-2h-6z"
        fill={color}
      />
    </Svg>
  );
};
