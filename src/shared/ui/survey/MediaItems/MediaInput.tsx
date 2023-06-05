import { ReactNode, FC } from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { Center, Box, BoxProps } from '@shared/ui';

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = BoxProps & {
  children: ReactNode;
  mode: 'photo' | 'video';
  onShowMediaLibrary: () => void;
  onOpenCamera: () => void;
  uploadIcon: JSX.Element;
};

const ContentWrapper: FC<BoxProps> = styled(Center, {
  width: '100%',
  marginBottom: 15,

  borderWidth: 4,
  backgroundColor: '$lightRed',
  borderRadius: 15,
});

const MediaInput: FC<Props> = ({
  children,
  mode,
  onOpenCamera,
  onShowMediaLibrary,
  uploadIcon,
  borderColor,
}) => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();

  const onUploadPress = () => {
    Alert.alert(t(`camera:choose_${mode}`), t(`camera:take_a_${mode}`), [
      {
        text: t('camera:camera'),
        onPress: onOpenCamera,
      },
      {
        text: t('camera:library'),
        onPress: onShowMediaLibrary,
      },
    ]);
  };

  return (
    <ContentWrapper borderColor={borderColor} height={windowWidth * 0.85}>
      {children || (
        <TouchableOpacity onPress={onUploadPress} style={styles.touchable}>
          <Box>{uploadIcon}</Box>
        </TouchableOpacity>
      )}
    </ContentWrapper>
  );
};

export default MediaInput;
