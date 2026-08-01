import { FC, useEffect } from 'react';
import { StatusBar as RNStatusBar } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { AutocompletionEventOptions } from '@app/abstract/lib/types/autocompletion';
import { bannersHiddenSelector } from '@app/entities/banner/model/selectors';
import { useUpcomingNotificationsObserver } from '@app/entities/notification/lib/hooks/useUpcomingNotificationsObserver';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useStableTopInset } from '@app/shared/lib/hooks/useStableTopInset';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getSupportsMobile } from '@app/shared/lib/utils/responseTypes';
import { Spinner } from '@app/shared/ui/Spinner';
import { StatusBar } from '@app/shared/ui/StatusBar';
import { useBaseInfo } from '@app/widgets/activity-group/model/hooks/useBaseInfo';
import { FlowSurvey } from '@app/widgets/survey/ui/FlowSurvey';
import { IS_ANDROID, OS_MAJOR_VERSION } from '@shared/lib/constants';

import { RootStackParamList } from '../config/types';

type Props = NativeStackScreenProps<RootStackParamList, 'InProgressActivity'>;

export const InProgressActivityScreen: FC<Props> = ({ navigation, route }) => {
  const { appletId, eventId, entityId, entityType, targetSubjectId } =
    route.params;

  useUpcomingNotificationsObserver(eventId, entityId, targetSubjectId);

  const { data, isLoading } = useBaseInfo(appletId);
  const { responseTypes, title } = data || {};
  const entityResponseTypes = responseTypes?.[entityId];
  const isAppSupportedEntity = entityResponseTypes?.every(getSupportsMobile);

  useEffect(() => {
    if (!isAppSupportedEntity && !isLoading) {
      navigation.replace('AppletDetails', { appletId, title: title || '' });
    }
  }, [appletId, isAppSupportedEntity, isLoading, navigation, title]);

  useEffect(() => {
    const callback = navigation.addListener('beforeRemove', () => {
      // Restore the status bar before the back transition starts so the
      // resulting layout shift is masked by the transition animation instead
      // of happening after the previous screen is already visible.
      // Android-only: on iOS this mid-transition restore makes UIKit re-lay
      // out the incoming screen's native header, shifting its content down.
      if (IS_ANDROID) {
        RNStatusBar.setHidden(false, 'fade');
      }

      Emitter.emit<AutocompletionEventOptions>('autocomplete', {
        checksToExclude: ['in-progress-activity'],
        logTrigger: 'close-entity',
      });
    });

    return () => {
      navigation.removeListener('beforeRemove', callback);
    };
  }, [navigation]);

  // Stable inset: does not collapse to 0 when this screen hides the status
  // bar, so the layout below stays put for the lifetime of the screen.
  const top = useStableTopInset();

  // Unity steps set this flag (via UnityView) to take over the full screen.
  // Animate the margin to 0 so the transition to/from Unity is smooth
  // instead of a layout jump.
  const isFullScreenStep = useAppSelector(bannersHiddenSelector);
  const targetMargin =
    IS_ANDROID && OS_MAJOR_VERSION >= 15 && !isFullScreenStep ? top : 0;
  const animatedMargin = useSharedValue(targetMargin);

  useEffect(() => {
    animatedMargin.value = withTiming(targetMargin, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  }, [targetMargin, animatedMargin]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    flex: 1,
    marginTop: animatedMargin.value,
  }));

  return (
    // There's weird white space on Android because of the safe area insets
    // We can remove this top margin when this issue is resolved:
    // https://github.com/react-navigation/react-navigation/issues/12608
    <Animated.View style={animatedContainerStyle}>
      <StatusBar hidden animated />

      {isLoading || !isAppSupportedEntity ? (
        <Spinner withOverlay />
      ) : (
        <FlowSurvey
          appletId={appletId}
          entityId={entityId}
          entityType={entityType}
          eventId={eventId}
          targetSubjectId={targetSubjectId}
          onClose={() => navigation.goBack()}
        />
      )}
    </Animated.View>
  );
};
