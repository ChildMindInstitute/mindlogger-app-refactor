import { useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';

import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { selectUserId } from '@app/entities/identity/model/selectors';
import { getDefaultEncryptionManager } from '@app/shared/lib/encryption/encryptionManagerInstance';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getCurrentWeekDates, wait } from '@app/shared/lib/utils/common';
import { formatToISODateMidnight } from '@app/shared/lib/utils/dateTime';

import { useAppletAnalyticsQuery } from '../../api/hooks/useAppletAnalyticsQuery';
import { useAppletDetailsQuery } from '../../api/hooks/useAppletDetailsQuery';
import {
  mapAppletAnalytics,
  mapAppletDetailsFromDto,
} from '../../model/mappers';
import { ActivityResponses } from '../types';

type AppletActivitiesResponses = {
  id: string;
  activitiesResponses: ActivityResponses[];
};

export const useAppletAnalytics = (appletId: string) => {
  const currentWeekDates = getCurrentWeekDates();
  const firstDateOfCurrentWeek = currentWeekDates[0];
  const respondentId = useAppSelector(selectUserId);

  const { data: appletEncryption, isLoading: isDetailsLoading } =
    useAppletDetailsQuery(appletId, {
      select: response =>
        mapAppletDetailsFromDto(response.data.result).encryption,
    });

  const userPrivateKey = useMemo(
    () => getDefaultUserPrivateKeyRecord().get(),
    [],
  );

  const [appletAnalytics, setAppletAnalytics] =
    useState<AppletActivitiesResponses>();

  const { data: analyticsResponse, isFetching: isAnalyticsLoading } =
    useAppletAnalyticsQuery({
      appletId,
      fromDate: formatToISODateMidnight(firstDateOfCurrentWeek),
      respondentIds: respondentId ?? '',
      isLastVersion: true,
    });

  useEffect(() => {
    if (!analyticsResponse || !appletEncryption || !userPrivateKey) {
      return;
    }

    InteractionManager.runAfterInteractions(async () => {
      // Add delay as the encryption blocks the JS thread causing a long loading.
      await wait(100);

      const encryptionService =
        getDefaultEncryptionManager().createEncryptionService({
          prime: appletEncryption.prime,
          publicKey: appletEncryption.publicKey,
          base: appletEncryption.base,
          privateKey: userPrivateKey,
        });

      const analytics = mapAppletAnalytics({
        appletId,
        activitiesDto: analyticsResponse.data.result.activities,
        answersDto: analyticsResponse.data.result.answers,
        encryptionService,
      });

      setAppletAnalytics(analytics);
    });
  }, [analyticsResponse, appletEncryption, appletId, userPrivateKey]);

  return {
    analytics: appletAnalytics ?? null,
    isLoading: isAnalyticsLoading || isDetailsLoading,
  };
};
