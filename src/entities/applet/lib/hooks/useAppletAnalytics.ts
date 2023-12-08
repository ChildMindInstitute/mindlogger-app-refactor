import { useMemo } from 'react';

import { IdentityModel, UserPrivateKeyRecord } from '@app/entities/identity';
import {
  encryption,
  formatToISODate,
  getCurrentWeekDates,
  useAppSelector,
} from '@app/shared/lib';

import { useAppletAnalyticsQuery, useAppletDetailsQuery } from '../../api';
import { mapAppletAnalytics, mapAppletDetailsFromDto } from '../../model';

export const useAppletAnalytics = (appletId: string) => {
  const currentWeekDates = getCurrentWeekDates();
  const firstDateOfCurrentWeek = currentWeekDates[0];
  const respondentId = useAppSelector(IdentityModel.selectors.selectUserId);

  const { data: appletEncryption, isLoading: isDetailsLoading } =
    useAppletDetailsQuery(appletId, {
      select: response =>
        mapAppletDetailsFromDto(response.data.result).encryption,
    });

  const userPrivateKey = useMemo(() => UserPrivateKeyRecord.get(), []);

  const { data: appletAnalytics, isLoading: isAnalyticsLoading } =
    useAppletAnalyticsQuery(
      {
        appletId,
        fromDate: formatToISODate(firstDateOfCurrentWeek),
        respondentIds: respondentId ?? '',
        isLastVersion: true,
      },
      {
        select: response => {
          if (!appletEncryption || !userPrivateKey) {
            return;
          }

          const encryptionService = encryption.createEncryptionService({
            prime: appletEncryption.prime,
            publicKey: appletEncryption.publicKey,
            base: appletEncryption.base,
            privateKey: userPrivateKey,
          });

          const analytics = mapAppletAnalytics({
            appletId,
            activitiesDto: response.data.result.activities,
            answersDto: response.data.result.answers,
            encryptionService,
          });

          return analytics;
        },
      },
    );

  return {
    analytics: appletAnalytics ?? null,
    isLoading: isAnalyticsLoading || isDetailsLoading,
  };
};
