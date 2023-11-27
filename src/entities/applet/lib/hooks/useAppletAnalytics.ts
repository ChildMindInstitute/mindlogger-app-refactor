import { format } from 'date-fns';

import { IdentityModel, UserPrivateKeyRecord } from '@app/entities/identity';
import {
  encryption,
  getCurrentWeekDates,
  useAppSelector,
} from '@app/shared/lib';

import { useAppletAnalyticsQuery, useAppletDetailsQuery } from '../../api';
import { mapAppletAnalytics, mapAppletDetailsFromDto } from '../../model';

export const useAppletAnalytics = (appletId: string) => {
  const currentWeekDates = getCurrentWeekDates();
  const firstDateOfCurrentWeek = format(currentWeekDates[0], 'yyyy-MM-dd');
  const respondentId = useAppSelector(IdentityModel.selectors.selectUserId);

  const { data: appletEncryption, isLoading: isDetailsLoading } =
    useAppletDetailsQuery(appletId, {
      select: response =>
        mapAppletDetailsFromDto(response.data.result).encryption,
    });

  const userPrivateKey = UserPrivateKeyRecord.get();

  const { data: appletAnalytics, isLoading: isAnalyticsLoading } =
    useAppletAnalyticsQuery(
      {
        appletId,
        fromDate: firstDateOfCurrentWeek,
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
