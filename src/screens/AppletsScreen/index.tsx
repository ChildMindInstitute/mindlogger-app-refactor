import { FC } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { AppletList } from '@app/entities/applet';
import { Box, ScrollView } from '@shared/ui';

const AppletsScreen: FC = () => {
  return (
    <Box bg="$secondary" flex={1}>
      <ImageBackground
        style={styles.image}
        source={{
          uri: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
        }}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <AppletList flex={1} px={14} pt={12} pb={20} />
        </ScrollView>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default AppletsScreen;
