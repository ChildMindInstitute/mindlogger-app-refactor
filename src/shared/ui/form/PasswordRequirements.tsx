import { View } from 'react-native';

import { styled, Text } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { colors } from '@shared/lib/constants/colors';

import { FeatherCrossIcon, FeatherCheckIcon } from '../icons';

const themeColors = {
  dark: {
    valid: {
      iconColor: colors.white,
      textColor: colors.white,
    },
    invalid: {
      iconColor: colors.whiteTsp2,
      textColor: colors.whiteTsp2,
    },
  },
  light: {
    valid: {
      iconColor: colors.blue3,
      textColor: colors.darkerGrey4,
    },
    invalid: {
      iconColor: colors.grey4,
      textColor: colors.grey4,
    },
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

const getColor = (mode: 'light' | 'dark', isValid: boolean) => {
  return themeColors[mode][isValid ? 'valid' : 'invalid'];
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
  mode = 'dark',
}: PasswordRequirementProps) => {
  const Icon = isValid ? FeatherCheckIcon : FeatherCrossIcon;
  const { iconColor, textColor } = getColor(mode, !!isValid);
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
  mode?: 'dark' | 'light';
};

export const PasswordRequirements = ({
  requirements,
  mode = 'dark',
}: PasswordRequirementsProps) => {
  const { t } = useTranslation();
  const { textColor } = themeColors[mode].valid;
  return (
    <>
      <StyledPasswordRequirementLabel color={textColor}>
        {t('password_requirements:must_include')}
      </StyledPasswordRequirementLabel>

      <StyledPasswordRequirementContainer>
        {requirements.map(requirement => (
          <PasswordRequirement
            key={requirement.label}
            mode={mode}
            label={t(requirement.label)}
            isValid={requirement.isValid}
          />
        ))}
      </StyledPasswordRequirementContainer>
    </>
  );
};

export default PasswordRequirements;
