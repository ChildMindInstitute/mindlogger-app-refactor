import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import ReactQueryProvider from '@app/app/ui/AppProvider/ReactQueryProvider';
import { reduxStore } from '@app/app/ui/AppProvider/ReduxProvider';
import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import { PasswordRequirement } from '@app/shared/ui/form/PasswordRequirements';

import { SignUpForm } from '../SignUpForm';

// RENAMED IN ORDER TO EXCLUDE IT FROM TEST SUITES
// IT CONTAINS ERRORS

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

describe('SignUp', () => {
  let tree: renderer.ReactTestRenderer;
  let instance: renderer.ReactTestInstance;
  let getRequirements: () => renderer.ReactTestInstance[];

  beforeEach(() => {
    const testInstance = createTest();
    tree = testInstance.tree;
    instance = testInstance.instance;
    getRequirements = testInstance.getRequirements;
  });

  afterEach(() => {
    tree.unmount();
  });

  describe('SignUpForm', () => {
    it('should render properly', () => {
      expect(tree).toMatchSnapshot();
    });
  });

  describe('SignUpPasswordRequirements', () => {
    it('should render properly after password input focus', () => {
      act(() => {
        instance.findByProps({ name: 'password' }).props.onFocus();
      });
      expect(tree).toMatchSnapshot();
    });

    it('should validate password requirements', () => {
      act(() => {
        instance.findByProps({ name: 'password' }).props.onFocus();
      });
      const requirements = getRequirements();
      expect(requirements[0].props.isValid).toBe(false);
      expect(requirements[1].props.isValid).toBe(false);
    });
  });
});
