import { FC } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { XStack, YStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib';
import { Box, BoxProps, Text } from '@app/shared/ui';
import { LoadListError } from '@app/shared/ui';

import AppletCard from './AppletCard';
import { useAppletsQuery } from '../api';
import { Applet } from '../lib';

const AppletList: FC<BoxProps> = props => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const { isLoading, error, data } = useAppletsQuery();

  const hasError = !!error;

  const applets: Applet[] | undefined = data?.data?.applets?.map<Applet>(
    dto => ({
      ...dto,
    }),
  );

  return (
    <YStack {...props}>
      {isLoading && (
        <XStack flex={1} jc="center">
          <ActivityIndicator size="large" color={colors.tertiary} />
        </XStack>
      )}

      {hasError && (
        <XStack flex={1} jc="center" alignItems="center">
          <LoadListError error="widget_error:error_text" />
        </XStack>
      )}

      {!isLoading &&
        !hasError &&
        applets!.map(x => (
          <Box mb={18} key={x.id}>
            <AppletCard applet={x} />
          </Box>
        ))}

      <XStack jc="center" mt={10} mb={20}>
        <TouchableOpacity onPress={() => navigate('AboutApp')}>
          <Text color="$primary" fontSize={16} fontWeight="700">
            {t('applet_list_component:about_title')}
          </Text>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
};

export default AppletList;
