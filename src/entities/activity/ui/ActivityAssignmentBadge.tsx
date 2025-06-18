import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib/constants/colors';
import { Box, XStack } from '@app/shared/ui/base';
import { UserProfileIcon } from '@app/shared/ui/icons';
import { Text } from '@app/shared/ui/Text';

import { useActivityAssignee } from '../lib/hooks/useActivityAssignee';
import { Assignment } from '../lib/types/activityAssignment';

type Props = {
  assignment: Assignment;
  accessibilityLabel: string;
  isDisabled?: boolean;
};

export const ActivityAssignmentBadge: FC<Props> = ({
  assignment,
  accessibilityLabel,
  isDisabled,
}) => {
  const { t } = useTranslation();
  const { shortName } = useActivityAssignee({ assignment });

  return (
    <XStack
      alignItems="center"
      py={6}
      px={9}
      borderRadius={8}
      bg={colors.lightYellow}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        width={16}
        height={16}
        mr={9}
        bg={colors.dimYellow}
        borderRadius={3}
      >
        <UserProfileIcon color={colors.lightYellow} size={12} />
      </Box>
      <Text
        fontWeight="400"
        fontSize={14}
        accessibilityLabel={accessibilityLabel}
        lineHeight={20}
        opacity={isDisabled ? 0.5 : 1}
      >
        {t('assignment:badge', { name: shortName })}
      </Text>
    </XStack>
  );
};
