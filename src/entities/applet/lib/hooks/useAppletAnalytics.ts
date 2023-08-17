import { UserPrivateKeyRecord } from '@app/entities/identity';
import { encryption, getCurrentWeekDates } from '@app/shared/lib';

import { useAppletAnalyticsQuery, useAppletDetailsQuery } from '../../api';
import { mapAppletAnalytics } from '../../model';

export const useAppletAnalytics = (appletId: string) => {
  const currentWeekDates = getCurrentWeekDates();
  const firstDateOfCurrentWeek = currentWeekDates[0].toString();

  const { data: appletEncryption } = useAppletDetailsQuery(appletId, {
    select: response => response?.data.result.encryption,
  });
  const { data: appletAnalytics } = useAppletAnalyticsQuery(
    appletId,
    firstDateOfCurrentWeek,
    {
      select: response => response?.data.result,
    },
  );
  const userPrivateKey = UserPrivateKeyRecord.get();

  if (appletAnalytics && appletEncryption && userPrivateKey) {
    const encryptionService = encryption.createEncryptionService({
      prime: appletEncryption.prime,
      publicKey: appletEncryption.publicKey,
      base: appletEncryption.base,
      privateKey: userPrivateKey,
    });

    const analytics = mapAppletAnalytics({
      appletId,
      activitiesDto: appletAnalytics.activities,
      answersDto: appletAnalytics.answers,
      encryptionService,
    });

    return { analytics };
  }

  return { analytics: null };
};
