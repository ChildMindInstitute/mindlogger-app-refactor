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
    <Chip
      variant="warning"
      icon={() => <UserProfileIcon color={palette.warning} size={12} />}
      {...props}
    >
      {t('assignment:badge', { name: shortName })}
    </Chip>
  );
};
