import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, Text } from '@app/shared/ui';
import { LineChart, TimelineChart } from '@app/shared/ui/charts';
import {
  AnalyticsResponseType,
  ResponseAnalyticsDto,
  ResponseConfig,
} from '@shared/api';

type Props = {
  responseType: AnalyticsResponseType;
  responseConfig: ResponseConfig;
  data: ResponseAnalyticsDto;
  title: string;
};

const AnalyticsChart: FC<Props> = ({
  responseType,
  data,
  title,
  responseConfig,
}) => {
  let chart: JSX.Element | null;

  const { t } = useTranslation();

  switch (responseType) {
    case 'singleSelect':
      chart = (
        <TimelineChart
          config={responseConfig}
          data={data.map(x => ({ ...x, date: new Date(x.date) }))}
        />
      );
      break;
    case 'multiSelect':
      chart = (
        <TimelineChart
          config={responseConfig}
          data={data.map(x => ({ ...x, date: new Date(x.date) }))}
        />
      );
      break;
    case 'slider':
      chart = (
        <LineChart data={data.map(x => ({ ...x, date: new Date(x.date) }))} />
      );
      break;

    default:
      chart = null;
      break;
  }

  return (
    <Box>
      <Text
        textAlign="center"
        mb={10}
        color="$tertiary"
        fontWeight="500"
        fontSize={15}
      >
        {title}
      </Text>

      {chart}

      {!data.length && (
        <Text p={20} fontWeight="400">
          {t('applet_data:title')}
        </Text>
      )}
    </Box>
  );
};

export default AnalyticsChart;
