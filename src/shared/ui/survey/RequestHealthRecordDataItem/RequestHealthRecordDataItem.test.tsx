import React, { PropsWithChildren } from 'react';

import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import {
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import {
  EHRConsent,
  RequestHealthRecordDataAnswerSettings,
} from '@app/shared/api/services/ActivityItemDto';
import { RadioGroup } from '@app/shared/ui/base';
import { ViewSliderProps } from '@app/shared/ui/ViewSlider';

import { RequestHealthRecordDataItem } from './RequestHealthRecordDataItem';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation((key: string) => key),
    i18n: {
      language: 'en',
    },
  })),
}));

jest.mock('@app/shared/ui/ViewSlider', () => ({
  ViewSlider: jest.fn(({ renderView, step }: ViewSliderProps) =>
    renderView({ index: step }),
  ),
}));

jest.mock('@app/shared/ui/ScrollableContent', () => ({
  ScrollableContent: jest.fn(({ children }: PropsWithChildren) => children),
}));

const mockConfig: RequestHealthRecordDataAnswerSettings = {
  optInOutOptions: [
    {
      id: EHRConsent.OptIn,
      label: 'Yes, I agree to share my health data',
    },
    {
      id: EHRConsent.OptOut,
      label: 'No, I do not want to share my health data',
    },
  ],
};

const mockQuestion = 'Would you like to share your health record data?';

const mockItem: RequestHealthRecordDataPipelineItem = {
  type: 'RequestHealthRecordData',
  question: mockQuestion,
  timer: 0,
  subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
  payload: mockConfig,
  additionalEHRs: null,
};

const onChangeMock = jest.fn();
const textReplacerMock = jest.fn((text: string) => text);

describe('RequestHealthRecordDataItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no selection initially', () => {
    const component = render(
      <TamaguiProvider>
        <RequestHealthRecordDataItem
          item={mockItem}
          onChange={onChangeMock}
          textReplacer={textReplacerMock}
          assignment={null}
        />
      </TamaguiProvider>,
    );

    expect(component).toBeTruthy();

    const radioGroup = component.root.findByType(RadioGroup);
    expect(radioGroup).toBeTruthy();

    const radioItems = component.root.findAllByType(RadioGroup.Item);
    expect(radioItems.length).toBe(2);

    expect(radioGroup.props.value).toBe('');

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('renders with initial value selected', () => {
    const component = render(
      <TamaguiProvider>
        <RequestHealthRecordDataItem
          item={mockItem}
          onChange={onChangeMock}
          responseValue={EHRConsent.OptIn}
          textReplacer={textReplacerMock}
          assignment={null}
        />
      </TamaguiProvider>,
    );

    // Verify RadioGroup has the initial value
    const radioGroup = component.root.findByType(RadioGroup);
    expect(radioGroup.props.value).toBe(EHRConsent.OptIn);
  });
});
