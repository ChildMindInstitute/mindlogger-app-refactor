import { FC } from 'react';

import { AutoCompletion } from '@app/widgets/survey';
import { Box, ImageBackground } from '@shared/ui';

const AutocompletionScreen: FC = () => {
  return (
    <Box bg="$secondary" flex={1}>
      <ImageBackground>
        <Box flex={1} pt={12} pb={34}>
          <AutoCompletion />
        </Box>
      </ImageBackground>
    </Box>
  );
};

export default AutocompletionScreen;
