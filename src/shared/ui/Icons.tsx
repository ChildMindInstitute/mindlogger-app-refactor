import { FC } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';

type IconProps = {
  color: string;
  size: number;
};

const CloseIcon: FC<IconProps> = props => <AntDesign name="close" {...props} />;

export { CloseIcon };
