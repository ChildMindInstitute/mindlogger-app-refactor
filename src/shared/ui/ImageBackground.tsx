import React, { FC, PropsWithChildren } from 'react';
import { ImageBackground as RnImageBackground, StyleSheet } from 'react-native';

const ImageBackground: FC<PropsWithChildren> = ({ children }) => {
  return (
    <RnImageBackground
      style={styles.image}
      source={{
        uri: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
      }}>
      {children}
    </RnImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default ImageBackground;
