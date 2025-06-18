import { FC, PropsWithChildren } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { Controller, useFormContext, useController } from 'react-hook-form';

import { palette } from '@app/shared/lib/constants/palette';

import { ErrorMessage } from './ErrorMessage';
import { Box, XStack } from '../base';
import { CheckBox } from '../CheckBox';

type Props = {
  name: string;
  onFillColor?: string;
  onCheckColor?: string;
  onTintColor?: string;
  tintColor?: string;
  disabled?: boolean;
};

export const CheckBoxField: FC<
  PropsWithChildren<Props & AccessibilityProps>
> = ({
  name,
  onFillColor = palette.white,
  onCheckColor = palette.darkBlue,
  onTintColor = palette.white,
  tintColor = palette.white,
  disabled = false,
  accessibilityLabel,
  children,
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange: onFormChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const isError = !!error;

  return (
    <>
      <Controller
        control={control}
        render={() => (
          <Box accessibilityLabel={accessibilityLabel}>
            <XStack minHeight={24}>
              <CheckBox
                onValueChange={onFormChange}
                style={styles.checkbox}
                tintColors={{
                  true: onTintColor,
                  false: isError ? palette.alert : onTintColor,
                }}
                onCheckColor={onCheckColor}
                disabled={disabled}
                onFillColor={onFillColor}
                onTintColor={onTintColor}
                tintColor={isError ? palette.alert : tintColor}
                boxType="square"
                lineWidth={2}
                onAnimationType="fade"
                offAnimationType="fade"
                animationDuration={0.2}
                value={value}
              />

              {children}
            </XStack>
          </Box>
        )}
        name={name}
      />

      <ErrorMessage mode="light" error={error} mt={3} />
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
  },
});
