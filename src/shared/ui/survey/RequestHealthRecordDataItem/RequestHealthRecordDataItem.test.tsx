import React from 'react';

import renderer from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { RadioGroup } from '@app/shared/ui/base';

import {
  RequestHealthRecordDataConfig,
  RequestHealthRecordDataItem,
} from './RequestHealthRecordDataItem';

const mockConfig: RequestHealthRecordDataConfig = {
  optInOutOptions: [
    {
      id: 'opt_in',
      label: 'I agree to share my data',
    },
    {
      id: 'opt_out',
      label: "I don't want to share my data",
    },
  ],
};

describe('RequestHealthRecordDataItem', () => {
  let onChangeMock: jest.Mock;
  let textReplacerMock: jest.Mock;

  beforeEach(() => {
    onChangeMock = jest.fn();
    textReplacerMock = jest.fn((text: string) => text);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial empty state', () => {
    const component = renderer.create(
      <TamaguiProvider>
        <RequestHealthRecordDataItem
          config={mockConfig}
          onChange={onChangeMock}
          question="Would you like to share your health record data?"
          textReplacer={textReplacerMock}
        />
      </TamaguiProvider>,
    );

    expect(component).toBeTruthy();

    const radioGroup = component.root.findByType(RadioGroup);
    expect(radioGroup).toBeTruthy();

    const radioItems = component.root.findAllByType(RadioGroup.Item);
    expect(radioItems.length).toBe(2);

    expect(radioGroup.props.value).toBe('');
  });

  it('properly selects an option', () => {
    const component = renderer.create(
      <TamaguiProvider>
        <RequestHealthRecordDataItem
          config={mockConfig}
          onChange={onChangeMock}
          question="Would you like to share your health record data?"
          textReplacer={textReplacerMock}
        />
      </TamaguiProvider>,
    );

    const radioItems = component.root.findAllByType(RadioGroup.Item);
    const optInRadio = radioItems[0];

    optInRadio.props.onPress();

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'opt_in',
        text: 'I agree to share my data',
      }),
    );
  });

  it('renders with initial value when provided', () => {
    const component = renderer.create(
      <TamaguiProvider>
        <RequestHealthRecordDataItem
          config={mockConfig}
          onChange={onChangeMock}
          initialValue="opt_in"
          question="Would you like to share your health record data?"
          textReplacer={textReplacerMock}
        />
      </TamaguiProvider>,
    );

    const radioGroup = component.root.findByType(RadioGroup);
    expect(radioGroup.props.value).toBe('opt_in');
  });
});
