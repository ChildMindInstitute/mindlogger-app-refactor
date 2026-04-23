import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { useChangePasswordMutation } from '@app/entities/identity/api/hooks/useChangePasswordMutation';
import { ChangePasswordForm } from '@app/features/change-password/ui/ChangePasswordForm';
import { PasswordErrorKey } from '@app/shared/lib/utils/passwordValidation';

const mockMutate = jest.fn();
const mockReset = jest.fn();
const mockAddErrorBanner = jest.fn();
const mockAddSuccessBanner = jest.fn();
const mockOnChangePasswordSuccess = jest.fn();

let capturedMutationOptions: Record<string, any> = {};

jest.mock('@app/entities/identity/api/hooks/useChangePasswordMutation', () => ({
  useChangePasswordMutation: jest.fn(),
}));

jest.mock('@app/entities/banner/lib/hooks/useBanners', () => ({
  useBanners: () => ({
    addSuccessBanner: mockAddSuccessBanner,
    addErrorBanner: mockAddErrorBanner,
  }),
}));

jest.mock('@app/shared/lib/utils/networkHelpers', () => ({
  executeIfOnline: (fn: () => void) => {
    fn();
  },
}));

function setupMutationMock(
  overrides?: Partial<ReturnType<typeof useChangePasswordMutation>>,
) {
  jest.mocked(useChangePasswordMutation).mockImplementation((options?: any) => {
    capturedMutationOptions = options || {};
    return {
      isLoading: false,
      error: null,
      mutate: mockMutate,
      reset: mockReset,
      ...overrides,
    } as unknown as ReturnType<typeof useChangePasswordMutation>;
  });
}

function renderForm() {
  return render(
    <TamaguiProvider>
      <ChangePasswordForm
        onChangePasswordSuccess={mockOnChangePasswordSuccess}
      />
    </TamaguiProvider>,
  );
}

function fillAndSubmitForm(
  getByPlaceholderText: ReturnType<typeof render>['getByPlaceholderText'],
  getByLabelText: ReturnType<typeof render>['getByLabelText'],
  { prevPassword = 'OldPassword1!', newPassword = 'NewPassword1!' } = {},
) {
  fireEvent.changeText(
    getByPlaceholderText('change_pass_form:cur_pass_placeholder'),
    prevPassword,
  );

  const newPasswordInput = getByPlaceholderText(
    'change_pass_form:new_pass_placeholder',
  );
  fireEvent.changeText(newPasswordInput, newPassword);
  fireEvent(newPasswordInput, 'blur');

  fireEvent.press(getByLabelText('change-password-submit-button'));
}

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedMutationOptions = {};
    setupMutationMock();
  });

  describe('validation', () => {
    it('shows validation errors when submitting with empty fields', async () => {
      const { getByLabelText, getAllByText } = renderForm();

      fireEvent.press(getByLabelText('change-password-submit-button'));

      await waitFor(() => {
        expect(getAllByText('form_item:required')).toHaveLength(2);
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('accepts any non-empty previous password and validates only the new password field', async () => {
      const { getByPlaceholderText, getByLabelText, queryByLabelText } =
        renderForm();

      fireEvent.changeText(
        getByPlaceholderText('change_pass_form:cur_pass_placeholder'),
        'short',
      );

      fireEvent.press(getByLabelText('change-password-submit-button'));

      await waitFor(() => {
        expect(getByLabelText('password-error-text')).toBeTruthy();
      });

      expect(queryByLabelText('prev_password-error-text')).toBeNull();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error when new password is shorter than minimum length', async () => {
      const { getByPlaceholderText, getByLabelText, getByTestId } =
        renderForm();

      fillAndSubmitForm(getByPlaceholderText, getByLabelText, {
        prevPassword: 'OldPassword1!',
        newPassword: 'Ab1!',
      });

      await waitFor(() => {
        expect(getByTestId('password-requirements-title')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error when new password contains blank spaces', async () => {
      const { getByPlaceholderText, getByLabelText, getByTestId } =
        renderForm();

      fillAndSubmitForm(getByPlaceholderText, getByLabelText, {
        prevPassword: 'OldPassword1!',
        newPassword: 'Valid Pass1!',
      });

      await waitFor(() => {
        expect(getByTestId('password-requirements-title')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('shows error when new password does not meet 3 of 4 character type requirements', async () => {
      const { getByPlaceholderText, getByLabelText, getByTestId } =
        renderForm();

      // Only lowercase — meets 1 of 4 character types
      fillAndSubmitForm(getByPlaceholderText, getByLabelText, {
        prevPassword: 'OldPassword1!',
        newPassword: 'alllowercase',
      });

      await waitFor(() => {
        expect(getByTestId('password-requirements-title')).toBeTruthy();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('accepts a password meeting exactly 3 of 4 character types', async () => {
      const { getByPlaceholderText, getByLabelText, getByTestId } =
        renderForm();

      // Uppercase + lowercase + digit — 3 of 4 types, no symbol
      fillAndSubmitForm(getByPlaceholderText, getByLabelText, {
        prevPassword: 'OldPassword1!',
        newPassword: 'ValidPass12',
      });

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          prev_password: 'OldPassword1!',
          password: 'ValidPass12',
        });
      });
    });

    it('shows error then calls mutate after correcting an invalid password', async () => {
      const { getByPlaceholderText, getByLabelText, findByTestId } =
        renderForm();

      fireEvent.changeText(
        getByPlaceholderText('change_pass_form:cur_pass_placeholder'),
        '0123456789',
      );

      const newPasswordInput = getByPlaceholderText(
        'change_pass_form:new_pass_placeholder',
      );
      fireEvent.changeText(newPasswordInput, 'short');
      fireEvent(newPasswordInput, 'blur');

      fireEvent.press(getByLabelText('change-password-submit-button'));

      await findByTestId(PasswordErrorKey.MUST_INCLUDE_UPPERCASE);
      await findByTestId(PasswordErrorKey.MUST_INCLUDE_LOWERCASE);
      await findByTestId(PasswordErrorKey.MUST_INCLUDE_DIGITS);
      await findByTestId(PasswordErrorKey.MUST_INCLUDE_SYMBOL);

      fireEvent.changeText(newPasswordInput, 'ValidPass1!');
      fireEvent(newPasswordInput, 'blur');

      fireEvent.press(getByLabelText('change-password-submit-button'));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          prev_password: '0123456789',
          password: 'ValidPass1!',
        });
      });
    });
  });

  describe('mutation callbacks', () => {
    it('calls onChangePasswordSuccess and shows success banner on mutation success', async () => {
      mockMutate.mockImplementation(() => {
        capturedMutationOptions.onSuccess?.();
      });

      const { getByPlaceholderText, getByLabelText } = renderForm();

      fillAndSubmitForm(getByPlaceholderText, getByLabelText);

      await waitFor(() => {
        expect(mockOnChangePasswordSuccess).toHaveBeenCalled();
        expect(mockAddSuccessBanner).toHaveBeenCalledWith(
          'auth:password_updated',
        );
      });
    });

    it('shows error banner with message when mutation fails', async () => {
      mockMutate.mockImplementation(() => {
        capturedMutationOptions.onError?.({
          evaluatedMessage: 'Something went wrong',
        });
      });

      const { getByPlaceholderText, getByLabelText } = renderForm();

      fillAndSubmitForm(getByPlaceholderText, getByLabelText);

      await waitFor(() => {
        expect(mockAddErrorBanner).toHaveBeenCalledWith('Something went wrong');
      });
    });

    it('shows empty error banner when evaluatedMessage is null', async () => {
      mockMutate.mockImplementation(() => {
        capturedMutationOptions.onError?.({ evaluatedMessage: null });
      });

      const { getByPlaceholderText, getByLabelText } = renderForm();

      fillAndSubmitForm(getByPlaceholderText, getByLabelText);

      await waitFor(() => {
        expect(mockAddErrorBanner).toHaveBeenCalledWith('');
      });
    });
  });

  describe('loading state', () => {
    it('disables submit button when mutation is loading', () => {
      setupMutationMock({
        isLoading: true,
      } as any);

      const { getByTestId } = renderForm();

      const submitButton = getByTestId('submit-button');
      expect(submitButton.props.accessibilityState?.disabled).toBe(true);
    });
  });
});
