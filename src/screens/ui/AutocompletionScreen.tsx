import { FC } from 'react';

import { Box } from '@app/shared/ui/base';
import { ImageBackground } from '@app/shared/ui/ImageBackground';
import { AutoCompletion } from '@app/widgets/survey/ui/completion/AutoCompletion';

export const AutocompletionScreen: FC = () => {
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
