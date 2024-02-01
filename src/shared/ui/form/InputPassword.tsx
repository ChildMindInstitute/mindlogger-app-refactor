import { FC, useCallback, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import {
  Controller,
  useController,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { validatePassword } from '@app/features/sign-up/validation/SignUpFormSchema';
import PasswordRequirements from '@shared/ui/form/PasswordRequirements';
import Input from '@shared/ui/Input';
import { InputIcon } from '@shared/ui/InputIcon';

import { InputFieldProps } from './InputField';
import { EyeIcon, EyeSlashIcon } from '../icons';

export const InputPassword: FC<InputFieldProps> = ({
  name,
  defaultValue = '',
  placeholder,
  mode = 'light',
  backgroundColor,
  ...props
}) => {
  const { control } = useFormContext();
  const [displayHints, setDisplayHints] = useState(false);
  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const {
    field: { onChange: onFormChange, value, ref, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const { password } = useWatch({
    control,
  });

  const checkPassword = useCallback(() => {
    const { minCharacters, noSpaces, specialCharacters, upperCase } =
      validatePassword(password);
    const toDisplay = [minCharacters, noSpaces, specialCharacters, upperCase];
    return {
      isEmpty: !!error,
      requirements: toDisplay,
      isInvalid: password.length > 0 && toDisplay.some(r => !r.isValid),
    };
  }, [password, error]);

  const { requirements, isInvalid } = checkPassword();
  const ShowPasswordIcon = isPasswordHidden ? EyeSlashIcon : EyeIcon;

  return (
    <>
      <Controller
        control={control}
        render={() => (
          <InputIcon
            input={
              <Input
                ref={ref}
                onFocus={() => setDisplayHints(true)}
                onBlur={() => {
                  setDisplayHints(password.length > 1);
                  onBlur();
                }}
                onChangeText={onFormChange}
                value={value}
                placeholder={placeholder}
                autoCapitalize="none"
                mode={mode}
                backgroundColor={backgroundColor}
                secureTextEntry={isPasswordHidden}
                {...props}
                isInvalid={isInvalid || !!error}
              />
            }
            icon={
              <TouchableWithoutFeedback
                onPress={() => setPasswordHidden(!isPasswordHidden)}
              >
                <ShowPasswordIcon size={24} color={mode} />
              </TouchableWithoutFeedback>
            }
          />
        )}
        name={name}
      />

      {(displayHints || !!error) && (
        <PasswordRequirements requirements={requirements} />
      )}
    </>
  );
};

export default InputPassword;
