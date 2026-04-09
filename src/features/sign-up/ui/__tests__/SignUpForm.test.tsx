import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { useRegistrationMutation } from '@app/features/sign-up/model/hooks/useRegistrationMutation';
import { SignUpForm } from '@app/features/sign-up/ui/SignUpForm';
import { BaseError } from '@app/shared/api/types';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    LinearTransition: {},
  };
});

const mockMutate = jest.fn();
const mockReset = jest.fn();
const mockOnLoginSuccess = jest.fn();

jest.mock('@app/features/sign-up/model/hooks/useRegistrationMutation', () => ({
  useRegistrationMutation: jest.fn(),
}));

jest.mock('@app/shared/lib/utils/networkHelpers', () => ({
  executeIfOnline: (fn: () => void) => {
    fn();
  },
}));

function setupMutationMock(
  overrides?: Partial<ReturnType<typeof useRegistrationMutation>>,
) {
  jest.mocked(useRegistrationMutation).mockReturnValue({
    isLoading: false,
    error: undefined,
    mutate: mockMutate,
    reset: mockReset,
    ...overrides,
  } as unknown as ReturnType<typeof useRegistrationMutation>);
}

function renderForm() {
  return render(
    <TamaguiProvider>
      <SignUpForm onLoginSuccess={mockOnLoginSuccess} />
    </TamaguiProvider>,
  );
}

function fillValidForm(
  getByLabelText: ReturnType<typeof render>['getByLabelText'],
) {
  fireEvent.changeText(
    getByLabelText('signup-email-input'),
    'user@example.com',
  );
  fireEvent.changeText(getByLabelText('signup-first-name-input'), 'Jane');
  fireEvent.changeText(getByLabelText('signup-last-name-input'), 'Doe');

  const passwordInput = getByLabelText('signup-password-input');
  fireEvent.changeText(passwordInput, 'ValidPass1!');
  fireEvent(passwordInput, 'blur');
}

const mockRegistrationError: BaseError = {
  code: 'ERR_BAD_REQUEST',
  message: 'Error',
  response: {
    status: 400,
    data: { result: [] },
  },
  evaluatedMessage: 'identity_error:email_already_registered',
};

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMutationMock();
  });

  describe('validation', () => {
    it('shows validation errors when submitting with empty fields', async () => {
      const { getByLabelText } = renderForm();

      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(getByLabelText('email-error-text')).toBeTruthy();
        expect(getByLabelText('password-error-text')).toBeTruthy();
        expect(getByLabelText('firstName-error-text')).toBeTruthy();
        expect(getByLabelText('lastName-error-text')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error for an invalid email format', async () => {
      const { getByLabelText } = renderForm();

      fillValidForm(getByLabelText);
      fireEvent.changeText(
        getByLabelText('signup-email-input'),
        'not-an-email',
      );

      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(getByLabelText('email-error-text')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error when first name is empty', async () => {
      const { getByLabelText } = renderForm();

      fireEvent.changeText(
        getByLabelText('signup-email-input'),
        'user@example.com',
      );
      fireEvent.changeText(getByLabelText('signup-last-name-input'), 'Doe');
      const passwordInput = getByLabelText('signup-password-input');
      fireEvent.changeText(passwordInput, 'ValidPass1!');
      fireEvent(passwordInput, 'blur');

      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(getByLabelText('firstName-error-text')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error when last name is empty', async () => {
      const { getByLabelText } = renderForm();

      fireEvent.changeText(
        getByLabelText('signup-email-input'),
        'user@example.com',
      );
      fireEvent.changeText(getByLabelText('signup-first-name-input'), 'Jane');
      const passwordInput = getByLabelText('signup-password-input');
      fireEvent.changeText(passwordInput, 'ValidPass1!');
      fireEvent(passwordInput, 'blur');

      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(getByLabelText('lastName-error-text')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error then calls mutate after correcting an invalid password', async () => {
      const { getByLabelText } = renderForm();

      fireEvent.changeText(
        getByLabelText('signup-email-input'),
        'user@example.com',
      );
      fireEvent.changeText(getByLabelText('signup-first-name-input'), 'Jane');
      fireEvent.changeText(getByLabelText('signup-last-name-input'), 'Doe');

      const passwordInput = getByLabelText('signup-password-input');
      fireEvent.changeText(passwordInput, 'short');
      fireEvent(passwordInput, 'blur');

      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(getByLabelText('password-error-text')).toBeTruthy();
      });

      fireEvent.changeText(passwordInput, 'ValidPass1!');
      fireEvent(passwordInput, 'blur');

      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: 'user@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'ValidPass1!',
        });
      });
    });
  });

  describe('mutation error display', () => {
    it('shows the registration error message when the mutation reports an error', () => {
      setupMutationMock({ error: mockRegistrationError } as any);

      const { getByLabelText, getByText } = renderForm();

      expect(getByLabelText('signup-error-message')).toBeTruthy();
      expect(getByText('identity_error:email_already_registered')).toBeTruthy();
    });

    it('does not show error message when there is no mutation error', () => {
      const { queryByLabelText } = renderForm();

      expect(queryByLabelText('signup-error-message')).toBeNull();
    });
  });

  describe('loading state', () => {
    it('disables submit button when mutation is loading', () => {
      setupMutationMock({ isLoading: true } as any);

      const { getByTestId } = renderForm();

      const submitButton = getByTestId('submit-button');
      expect(submitButton.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('hook integration', () => {
    it('passes onLoginSuccess to the registration mutation hook', () => {
      renderForm();

      expect(useRegistrationMutation).toHaveBeenCalledWith(mockOnLoginSuccess);
    });

    it('calls mutate with all form data on valid submission', async () => {
      const { getByLabelText } = renderForm();

      fillValidForm(getByLabelText);
      fireEvent.press(getByLabelText('sign_up-button'));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: 'user@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'ValidPass1!',
        });
      });
    });
  });
});
