import { View } from 'react-native';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';

import { FeatherCrossIcon, FeatherCheckIcon } from '../icons';
import { Text } from '../Text';

const themeColors = {
  valid: {
    iconColor: palette.green,
    textColor: palette.green,
  },
  invalid: {
    iconColor: palette.gray,
    textColor: palette.gray,
  },
  neutral: {
    iconColor: palette.neutral,
    textColor: palette.neutral,
  },
  error: {
    iconColor: palette.error,
    textColor: palette.error,
  },
  green: {
    iconColor: palette.green,
    textColor: palette.green,
  },
};

export const StyledPasswordRequirementContainer = styled(View, {
  marginTop: 12,
  marginBottom: 12,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const StyledPasswordRequirementLabel = styled(Text, {
  marginTop: 10,
});

const StyledView = styled(View, {
  marginBottom: 4,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '50%',
});

const StyledIconView = styled(View, {
  width: 18,
});

const getColor = (isValid: boolean) => {
  return themeColors[isValid ? 'valid' : 'invalid'];
};

export type Requirement = {
  label: string;
  isValid?: boolean;
};

export type PasswordRequirementProps = Requirement & {
  mode?: 'dark' | 'light';
};

export const PasswordRequirement = ({
  label,
  isValid,
}: PasswordRequirementProps) => {
  const Icon = isValid ? FeatherCheckIcon : FeatherCrossIcon;
  const { iconColor, textColor } = getColor(!!isValid);
  return (
    <StyledView testID={label}>
      <StyledIconView>
        <Icon color={iconColor} size={16} />
      </StyledIconView>

      <Text flexShrink={1} fontSize={14} marginLeft={8} color={textColor}>
        {label}
      </Text>
    </StyledView>
  );
};

export type PasswordRequirementsProps = {
  typeRequirements: Requirement[];
};

export const PasswordRequirements = ({
  typeRequirements,
}: PasswordRequirementsProps) => {
  const { t } = useTranslation();

  const isValidTypeRequirements =
    typeRequirements.filter(r => r.isValid).length >= 3;

  return (
    <>
      {!isValidTypeRequirements && (
        <StyledPasswordRequirementContainer>
          {typeRequirements.map(requirement => (
            <PasswordRequirement
              key={requirement.label}
              label={t(requirement.label)}
              isValid={requirement.isValid}
            />
          ))}
        </StyledPasswordRequirementContainer>
      )}
    </>
  );
};
