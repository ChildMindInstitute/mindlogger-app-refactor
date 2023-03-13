import { useEffect, FC } from 'react';
import { useState } from 'react';

import NativeGeolocation from '@react-native-community/geolocation';
import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';
import Permissions, { RESULTS } from 'react-native-permissions';

import {
  getLocationPermissions,
  IS_ANDROID,
  LOCATION_PERMISSIONS,
} from '@app/shared/lib';
import { Center, GeolocationIcon, Text } from '@app/shared/ui';

const GeolocationButton = styled(Button, {
  backgroundColor: '$blue',
  borderRadius: 0,
  color: '$white',
  fontWeight: '900',
  minWidth: '10%',
});

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Props = {
  onChange: (value: Coordinates) => void;
  value: Coordinates | null;
};

const GeolocationItem: FC<Props> = ({ onChange, value = null }) => {
  const { t } = useTranslation();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(value);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationPermission, setLocationPermission] =
    useState<string>('undetermined');

  const descriptionText = IS_ANDROID
    ? t('geolocation:must_enable_location_subtitle')
    : t('geolocation:must_enable_location');

  const fetchCurrentPosition = () => {
    NativeGeolocation.getCurrentPosition(
      successResult => {
        const coordinatesResult = {
          latitude: successResult.coords.latitude,
          longitude: successResult.coords.longitude,
        };
        setCoordinates(coordinatesResult);
        onChange(coordinatesResult);
      },
      () => {
        setErrorMessage(t('geolocation:service_not_available'));
        setCoordinates(null);
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

  useEffect(() => {
    Permissions.check(LOCATION_PERMISSIONS!).then(setLocationPermission);
  }, []);

  return (
    <Center>
      <GeolocationButton
        onPress={handleGetGeolocation}
        iconAfter={<GeolocationIcon color="white" size={20} />}
      >
        {t('geolocation:get_location')}
      </GeolocationButton>

      {coordinates && (
        <Text mt={10} textAlign="center">
          {t('geolocation:location_saved')}
        </Text>
      )}

      {errorMessage && (
        <Text color="$red" textAlign="center">
          {errorMessage}
        </Text>
      )}

      {isPermissionDenied && <Text mt={10}>{descriptionText}</Text>}
    </Center>
  );
};

export default GeolocationItem;
