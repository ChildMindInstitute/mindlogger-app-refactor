import { FC } from 'react';
import { FlatList } from 'react-native';

import { Activity } from '@entities/applet';

import ActivityDataCard from './ActivityAnalyticsCard';

type Props = {
  activities: Array<Activity>;
};

const ActivityAnalyticsList: FC<Props> = ({ activities }) => {
  const keyExtractor = (item: Activity) => item.id;

  return (
    <FlatList
      data={activities}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => {
        return <ActivityDataCard activity={item} />;
      }}
    />
  );
};

export default ActivityAnalyticsList;
