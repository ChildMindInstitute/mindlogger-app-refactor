import { useEffect, useMemo, FC } from 'react';
import { useState } from 'react';

import NativeGeolocation from '@react-native-community/geolocation';
import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';
import Permissions, { RESULTS } from 'react-native-permissions';

import { IS_ANDROID, LOCATION_PERMISSIONS } from '@app/shared/lib';

import { Center, GeolocationIcon, Text } from '../..';

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
  const [locationPermissionResult, setLocationPermissionResult] =
    useState('undetermined');
  useEffect(() => {
    Permissions.check(LOCATION_PERMISSIONS!).then(setLocationPermissionResult);
  }, []);
  const descriptionText = useMemo(
    () =>
      IS_ANDROID
        ? t('geolocation:must_enable_location_subtitle')
        : t('geolocation:must_enable_location'),
    [t],
  );

  const getCurrentPosition = () => {
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
        setLocationPermissionResult('denied');
        setCoordinates(null);
      },
    );
  };

  const isLocationPermissionDeniedMissing = useMemo(
    () =>
      locationPermissionResult === RESULTS.DENIED ||
      locationPermissionResult === RESULTS.BLOCKED,
    [locationPermissionResult],
  );

  const onButtonPress = async () => {
    setErrorMessage(''); // @todo: change to toast alert when it will be available

    try {
      const permissionsResponse = await Permissions.request(
        LOCATION_PERMISSIONS!,
      );

      if (permissionsResponse === RESULTS.GRANTED) {
        getCurrentPosition();
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
        onPress={onButtonPress}
        iconAfter={<GeolocationIcon color="white" size={20} />}
      >
        {t('geolocation:get_location')}
      </GeolocationButton>

      {Boolean(coordinates) && (
        <Text mt={10} textAlign="center">
          {t('geolocation:location_saved')}
        </Text>
      )}

      {errorMessage && (
        <Text color="$red" textAlign="center">
          {errorMessage}
        </Text>
      )}

      {isLocationPermissionDeniedMissing && (
        <Text mt={10}>{descriptionText}</Text>
      )}
    </Center>
  );
};

export default GeolocationItem;
