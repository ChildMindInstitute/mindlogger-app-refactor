import {
  Container,
  Text,
  View,
  Icon,
  Button,
  Center,
  KeyboardAvoidingView,
  Flex,
  VStack,
  HStack,
  Pressable,
  Image,
  Input,
} from 'native-base';

import StatusBar from './StatusBar';

const Footer = ({ children }) => {
  return <>{children}</>;
};

const Right = ({ children }) => {
  return <>{children}</>;
};

const Form = ({ children }) => {
  return <>{children}</>;
};

// const Input = () => {
//   return (
//     <InputBase
//       variant={'underlined'}
//       // style={{
//       //   borderStartWidth: 0,
//       //   borderEndWidth: 0,
//       //   borderTopWidth: 0,
//       //   borderRightWidth: 0,
//       //   borderBottomWidth: 4,
//       //   borderColor: 'red',
//       // }}
//     />
//   );
// };

export {
  StatusBar,
  Container,
  Center,
  Text,
  View,
  Icon,
  Footer,
  Right,
  Button,
  Form,
  KeyboardAvoidingView,
  Flex,
  HStack,
  VStack,
  Pressable,
  Image,
  Input,
};
