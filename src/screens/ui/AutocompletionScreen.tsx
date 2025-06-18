import { FC } from 'react';

import { bannerActions } from '@app/entities/banner/model/slice';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { Box } from '@app/shared/ui/base';
import { ImageBackground } from '@app/shared/ui/ImageBackground';
import { AutoCompletion } from '@app/widgets/survey/ui/completion/AutoCompletion';

export const AutocompletionScreen: FC = () => {
  const dispatch = useAppDispatch();

  useOnFocus(() => {
    // Match <ImageBackground> raster image top pixel color
    dispatch(bannerActions.setBannersBg(palette.lightGrey4));
  });

  return (
    <Box bg="$lightGrey4" flex={1}>
      <ImageBackground>
        <Box flex={1} pt={12} pb={34}>
          <AutoCompletion />
        </Box>
      </ImageBackground>
    </Box>
  );
};
