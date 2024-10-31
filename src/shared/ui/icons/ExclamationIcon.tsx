import Svg, { Path, SvgProps } from 'react-native-svg';

export const ExclamationIcon = ({ color, ...props }: SvgProps) => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
    <Path
      fill={color}
      d="M9 1.5C4.875 1.5 1.5 4.875 1.5 9C1.5 13.125 4.875 16.5 9 16.5C13.125 16.5 16.5 13.125 16.5 9C16.5 4.875 13.125 1.5 9 1.5ZM9 12.75C8.55 12.75 8.25 12.45 8.25 12C8.25 11.55 8.55 11.25 9 11.25C9.45 11.25 9.75 11.55 9.75 12C9.75 12.45 9.45 12.75 9 12.75ZM9.75 9C9.75 9.45 9.45 9.75 9 9.75C8.55 9.75 8.25 9.45 8.25 9V6C8.25 5.55 8.55 5.25 9 5.25C9.45 5.25 9.75 5.55 9.75 6V9Z"
    />
  </Svg>
);
