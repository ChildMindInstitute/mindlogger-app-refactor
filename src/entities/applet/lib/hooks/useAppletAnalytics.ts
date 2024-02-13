import { useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';

import { IdentityModel, UserPrivateKeyRecord } from '@app/entities/identity';
import {
  encryption,
  formatToISODateMidnight,
  getCurrentWeekDates,
  useAppSelector,
  wait,
} from '@app/shared/lib';

import { useAppletAnalyticsQuery, useAppletDetailsQuery } from '../../api';
import { mapAppletAnalytics, mapAppletDetailsFromDto } from '../../model';
import { ActivityResponses } from '../types';

type AppletActivitiesResponses = {
  id: string;
  activitiesResponses: ActivityResponses[];
};

export const useAppletAnalytics = (appletId: string) => {
  const currentWeekDates = getCurrentWeekDates();
  const firstDateOfCurrentWeek = currentWeekDates[0];
  const respondentId = useAppSelector(IdentityModel.selectors.selectUserId);

  const { data: appletEncryption, isLoading: isDetailsLoading } =
    useAppletDetailsQuery(appletId, {
      select: (response) =>
        mapAppletDetailsFromDto(response.data.result).encryption,
    });

  const userPrivateKey = useMemo(() => UserPrivateKeyRecord.get(), []);

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

      const encryptionService = encryption.createEncryptionService({
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
