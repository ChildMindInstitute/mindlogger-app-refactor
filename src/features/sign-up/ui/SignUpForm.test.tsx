import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import ReactQueryProvider from '@app/app/ui/AppProvider/ReactQueryProvider';
import { reduxStore } from '@app/app/ui/AppProvider/ReduxProvider';
import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { PasswordRequirement } from '@app/shared/ui/form/PasswordRequirements';

import { SignUpForm } from './SignUpForm';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

jest.mock('@shared/lib', () => ({
  ...jest.requireActual('@shared/lib'),
  useSystemBootUp: jest.fn(() => ({
    onModuleInitialized: jest.fn(),
  })),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(async () => ({
    isConnected: true,
  })),
}));

jest.mock('@app/shared/ui/icons', () => ({
  ...jest.requireActual('@app/shared/ui/icons'),
  FeatherCrossIcon: () => 'x',
  FeatherCheckIcon: () => 'ok',
}));

/* Test helper functions */

const FormTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <TamaguiProvider>
        <Provider store={reduxStore}>{children}</Provider>
      </TamaguiProvider>
    </ReactQueryProvider>
  );
};

const createTest = () => {
  const tree = renderer.create(
    <FormTestWrapper>
      <SignUpForm onLoginSuccess={() => {}} />
    </FormTestWrapper>,
  );
  const getRequirements = () => tree.root.findAllByType(PasswordRequirement);
  return { tree, instance: tree.root, getRequirements };
};

describe('SignUp Form', () => {
  it('should render properly', () => {
    const { tree, instance } = createTest();
    act(() => {
      /* display password requirements */
      instance.findByProps({ name: 'password' }).props.onFocus();
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it.todo('should validate password requirements');
});
