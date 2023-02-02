import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActivityGroupList } from '@app/widgets/activity-group';
import { RootStackParamList } from '@screens/config';
import { Box, ImageBackground, ScrollView } from '@shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityList'>;

const ActivityListScreen: FC<Props> = props => {
  return (
    <Box bg="$secondary" flex={1}>
      <ImageBackground>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <ActivityGroupList
            flex={1}
            px={14}
            pt={20}
            pb={42}
            appletId={props.route.params.appletId}
          />
        </ScrollView>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ActivityListScreen;
