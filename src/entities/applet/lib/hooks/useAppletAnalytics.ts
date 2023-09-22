import { format } from 'date-fns';

import { UserPrivateKeyRecord } from '@app/entities/identity';
import { encryption, getCurrentWeekDates } from '@app/shared/lib';

import { useAppletAnalyticsQuery, useAppletDetailsQuery } from '../../api';
import { mapAppletAnalytics, mapAppletDetailsFromDto } from '../../model';

export const useAppletAnalytics = (appletId: string) => {
  const currentWeekDates = getCurrentWeekDates();
  const firstDateOfCurrentWeek = format(currentWeekDates[0], 'yyyy-MM-dd');

  const { data: appletEncryption } = useAppletDetailsQuery(appletId, {
    select: response =>
      mapAppletDetailsFromDto(response.data.result).encryption,
  });

  const userPrivateKey = UserPrivateKeyRecord.get();

  const { data: appletAnalytics } = useAppletAnalyticsQuery(
    appletId,
    firstDateOfCurrentWeek,
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

  return { analytics: appletAnalytics ?? null };
};
