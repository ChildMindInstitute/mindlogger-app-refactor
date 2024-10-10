import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { ResponseAnalyticsValue } from '@app/entities/applet/lib/types';
import {
  AnalyticsResponseType,
  ResponseConfig,
} from '@app/shared/api/services/AppletAnalyticsDto';
import { Box } from '@app/shared/ui/base';
import { LineChart } from '@app/shared/ui/charts/LineChart/LineChart';
import { TimelineChart } from '@app/shared/ui/charts/TimelineChart/TimelineChart';
import { Text } from '@app/shared/ui/Text';

type Props = {
  responseType: AnalyticsResponseType;
  responseConfig: ResponseConfig;
  data: ResponseAnalyticsValue;
  title: string;
};

export const AnalyticsChart: FC<Props> = ({
  responseType,
  data,
  title,
  responseConfig,
}) => {
  let chart: JSX.Element | null;

  const { t } = useTranslation();

  switch (responseType) {
    case 'singleSelect':
    case 'multiSelect':
      chart = <TimelineChart config={responseConfig} data={data} />;
      break;
    case 'slider':
      chart = (
        <LineChart
          config={responseConfig}
          data={data.map(x => ({ ...x, date: new Date(x.date) }))}
        />
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
        fontWeight="800"
        fontSize={15}
      >
        {title}
      </Text>

      {!data.length ? (
        <Text p={20} fontWeight="400">
          {t('applet_data:title')}
        </Text>
      ) : (
        chart
      )}
    </Box>
  );
};
