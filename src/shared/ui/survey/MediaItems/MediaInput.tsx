import { ReactNode, FC } from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { Box, BoxProps } from '../../base';
import { Center } from '../../Center';

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
  overflow: 'hidden',
  borderWidth: 4,
  backgroundColor: '$red_light',
  borderRadius: 15,
});

export const MediaInput: FC<Props> = ({
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
    <ContentWrapper
      accessibilityLabel="media-input-container"
      borderColor={borderColor}
      height={windowWidth * 0.85}
    >
      {children || (
        <TouchableOpacity
          accessibilityLabel="media-input-btn"
          onPress={onUploadPress}
          style={styles.touchable}
        >
          <Box>{uploadIcon}</Box>
        </TouchableOpacity>
      )}
    </ContentWrapper>
  );
};
