import { FC, PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { Controller, useFormContext, useController } from 'react-hook-form';

import { colors } from '@app/shared/lib';
import { Box, CheckBox, XStack } from '@shared/ui';
import { ErrorMessage } from '@shared/ui/form';

type Props = {
  name: string;
  onFillColor?: string;
  onCheckColor?: string;
  onTintColor?: string;
  tintColor?: string;
  disabled?: boolean;
};

const CheckBoxField: FC<PropsWithChildren<Props>> = ({
  name,
  onFillColor = colors.white,
  onCheckColor = colors.darkBlue,
  onTintColor = colors.white,
  tintColor = colors.white,
  disabled = false,
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
          <Box>
            <XStack minHeight={24}>
              <CheckBox
                onValueChange={onFormChange}
                style={styles.checkbox}
                tintColors={{
                  true: colors.white,
                  false: isError ? colors.alert : colors.white,
                }}
                onCheckColor={onCheckColor}
                disabled={disabled}
                onFillColor={onFillColor}
                onTintColor={onTintColor}
                tintColor={isError ? colors.alert : tintColor}
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

export default CheckBoxField;
