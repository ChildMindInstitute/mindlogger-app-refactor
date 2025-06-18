import { FC } from 'react';

import Entypo from '@react-native-vector-icons/entypo';
import Feather from '@react-native-vector-icons/feather';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Foundation from '@react-native-vector-icons/foundation';
import Material from '@react-native-vector-icons/material-design-icons';

type IconProps = {
  color: string;
  size: number;
};

type AccessibilityProps = {
  accessibilityLabel?: string | undefined;
};

export const ChevronLeftIcon: FC<IconProps> = props => (
  <FontAwesome6 name="angle-left" iconStyle="solid" {...props} />
);

export const CloseIcon: FC<IconProps> = props => (
  <FontAwesome6 name="xmark" iconStyle="solid" {...props} />
);

export const KeyIcon: FC<IconProps> = props => (
  <Foundation name="key" {...props} />
);

export const UserIcon: FC<IconProps> = props => (
  <FontAwesome6 name="circle-user" iconStyle="solid" {...props} />
);

export const UserProfileIcon: FC<IconProps> = props => (
  <FontAwesome6 name="user" iconStyle="solid" {...props} />
);

export const HomeIcon: FC<IconProps> = props => (
  <Entypo name="home" {...props} />
);

export const ChevronRightIcon: FC<IconProps> = props => (
  <FontAwesome6 name="angle-right" iconStyle="solid" {...props} />
);

export const QuestionTooltipIcon: FC<IconProps> = props => (
  <FontAwesome6 name="circle-question" iconStyle="solid" {...props} />
);

export const LeftArrowIcon: FC<IconProps> = props => (
  <FontAwesome6 name="arrow-left" iconStyle="solid" {...props} />
);

export const RightArrowIcon: FC<IconProps> = props => (
  <FontAwesome6 name="arrow-right" iconStyle="solid" {...props} />
);

export const RestartIcon: FC<IconProps> = props => (
  <FontAwesome6 name="arrows-rotate" iconStyle="solid" {...props} />
);

export const PlayIcon: FC<IconProps & AccessibilityProps> = props => (
  <Entypo name="controller-play" {...props} />
);

export const PauseIcon: FC<IconProps & AccessibilityProps> = props => (
  <Foundation name="pause" {...props} />
);

export const StopIcon: FC<IconProps> = props => (
  <FontAwesome6 name="stop" iconStyle="solid" {...props} />
);

export const SpeakerIcon: FC<IconProps> = props => (
  <FontAwesome6 name="volume-high" iconStyle="solid" {...props} />
);

export const CheckIcon: FC<IconProps> = props => (
  <FontAwesome6 name="check" iconStyle="solid" {...props} />
);

export const BedIcon: FC<IconProps> = props => (
  <FontAwesome6 name="bed" iconStyle="solid" {...props} />
);

export const ClockIcon: FC<IconProps> = props => (
  <FontAwesome6 name="clock" {...props} />
);

export const GeolocationIcon: FC<IconProps> = props => (
  <FontAwesome6 name="location-dot" iconStyle="solid" {...props} />
);

export const PhotoIcon: FC<IconProps> = props => (
  <Entypo name="camera" {...props} />
);

export const VideoIcon: FC<IconProps> = props => (
  <Entypo name="video-camera" {...props} />
);

export const MicrophoneIcon: FC<IconProps> = props => (
  <FontAwesome6 name="microphone" iconStyle="solid" {...props} />
);

export const ChevronDownIcon: FC<IconProps> = props => (
  <FontAwesome6 name="angle-down" iconStyle="solid" {...props} />
);

export const EditIcon: FC<IconProps> = props => (
  <FontAwesome6 name="pencil" iconStyle="solid" {...props} />
);

export const EyeIcon: FC<IconProps> = props => (
  <FontAwesome6 name="eye" {...props} />
);

export const EyeSlashIcon: FC<IconProps> = props => (
  <FontAwesome6 name="eye-slash" {...props} />
);

export const FeatherCrossIcon: FC<IconProps> = props => (
  <Feather name="x" {...props} />
);

export const FeatherCheckIcon: FC<IconProps> = props => (
  <Feather name="check" {...props} />
);

export const MaterialAlertOctagon: FC<IconProps> = props => (
  <Material name="alert-octagon" {...props} />
);

export const MaterialAlertCircle: FC<IconProps> = props => (
  <Material name="alert-circle" {...props} />
);

export const MaterialInformation: FC<IconProps> = props => (
  <Material name="information" {...props} />
);

export const CircleCheckIcon: FC<IconProps> = props => (
  <FontAwesome6 name="circle-check" iconStyle="solid" {...props} />
);

export const TimerSandIcon: FC<IconProps> = props => (
  <Material name="timer-sand-complete" {...props} />
);
