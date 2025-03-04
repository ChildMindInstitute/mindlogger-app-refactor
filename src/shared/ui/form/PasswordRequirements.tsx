import { View } from 'react-native';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { colors } from '@app/shared/lib/constants/colors';

import { FeatherCrossIcon, FeatherCheckIcon } from '../icons';
import { Text } from '../Text';

const themeColors = {
  valid: {
    iconColor: colors.white,
    textColor: colors.white,
  },
  invalid: {
    iconColor: colors.whiteTsp2,
    textColor: colors.whiteTsp2,
  },
};

export const StyledPasswordRequirementContainer = styled(View, {
  marginTop: 12,
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

      <Text fontSize={14} marginLeft={8} color={textColor}>
        {label}
      </Text>
    </StyledView>
  );
};

export type PasswordRequirementsProps = {
  requirements: Requirement[];
};

export const PasswordRequirements = ({
  requirements,
}: PasswordRequirementsProps) => {
  const { t } = useTranslation();
  const { textColor } = themeColors.valid;
  return (
    <>
      <Text color={textColor}>{t('password_requirements:must_include')}</Text>

      <StyledPasswordRequirementContainer>
        {requirements.map(requirement => (
          <PasswordRequirement
            key={requirement.label}
            label={t(requirement.label)}
            isValid={requirement.isValid}
          />
        ))}
      </StyledPasswordRequirementContainer>
    </>
  );
};
