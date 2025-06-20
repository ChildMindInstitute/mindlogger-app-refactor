import { FC, useState } from 'react';

import NativeGeolocation from '@react-native-community/geolocation';
import { useTranslation } from 'react-i18next';
import { RESULTS } from 'react-native-permissions';

import { IS_ANDROID } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { useIsOnline } from '@app/shared/lib/hooks/useIsOnline';
import { useLocationPermissions } from '@app/shared/lib/hooks/useLocationPermissions';
import { getLocationPermissions } from '@app/shared/lib/permissions/geolocationPermissions';

import { Coordinates } from './types';
import { Center } from '../../Center';
import { GeolocationIcon } from '../../icons';
import { SubmitButton } from '../../SubmitButton';
import { Text } from '../../Text';

type Props = {
  onChange: (value: Coordinates) => void;
  value?: Coordinates;
};

type CurrentPositionSuccessResult = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

export const GeolocationItem: FC<Props> = ({ onChange, value = null }) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');
  const isOnline = useIsOnline();
  const locationPermission = useLocationPermissions();

  const descriptionText = IS_ANDROID
    ? t('geolocation:must_enable_location_subtitle')
    : t('geolocation:must_enable_location');

  const fetchCurrentPosition = () => {
    NativeGeolocation.getCurrentPosition(
      (successResult: CurrentPositionSuccessResult) => {
        const coordinatesResult = {
          latitude: successResult.coords.latitude,
          longitude: successResult.coords.longitude,
        };
        onChange(coordinatesResult);
        setErrorMessage('');
      },
      () => {
        setErrorMessage(t('geolocation:service_not_available'));
      },
      {
        timeout: 60 * 1000,
        enableHighAccuracy: !isOnline,
      },
    );
  };

  const isPermissionDenied =
    locationPermission === RESULTS.DENIED ||
    locationPermission === RESULTS.BLOCKED;

  const handleGetGeolocation = async () => {
    setErrorMessage(''); // @todo: change to toast alert when it will be available

    try {
      const permissionsResponse = await getLocationPermissions();
      if (permissionsResponse === RESULTS.GRANTED) {
        fetchCurrentPosition();
      } else {
        setErrorMessage(t('geolocation:service_not_available')); // @todo: change to toast alert it will be available
      }
    } catch {
      setErrorMessage(t('geolocation:service_not_available')); // @todo: change to toast alert it will be available
    }
  };

  return (
    <Center>
      <SubmitButton
        accessibilityLabel="geolocation-submit-btn"
        onPress={handleGetGeolocation}
        mode="tonal"
        rightIcon={
          <GeolocationIcon color={palette.on_secondary_container} size={18} />
        }
      >
        {t('geolocation:get_location')}
      </SubmitButton>

      {value && (
        <Text
          mt={10}
          accessibilityLabel="geolocation_result-text"
          textAlign="center"
        >
          {t('geolocation:location_saved')}
        </Text>
      )}

      {errorMessage && (
        <Text
          accessibilityLabel="geolocation_error-text"
          color="$red"
          textAlign="center"
        >
          {errorMessage}
        </Text>
      )}

      {isPermissionDenied && !value && (
        <Text accessibilityLabel="geolocation_description-text" mt={10}>
          {descriptionText}
        </Text>
      )}
    </Center>
  );
};
