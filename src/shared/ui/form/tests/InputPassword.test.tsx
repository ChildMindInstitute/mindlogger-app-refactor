import React from 'react';
import { TextInput } from 'react-native';

import { FormProvider } from 'react-hook-form';
import renderer, { act } from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import SignUpFormSchema from '@app/features/sign-up/validation/SignUpFormSchema';
import { colors } from '@app/shared/lib/constants/colors';
import useAppForm from '@app/shared/lib/hooks/useAppForm';

import InputPassword from '../InputPassword';

/* Test helper functions */

const getComponentByTestId = (
  instance: renderer.ReactTestInstance,
  testID: string,
) => {
  return instance.find(c => c.props.testID === testID).props;
};

const getPasswordRequirement = (
  instance: renderer.ReactTestInstance,
  requirementID: string,
) => {
  const requirement = getComponentByTestId(
    instance,
    `password_requirements:${requirementID}`,
  );
  return {
    icon: requirement.children[0].props.children,
    text: requirement.children[1].props.children,
  };
};

const getPasswordRequirements = (instance: renderer.ReactTestInstance) => {
  const minCharacters = getPasswordRequirement(instance, 'at_least_characters');

  const capitalLetter = getPasswordRequirement(
    instance,
    'at_least_capital_letter',
  );

  const specialCharacters = getPasswordRequirement(
    instance,
    'no_special_characters',
  );
  const blankSpaces = getPasswordRequirement(instance, 'no_blank_spaces');

  return { minCharacters, capitalLetter, specialCharacters, blankSpaces };
};

const FormTestWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues: any;
}) => {
  const { form } = useAppForm(SignUpFormSchema, {
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      ...defaultValues,
    },
    onSubmitSuccess: () => {},
  });
  return (
    <TamaguiProvider>
      <FormProvider {...form}>{children}</FormProvider>
    </TamaguiProvider>
  );
};

const createTest = ({
  defaultValues = {},
  displayRequirements = true,
}: any = {}) => {
  const tree = renderer.create(
    <FormTestWrapper defaultValues={defaultValues}>
      <InputPassword name="password" placeholder="Password" />
    </FormTestWrapper>,
  );
  const instance = tree.root;
  if (displayRequirements) {
    const mEvent = { target: { value: '' } };
    act(() => {
      const input: any = instance.findByType(TextInput);
      input.props.onFocus(mEvent);
    });
  }
  return { tree, instance };
};

/* Test use-cases */

describe('InputPassword', () => {
  it('should render properly without displaying the password requirements', () => {
    const { tree } = createTest({ displayRequirements: false });
    expect(tree).toMatchSnapshot();
  });

  it('should render properly displaying the password requirements', () => {
    const { tree } = createTest({ displayRequirements: true });
    expect(tree).toMatchSnapshot();
  });

  it('should display validation when the password have 8 characters', () => {
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'testpassword',
          },
        }).instance,
      ).minCharacters.icon.props.color,
    ).toBe(colors.white);
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: '',
          },
        }).instance,
      ).minCharacters.icon.props.color,
    ).toBe(colors.whiteTsp2);
  });

  it('should display validation when the password have no blank spaces', () => {
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'a',
          },
        }).instance,
      ).blankSpaces.icon.props.color,
    ).toBe(colors.white);
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'a ',
          },
        }).instance,
      ).blankSpaces.icon.props.color,
    ).toBe(colors.whiteTsp2);
  });

  it('should display validation when the password have special characters', () => {
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'testpassword@',
          },
        }).instance,
      ).specialCharacters.icon.props.color,
    ).toBe(colors.white);
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'testpassword',
          },
        }).instance,
      ).specialCharacters.icon.props.color,
    ).toBe(colors.whiteTsp2);
  });

  it('should display validation when the password have a capital letter', () => {
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'testPassword',
          },
        }).instance,
      ).capitalLetter.icon.props.color,
    ).toBe(colors.white);
    expect(
      getPasswordRequirements(
        createTest({
          defaultValues: {
            password: 'testpassword',
          },
        }).instance,
      ).capitalLetter.icon.props.color,
    ).toBe(colors.whiteTsp2);
  });
});
