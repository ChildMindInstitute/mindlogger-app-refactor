/* eslint-disable no-nested-ternary */
import { AnswersQueueService, UploadItem } from '../AnswersQueueService';

const notifyMock = { notify: () => {} };

const getAllKeysMock = jest.fn();
const getStringMock = jest.fn();
const setMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('@shared/lib/storages', () => ({
  createStorage: jest.fn(),
  createSecureStorage: jest.fn().mockReturnValue({
    addOnValueChangedListener: jest.fn().mockImplementation((f: () => void) => {
      f();
    }),
    getAllKeys: () => getAllKeysMock() as Array<string>,
    getString: (id: string) => getStringMock(id) as string,
    set: (key: string, item: UploadItem) => setMock(key, item) as void,
    delete: (key: string) => deleteMock(key) as void,
  }),
}));

describe('Test AnswersQueueService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should pick an object when some keys exist', () => {
    getAllKeysMock.mockReturnValue(['10', '15', '7']);

    getStringMock.mockReturnValue(
      JSON.stringify({
        input: {
          activityId: 'mock-activity-id-1',
        },
      } as UploadItem),
    );

    const uploadService = new AnswersQueueService(notifyMock);

    const result = uploadService.pick();

    expect(result).toEqual({ input: { activityId: 'mock-activity-id-1' } });

    expect(getStringMock).toHaveBeenCalledWith('7');
  });

  it('Should pick null when no keys', () => {
    getAllKeysMock.mockReturnValue([]);

    const uploadService = new AnswersQueueService(notifyMock);

    const result = uploadService.pick();

    expect(result).toEqual(null);

    expect(getStringMock).toHaveBeenCalledTimes(0);
  });

  it('Should enqueue an object when some keys exist', () => {
    getAllKeysMock.mockReturnValue(['10', '15', '7']);

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.enqueue({
      input: {
        activityId: 'mock-activity-id-2',
      },
    } as UploadItem);

    expect(setMock).toHaveBeenCalledTimes(1);

    expect(setMock).toHaveBeenCalledWith(
      '16',
      '{"input":{"activityId":"mock-activity-id-2"}}',
    );
  });

  it('Should enqueue an object when no keys', () => {
    getAllKeysMock.mockReturnValue([]);

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.enqueue({
      input: {
        activityId: 'mock-activity-id-3',
      },
    } as UploadItem);

    expect(setMock).toHaveBeenCalledTimes(1);

    expect(setMock).toHaveBeenCalledWith(
      '1',
      '{"input":{"activityId":"mock-activity-id-3"}}',
    );
  });

  it('Should dequeue an object when some keys exist', () => {
    getAllKeysMock.mockReturnValue(['10', '15', '7']);

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.dequeue();

    expect(deleteMock).toHaveBeenCalledTimes(1);

    expect(deleteMock).toHaveBeenCalledWith('7');
  });

  it('Should not dequeue an object when no keys', () => {
    getAllKeysMock.mockReturnValue([]);

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.dequeue();

    expect(deleteMock).toHaveBeenCalledTimes(0);
  });

  it('Should swap when three different keys exist', () => {
    getAllKeysMock.mockReturnValue(['10', '15', '7']);

    getStringMock.mockImplementation((key: string) =>
      JSON.stringify({
        input: {
          activityId:
            key === '7'
              ? 'mock-activity-id-7'
              : key === '15'
                ? 'mock-activity-id-15'
                : '',
        },
      } as UploadItem),
    );

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.swap();

    expect(setMock).toHaveBeenCalledTimes(2);

    expect(setMock.mock.calls).toEqual([
      ['7', '{"input":{"activityId":"mock-activity-id-15"}}'],
      ['15', '{"input":{"activityId":"mock-activity-id-7"}}'],
    ]);
  });

  it('Should not swap when only one key exist', () => {
    getAllKeysMock.mockReturnValue(['10']);

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.swap();

    expect(setMock).toHaveBeenCalledTimes(0);
  });

  it('Should not swap when no keys', () => {
    getAllKeysMock.mockReturnValue([]);

    const uploadService = new AnswersQueueService(notifyMock);

    uploadService.swap();

    expect(setMock).toHaveBeenCalledTimes(0);
  });

  it('Should return number of keys', () => {
    getAllKeysMock.mockReturnValue(['10', '15', '7']);

    const uploadService = new AnswersQueueService(notifyMock);

    const result = uploadService.getLength();

    expect(result).toEqual(3);
  });
});
