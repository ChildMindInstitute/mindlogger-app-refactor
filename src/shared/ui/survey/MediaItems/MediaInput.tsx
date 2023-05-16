import { ReactNode, FC } from 'react';
import { Alert, TouchableOpacity, StyleSheet } from 'react-native';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { Center, Box } from '@shared/ui';

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  children: ReactNode;
  mode: 'photo' | 'video';
  onShowMediaLibrary: () => void;
  onOpenCamera: () => void;
  iconComponent: JSX.Element;
};

const UploadButton = styled(Center, {
  width: '100%',
  height: 360,
  borderColor: '$red',
  borderWidth: 4,
  backgroundColor: '$lightRed',
  borderRadius: 15,
});

const MediaInput: FC<Props> = ({
  children,
  mode,
  onOpenCamera,
  onShowMediaLibrary,
  iconComponent,
}) => {
  const { t } = useTranslation();

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
    <UploadButton>
      {children || (
        <TouchableOpacity onPress={onUploadPress} style={styles.touchable}>
          <Box>{iconComponent}</Box>
        </TouchableOpacity>
      )}
    </UploadButton>
  );
};

export default MediaInput;
