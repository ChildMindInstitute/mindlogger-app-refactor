import { FC } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

export { default as AboutIcon } from './About';
export { default as DataIcon } from './Data';
export { default as SurveyIcon } from './Survey';
export { default as CloudLogo } from './CloudLogo';

type IconProps = {
  color: string;
  size: number;
  solid?: boolean;
};

type AccessibilityProps = {
  accessibilityLabel?: string | undefined;
};

export const CloseIcon: FC<IconProps> = props => (
  <AntDesign name="close" {...props} />
);

export const ChevronLeft: FC<IconProps> = props => (
  <AntDesign name="left" {...props} />
);

export const CrossIcon: FC<IconProps> = props => (
  <FontAwesome name="close" {...props} />
);

export const ArrowRightIcon: FC<IconProps> = props => (
  <AntDesign name="right" {...props} />
);

export const KeyIcon: FC<IconProps> = props => (
  <Foundation name="key" {...props} />
);

export const UserIcon: FC<IconProps> = props => (
  <FontAwesome name="user-circle" {...props} />
);

export const UserProfileIcon: FC<IconProps> = props => (
  <FontAwesome name="user" {...props} />
);

export const HomeIcon: FC<IconProps> = props => (
  <Entypo name="home" {...props} />
);

export const ChevronRightIcon: FC<IconProps> = props => (
  <FontAwesome name="chevron-right" {...props} />
);

export const QuestionTooltipIcon: FC<IconProps> = props => (
  <FontAwesome name="question-circle-o" {...props} />
);

export const LeftArrowIcon: FC<IconProps> = props => (
  <FontAwesome name="arrow-left" {...props} />
);

export const RightArrowIcon: FC<IconProps> = props => (
  <FontAwesome name="arrow-right" {...props} />
);

export const RestartIcon: FC<IconProps> = props => (
  <FontAwesome name="refresh" {...props} />
);

export const PlayIcon: FC<IconProps & AccessibilityProps> = props => (
  <Entypo name="controller-play" {...props} />
);

export const PauseIcon: FC<IconProps & AccessibilityProps> = props => (
  <Foundation name="pause" {...props} />
);

export const StopIcon: FC<IconProps> = props => (
  <FontAwesome name="stop" {...props} />
);

export const SpeakerIcon: FC<IconProps> = props => (
  <FontAwesome name="volume-up" {...props} />
);

export const CheckIcon: FC<IconProps> = props => (
  <FontAwesome name="check" {...props} />
);

export const BedIcon: FC<IconProps> = props => (
  <FontAwesome name="bed" {...props} />
);

export const AlarmIcon: FC<IconProps> = props => (
  <FontAwesome name="clock-o" {...props} />
);

export const GeolocationIcon: FC<IconProps> = props => (
  <FontAwesome name="map-marker" {...props} />
);

export const PhotoIcon: FC<IconProps> = props => (
  <Entypo name="camera" {...props} />
);

export const VideoIcon: FC<IconProps> = props => (
  <Entypo name="video-camera" {...props} />
);

export const MicrophoneIcon: FC<IconProps> = props => (
  <FontAwesome name="microphone" {...props} />
);

export const ChevronDownIcon: FC<IconProps> = props => (
  <FontAwesome name="chevron-down" {...props} />
);

export const EditIcon: FC<IconProps> = props => (
  <FontAwesome name="edit" {...props} />
);

export const EyeIcon: FC<IconProps> = props => (
  <FontAwesome name="eye" {...props} />
);

export const EyeSlashIcon: FC<IconProps> = props => (
  <FontAwesome name="eye-slash" {...props} />
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

export const OcticonsCircleCheckFill: FC<IconProps> = props => (
  <Octicons name="check-circle-fill" {...props} />
);

export const ClockIcon: FC<IconProps> = props => (
  <Octicons name="clock" {...props} />
);
