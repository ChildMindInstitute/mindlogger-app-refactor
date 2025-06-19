import { FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { useTranslation } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';
import { Chip } from '@app/shared/ui/Chip';
import { UserProfileIcon } from '@app/shared/ui/icons';

import { useActivityAssignee } from '../lib/hooks/useActivityAssignee';
import { Assignment } from '../lib/types/activityAssignment';

type Props = {
  assignment: Assignment;
} & AccessibilityProps;

export const ActivityAssignmentBadge: FC<Props> = ({
  assignment,
  ...props
}) => {
  const { t } = useTranslation();
  const { shortName } = useActivityAssignee({ assignment });

  return (
    // <XStack
    //   alignItems="center"
    //   py={6}
    //   px={9}
    //   borderRadius={8}
    //   bg="$yellow_light"
    // >
    //   <Box
    //     alignItems="center"
    //     justifyContent="center"
    //     width={16}
    //     height={16}
    //     mr={9}
    //     bg="$yellow_light"
    //     borderRadius={3}
    //   >
    //     <UserProfileIcon color={palette.yellow} size={12} />
    //   </Box>
    //   <Text
    //     fontWeight="400"
    //     fontSize={14}
    //     lineHeight={20}
    //     letterSpacing={0.1}
    //     {...props}
    //   >
    //     {t('assignment:badge', { name: shortName })}
    //   </Text>
    // </XStack>
    <Chip
      variant="warning"
      icon={() => <UserProfileIcon color={palette.warning} size={12} />}
      {...props}
    >
      {t('assignment:badge', { name: shortName })}
    </Chip>
  );
};
