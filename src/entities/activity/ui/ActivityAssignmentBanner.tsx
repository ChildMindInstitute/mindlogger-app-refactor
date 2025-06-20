import { FC } from 'react';

import { Trans } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';
import { Box, XStack } from '@app/shared/ui/base';
import { UserProfileIcon } from '@app/shared/ui/icons';
import { Text } from '@app/shared/ui/Text';

import { useActivityAssignee } from '../lib/hooks/useActivityAssignee';
import { Assignment } from '../lib/types/activityAssignment';

type Props = {
  assignment: Assignment;
  accessibilityLabel: string;
};

export const ActivityAssignmentBanner: FC<Props> = ({
  assignment,
  accessibilityLabel,
}) => {
  const { shortName } = useActivityAssignee({ assignment });

  return (
    <XStack alignItems="center" py={12} px={18} bg={palette.warning_container}>
      <Box
        flex={0}
        alignItems="center"
        justifyContent="center"
        width={26}
        height={26}
        mr={14}
        borderRadius={3}
      >
        <UserProfileIcon color={palette.warning} size={16} />
      </Box>
      <Box flex={1}>
        <Text
          fontWeight="400"
          fontSize={16}
          accessibilityLabel={accessibilityLabel}
          lineHeight={24}
        >
          <Trans
            i18nKey="assignment:banner"
            components={{
              strong: <Text fontWeight="700" />,
            }}
            values={{ name: shortName }}
          />
        </Text>
      </Box>
    </XStack>
  );
};
