import { FC, useState } from 'react';

import NativeGeolocation from '@react-native-community/geolocation';
import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';
import { RESULTS } from 'react-native-permissions';

import { getLocationPermissions, IS_ANDROID } from '@app/shared/lib';
import { Center, GeolocationIcon, Text } from '@app/shared/ui';
import { useLocationPermissions } from '@shared/lib';

import { Coordinates } from './types';

const GeolocationButton = styled(Button, {
  backgroundColor: '$blue',
  borderRadius: 0,
  color: '$white',
  fontWeight: '900',
  minWidth: '10%',
});

type Props = {
  onChange: (value: Coordinates) => void;
  value?: Coordinates;
};

const GeolocationItem: FC<Props> = ({ onChange, value = null }) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');
  const locationPermission = useLocationPermissions();

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
        onChange(coordinatesResult);
      },
      () => {
        setErrorMessage(t('geolocation:service_not_available'));
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
      <GeolocationButton
        onPress={handleGetGeolocation}
        iconAfter={<GeolocationIcon color="white" size={20} />}
      >
        {t('geolocation:get_location')}
      </GeolocationButton>

      {value && (
        <Text mt={10} textAlign="center">
          {t('geolocation:location_saved')}
        </Text>
      )}

      {errorMessage && (
        <Text color="$red" textAlign="center">
          {errorMessage}
        </Text>
      )}

      {isPermissionDenied && !value && <Text mt={10}>{descriptionText}</Text>}
    </Center>
  );
};

export default GeolocationItem;
