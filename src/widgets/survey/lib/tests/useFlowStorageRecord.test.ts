/* eslint-disable @typescript-eslint/no-unsafe-return */
import { renderHook, screen } from '@testing-library/react-native';
import { MMKV } from 'react-native-mmkv';

import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import {
  FlowState,
  UseFlowStorageArgs,
  useFlowStorageRecord,
} from '../useFlowStorageRecord';

jest.mock('react-native-mmkv', () => ({
  ...jest.requireActual('react-native-mmkv'),
  useMMKVObject: jest.fn().mockImplementation((key: string) => {
    return [
      { name: key },
      (item: FlowState) => upsertFlowStorageRecordMock(item),
    ];
  }),
}));

const deleteMock = jest.fn();

const upsertFlowStorageRecordMock = jest.fn();

const storageMock = {
  getString: (id: string) => JSON.stringify({ flowName: `test-name-${id}` }),
  delete: (key: string) => deleteMock(key) as void,
  addOnValueChangedListener: jest.fn(),
} as never as MMKV;

const initialProps = {
  appletId: 'mock-applet-id-1',
  eventId: 'mock-event-id-1',
  flowId: 'mock-flow-id-1',
  targetSubjectId: null as string | null,
};

describe('Test useFlowStorageRecord', () => {
  beforeEach(() => {
    const storageManager = getDefaultStorageInstanceManager();
    jest
      .spyOn(storageManager, 'getFlowProgressStorage')
      .mockReturnValue(storageMock);
  });

  afterEach(() => {
    screen.unmount();
  });

  it('Should return storage record', () => {
    const { result } = renderHook(
      (input: UseFlowStorageArgs) => useFlowStorageRecord(input),
      { initialProps },
    );

    expect(result.current.flowStorageRecord).toEqual({
      name: 'mock-flow-id-1-mock-applet-id-1-mock-event-id-1-NULL',
    });
  });

  it('Should return storage record when flowId not passed', () => {
    const { result } = renderHook(
      (input: UseFlowStorageArgs) => useFlowStorageRecord(input),
      {
        initialProps: {
          appletId: 'mock-applet-id-3',
          eventId: 'mock-event-id-3',
          targetSubjectId: null,
        },
      },
    );

    expect(result.current.flowStorageRecord).toEqual({
      name: 'default_one_step_flow-mock-applet-id-3-mock-event-id-3-NULL',
    });
  });

  it('Should return the another storage record after re-render', () => {
    const { result, rerender } = renderHook(
      (input: UseFlowStorageArgs) => useFlowStorageRecord(input),
      { initialProps },
    );

    rerender({
      appletId: 'mock-applet-id-2',
      eventId: 'mock-event-id-2',
      flowId: 'mock-flow-id-2',
      targetSubjectId: null,
    });

    expect(result.current.flowStorageRecord).toEqual({
      name: 'mock-flow-id-2-mock-applet-id-2-mock-event-id-2-NULL',
    });
  });

  it('Should upsert storage record', () => {
    const { result } = renderHook(
      (input: UseFlowStorageArgs) => useFlowStorageRecord(input),
      { initialProps },
    );

    result.current.upsertFlowStorageRecord({
      flowName: 'test-name-1',
    } as FlowState);

    expect(upsertFlowStorageRecordMock).toHaveBeenCalledWith({
      flowName: 'test-name-1',
    });
  });

  it('Should clear storage record', () => {
    const { result } = renderHook(
      (input: UseFlowStorageArgs) => useFlowStorageRecord(input),
      { initialProps },
    );

    result.current.clearFlowStorageRecord();

    expect(deleteMock).toHaveBeenCalledWith(
      'mock-flow-id-1-mock-applet-id-1-mock-event-id-1-NULL',
    );
  });

  it('Should retrieve storage record', () => {
    const { result } = renderHook(
      (input: UseFlowStorageArgs) => useFlowStorageRecord(input),
      { initialProps },
    );

    const record = result.current.getCurrentFlowStorageRecord();

    expect(record).toEqual({
      flowName:
        'test-name-mock-flow-id-1-mock-applet-id-1-mock-event-id-1-NULL',
    });
  });
});
