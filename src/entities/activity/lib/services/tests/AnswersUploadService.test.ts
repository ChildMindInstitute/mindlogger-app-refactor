import { FileSystem } from 'react-native-file-access';

import { IUserPrivateKeyRecord } from '@app/entities/identity/lib/IUserPrivateKeyRecord';
import { getDefaultUserPrivateKeyRecord } from '@app/entities/identity/lib/userPrivateKeyRecordInstance';
import { getDefaultAnswerService } from '@app/shared/api/services/answerServiceInstance';
import {
  ActivityAnswersRequest,
  AnswerDto,
  IAnswerService,
  UserActionDto,
} from '@app/shared/api/services/IAnswerService';
import { getDefaultEncryptionManager } from '@app/shared/lib/encryption/encryptionManagerInstance';
import { IEncryptionManager } from '@app/shared/lib/encryption/IEncryptionManager';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { MediaFile } from '@app/shared/ui/survey/MediaItems/types';
import { IAnswersUploadService } from '@entities/activity/lib/services/IAnswersUploadService';

import { SendAnswersInput } from '../../types/uploadAnswers';
import { AnswersUploadService } from '../AnswersUploadService';
import { getDefaultAnswersUploadService } from '../answersUploadServiceInstance';
import { IMediaFilesCleaner } from '../IMediaFilesCleaner';
import { getDefaultMediaFilesCleaner } from '../mediaFilesCleanerInstance';

type ITestAnswersUploadService = IAnswersUploadService & {
  createdAt: number | null;
  getUploadRecord: AnswersUploadService['getUploadRecord'];
  collectFileIds: AnswersUploadService['collectFileIds'];
  processFileUpload: AnswersUploadService['processFileUpload'];
  uploadAllMediaFiles: AnswersUploadService['uploadAllMediaFiles'];
  uploadAnswers: AnswersUploadService['uploadAnswers'];
  encryptAnswers: AnswersUploadService['encryptAnswers'];
  assignRemoteUrlsToUserActions: AnswersUploadService['assignRemoteUrlsToUserActions'];
};

describe('AnswersUploadService', () => {
  const MOCK_CREATED_AT = +new Date();

  let logger: ILogger;
  let userPrivateKeyRecord: IUserPrivateKeyRecord;
  let answerService: IAnswerService;
  let answersUploadService: ITestAnswersUploadService;
  let mediaFileCleaner: IMediaFilesCleaner;

  beforeEach(() => {
    logger = getDefaultLogger();
    jest.spyOn(logger, 'log').mockImplementation(() => {});

    userPrivateKeyRecord = getDefaultUserPrivateKeyRecord();

    answerService = getDefaultAnswerService();

    answersUploadService =
      getDefaultAnswersUploadService() as never as ITestAnswersUploadService;
    answersUploadService.createdAt = MOCK_CREATED_AT;

    mediaFileCleaner = getDefaultMediaFilesCleaner();
  });

  describe('getUploadRecord function', () => {
    it('should return the correct upload record', () => {
      const uploadResults = [
        { uploaded: true, fileId: 'fileId1', remoteUrl: 'url1' },
        { uploaded: false, fileId: 'fileId2', remoteUrl: null },
        { uploaded: true, fileId: 'fileId3', remoteUrl: 'url3' },
      ];

      const fileId = 'fileId2';

      const result = answersUploadService.getUploadRecord(
        uploadResults,
        fileId,
      );

      expect(result).toEqual({
        uploaded: false,
        fileId: 'fileId2',
        remoteUrl: null,
      });
    });

    it('should return undefined if upload record is not found', () => {
      const uploadResults = [
        { uploaded: true, fileId: 'fileId1', remoteUrl: 'url1' },
        { uploaded: true, fileId: 'fileId2', remoteUrl: 'url2' },
      ];

      const fileId = 'fileId3';

      const result = answersUploadService.getUploadRecord(
        uploadResults,
        fileId,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('collectFileIds function', () => {
    it('should collect fileIds from media answers', () => {
      const answers = [
        { value: 'text answer' },
        {
          value: {
            uri: 'file:///path/to/image.jpg',
            fileName: 'image.jpg',
          },
        },
        {
          value: {
            uri: '/absolute/path/to/video.mp4',
            fileName: 'video.mp4',
          },
        },
        { value: 'another text answer' },
        {
          value: {
            uri: 'file:///path/to/audio.m4a',
            fileName: 'audio.m4a',
          },
        },
      ] as AnswerDto[];

      const mockIsFileUrl = jest.fn(url => {
        if (
          url === 'file:///path/to/image.jpg' ||
          url === '/absolute/path/to/video.mp4' ||
          url === 'file:///path/to/audio.m4a'
        ) {
          return true;
        } else {
          return false;
        }
      });
      jest
        .spyOn(answersUploadService as never, 'isFileUrl')
        .mockImplementation(mockIsFileUrl as never);

      const result = answersUploadService.collectFileIds(answers);

      expect(result).toEqual([
        `${MOCK_CREATED_AT}/image.jpg`,
        `${MOCK_CREATED_AT}/video.mp4`,
        `${MOCK_CREATED_AT}/audio.m4a`,
      ]);
    });

    it('should not collect fileIds for non-media or invalid files answers', () => {
      const answers = [
        { value: 'text answer' },
        { value: { uri: 'http://example.com/image.jpg' } },
        { value: 'another text answer' },
      ] as AnswerDto[];

      const result = answersUploadService.collectFileIds(answers);

      expect(result).toEqual([]);
    });
  });

  jest.mock('react-native-file-access', () => ({
    exists: jest.fn(),
  }));

  describe('processFileUpload function', () => {
    it('should throw an error for non-existing local file', async () => {
      jest.spyOn(FileSystem, 'exists').mockResolvedValue(false);

      const mediaAnswer = { uri: 'file:///non/existing/file.jpg' } as MediaFile;
      const uploadResults = [
        { fileId: 'fileId1', uploaded: false, remoteUrl: null },
      ];

      await expect(
        answersUploadService.processFileUpload(
          mediaAnswer,
          uploadResults,
          0,
          'mock-applet-id',
        ),
      ).rejects.toThrow(/does not exist/);
    });

    it('should throw an error for missing upload record', async () => {
      jest.spyOn(FileSystem, 'exists').mockResolvedValue(true);

      const mediaAnswer = { uri: 'file:///path/to/image.jpg' } as MediaFile;
      const uploadResults = [
        { fileId: 'fileId1', uploaded: false, remoteUrl: null },
      ];

      await expect(
        answersUploadService.processFileUpload(
          mediaAnswer,
          uploadResults,
          0,
          'mock-applet-id',
        ),
      ).rejects.toThrow(/uploadRecord does not exist/);
    });
  });

  it('should upload media files and update answers', async () => {
    jest.spyOn(FileSystem, 'exists').mockResolvedValue(true);

    const answers = [
      {
        value: {
          uri: 'file:///path/to/image.jpg',
          fileName: 'image.jpg',
          type: 'image/jpeg',
        },
      },
      { value: 'text answer' },
      {
        value: {
          uri: 'file:///path/to/video.mp4',
          fileName: 'video.mp4',
          type: 'video/mp4',
        },
      },
    ] as AnswerDto[];

    const fakeUploadResults = [
      {
        uploaded: true,
        fileId: `${MOCK_CREATED_AT}/path/to/image.jpg`,
        remoteUrl: 'https://example.com/uploads/image.jpg',
      },
      {
        uploaded: true,
        fileId: `${MOCK_CREATED_AT}/path/to/video.mp4`,
        remoteUrl: 'https://example.com/uploads/video.mp4',
      },
    ];

    const mockCheckIfFilesUploaded = jest
      .fn()
      .mockResolvedValue(fakeUploadResults);
    jest
      .spyOn(answersUploadService as never, 'checkIfFilesUploaded')
      .mockImplementation(mockCheckIfFilesUploaded as never);

    const mockProcessFileUpload = jest
      .fn()
      .mockResolvedValue('https://example.com/modified-answer.jpg');
    jest
      .spyOn(answersUploadService as never, 'processFileUpload')
      .mockImplementation(mockProcessFileUpload as never);

    const mockIsFileUrl = jest.fn(url => {
      if (
        url === 'file:///path/to/image.jpg' ||
        url === 'file:///path/to/video.mp4'
      ) {
        return true;
      } else {
        return false;
      }
    });
    jest
      .spyOn(answersUploadService as never, 'isFileUrl')
      .mockImplementation(mockIsFileUrl as never);

    const modifiedBody = {
      answers,
      appletId: '1e631d7f-2ce8-4ec0-be52-c77092bd203e',
    } as SendAnswersInput;

    const result = await answersUploadService.uploadAllMediaFiles(modifiedBody);

    expect(mockCheckIfFilesUploaded).toHaveBeenCalledWith(
      [`${MOCK_CREATED_AT}/image.jpg`, `${MOCK_CREATED_AT}/video.mp4`],
      '1e631d7f-2ce8-4ec0-be52-c77092bd203e',
    );
    expect(mockProcessFileUpload).toHaveBeenCalledTimes(2); // 2 media files
    expect(result.answers).toEqual([
      { value: 'https://example.com/modified-answer.jpg' },
      { value: 'text answer' }, // Unchanged text answer
      { value: 'https://example.com/modified-answer.jpg' },
    ]);
  });

  it('should handle no media files to upload', async () => {
    const answers = [
      { value: 'text answer' },
      { value: 'another text answer' },
    ] as AnswerDto[];

    const modifiedBody = {
      answers,
    } as SendAnswersInput;

    const result = await answersUploadService.uploadAllMediaFiles(modifiedBody);

    expect(result.answers).toEqual(answers); // Answers should remain unchanged
  });
  it('should handle file upload errors', async () => {
    jest.spyOn(FileSystem, 'exists').mockResolvedValue(true);

    const answers = [
      {
        value: {
          uri: 'file:///path/to/image.jpg',
          fileName: 'image.jpg',
          type: 'image/jpeg',
        },
      },
      {
        value: { text: 'Some text' },
      },
    ];

    const fakeUploadResults = [
      { uploaded: false, fileId: 'fileId1', remoteUrl: null },
    ];

    const mockCheckIfFilesUploaded = jest
      .fn()
      .mockResolvedValue(fakeUploadResults);
    jest
      .spyOn(answersUploadService as never, 'checkIfFilesUploaded')
      .mockImplementation(mockCheckIfFilesUploaded as never);

    const mockProcessFileUpload = jest
      .fn()
      .mockRejectedValue(
        new Error(
          '[UploadAnswersService.mockProcessFileUpload]: Error occurred while file uploading',
        ),
      );
    jest
      .spyOn(answersUploadService as never, 'processFileUpload')
      .mockImplementation(mockProcessFileUpload as never);

    const modifiedBody = {
      answers,
    } as SendAnswersInput;

    await expect(
      answersUploadService.uploadAllMediaFiles(modifiedBody),
    ).rejects.toThrow(
      '[UploadAnswersService.mockProcessFileUpload]: Error occurred while file uploading',
    );
  });

  it('should upload answers successfully', async () => {
    const encryptedData = {
      activityId: 'activity123',
      appletId: 'applet123',
      flowId: 'flow123',
      createdAt: 1234567890,
    } as ActivityAnswersRequest;

    const mockCheckIfAnswersUploaded = jest.fn().mockResolvedValueOnce(false);
    jest
      .spyOn(answersUploadService as never, 'checkIfAnswersUploaded')
      .mockImplementation(mockCheckIfAnswersUploaded as never);

    const mockSendActivityAnswers = jest.fn(() => {
      jest
        .spyOn(answersUploadService as never, 'checkIfAnswersUploaded')
        .mockResolvedValueOnce(true as never);
    });
    jest
      .spyOn(answerService, 'sendActivityAnswers')
      .mockImplementation(mockSendActivityAnswers as never);

    await answersUploadService.uploadAnswers(encryptedData);

    expect(mockCheckIfAnswersUploaded).toHaveBeenCalledWith({
      activityId: 'activity123',
      appletId: 'applet123',
      flowId: 'flow123',
      createdAt: 1234567890,
    });
    expect(mockSendActivityAnswers).toHaveBeenCalledWith(encryptedData);
  });

  it('should handle sendActivityAnswers error', async () => {
    const encryptedData = {
      activityId: 'activity123',
      appletId: 'applet123',
      flowId: 'flow123',
      createdAt: 1234567890,
    } as ActivityAnswersRequest;

    const mockCheckIfAnswersUploaded = jest.fn().mockResolvedValueOnce(false);
    jest
      .spyOn(answersUploadService as never, 'checkIfAnswersUploaded')
      .mockImplementation(mockCheckIfAnswersUploaded as never);

    const sendError = new Error('Any network layer error');
    const mockSendActivityAnswers = jest.fn().mockRejectedValue(sendError);
    jest
      .spyOn(answerService, 'sendActivityAnswers')
      .mockImplementation(mockSendActivityAnswers as never);

    await expect(
      answersUploadService.uploadAnswers(encryptedData),
    ).rejects.toThrow(/Error occurred while sending answers/);

    expect(mockCheckIfAnswersUploaded).toHaveBeenCalledWith({
      activityId: 'activity123',
      appletId: 'applet123',
      flowId: 'flow123',
      createdAt: 1234567890,
    });

    expect(mockSendActivityAnswers).toHaveBeenCalledWith(encryptedData);
  });

  it('should handle already uploaded answers', async () => {
    const encryptedData = {
      activityId: 'activity123',
      appletId: 'applet123',
      flowId: 'flow123',
      createdAt: 1234567890,
    } as ActivityAnswersRequest;

    const mockCheckIfAnswersUploaded = jest.fn().mockResolvedValueOnce(true);
    jest
      .spyOn(answersUploadService as never, 'checkIfAnswersUploaded')
      .mockImplementation(mockCheckIfAnswersUploaded as never);

    const mockSendActivityAnswers = jest.fn();
    jest
      .spyOn(answerService, 'sendActivityAnswers')
      .mockImplementation(mockSendActivityAnswers as never);

    await answersUploadService.uploadAnswers(encryptedData);

    expect(mockCheckIfAnswersUploaded).toHaveBeenCalledWith({
      activityId: 'activity123',
      appletId: 'applet123',
      flowId: 'flow123',
      createdAt: 1234567890,
    });
    expect(mockSendActivityAnswers).not.toHaveBeenCalled();
  });

  it('should handle missing private key', () => {
    const data = {
      appletEncryption: {
        prime: 'prime123',
        base: 'base123',
      },
      answers: [{ value: 'answer1' }],
      userActions: [] as UserActionDto[],
      userIdentifier: 'user123',
    } as SendAnswersInput;

    jest.spyOn(userPrivateKeyRecord, 'get').mockReturnValue(undefined);

    expect(() => answersUploadService.encryptAnswers(data)).toThrow(
      'Error occurred while preparing answers',
    );
  });

  describe('assignRemoteUrlsToUserActions function', () => {
    it('should assign remote URLs to user actions', () => {
      const originalAnswers = [
        {
          value: {
            uri: 'file:///path/to/image.jpg',
            fileName: 'image.jpg',
            type: 'image/jpeg',
          },
        },
        { value: 'text answer' },
      ] as AnswerDto[];

      const modifiedBody = {
        answers: [
          { value: 'https://example.com/modified-answer.jpg' },
          { value: 'text answer' },
        ],
        userActions: [
          {
            type: 'SET_ANSWER',
            response: { value: { uri: 'file:///path/to/image.jpg' } },
          },
          { type: 'SET_ANSWER', response: { value: 'text answer' } },
        ],
      } as SendAnswersInput;

      const updatedUserActions =
        answersUploadService.assignRemoteUrlsToUserActions(
          originalAnswers,
          modifiedBody,
        );

      expect(updatedUserActions[0]?.response).toHaveProperty(
        'value',
        'https://example.com/modified-answer.jpg',
      );
      expect(updatedUserActions[1]?.response).toHaveProperty(
        'value',
        'text answer',
      );
    });

    it('should handle SVG files', () => {
      const originalAnswers = [
        {
          value: {
            uri: 'file:///path/to/image.svg',
            fileName: 'image.svg',
            type: 'image/svg',
          },
        },
      ] as AnswerDto[];

      const modifiedBody = {
        answers: [{ value: 'https://example.com/modified-answer.svg' }],
        userActions: [
          {
            type: 'SET_ANSWER',
            response: { value: { uri: 'file:///path/to/image.svg' } },
          },
        ],
      } as SendAnswersInput;

      const updatedUserActions =
        answersUploadService.assignRemoteUrlsToUserActions(
          originalAnswers,
          modifiedBody,
        );

      expect(updatedUserActions[0]?.response).toHaveProperty(
        'value',
        'https://example.com/modified-answer.svg',
      );
    });

    it('should handle SVG files and non-SVG files together', () => {
      const originalAnswers = [
        {
          value: {
            uri: 'file:///path/to/image.jpg',
            fileName: 'image.jpg',
            type: 'image/jpeg',
          },
        },
        {
          value: {
            uri: 'file:///path/to/image.svg',
            fileName: 'image.svg',
            type: 'image/svg',
          },
        },
      ] as AnswerDto[];

      const modifiedBody = {
        answers: [
          { value: 'https://example.com/modified-answer.jpg' },
          { value: 'https://example.com/modified-answer.svg' },
        ],
        userActions: [
          {
            type: 'SET_ANSWER',
            response: { value: { uri: 'file:///path/to/image.jpg' } },
          },
          {
            type: 'SET_ANSWER',
            response: { value: { uri: 'file:///path/to/image.svg' } },
          },
        ],
      } as SendAnswersInput;

      const updatedUserActions =
        answersUploadService.assignRemoteUrlsToUserActions(
          originalAnswers,
          modifiedBody,
        );

      expect(updatedUserActions[0]?.response).toHaveProperty(
        'value',
        'https://example.com/modified-answer.jpg',
      );
      expect(updatedUserActions[1]?.response).toHaveProperty(
        'value',
        'https://example.com/modified-answer.svg',
      );
    });

    it('should handle SVG URLs missing in modified answers', () => {
      const originalAnswers = [
        {
          value: {
            uri: 'file:///path/to/image.jpg',
            fileName: 'image.jpg',
            type: 'image/jpeg',
          },
        },
        {
          value: {
            uri: 'file:///path/to/image.svg',
            fileName: 'image.svg',
            type: 'image/svg',
          },
        },
      ] as AnswerDto[];

      const modifiedBody = {
        answers: [
          { value: 'https://example.com/modified-answer.jpg' },
          {
            value: 'https://example.com/modified-answer.svg',
            uri: 'file:///path/to/image.svg',
          },
        ],
        userActions: [
          {
            type: 'SET_ANSWER',
            response: { value: { uri: 'file:///path/to/image.jpg' } },
          },
          {
            type: 'SET_ANSWER',
            response: {
              value: { uri: 'file:///path/to/image.svg', type: 'image/svg' },
            },
          },
        ],
      } as SendAnswersInput;

      const updatedUserActions =
        answersUploadService.assignRemoteUrlsToUserActions(
          originalAnswers,
          modifiedBody,
        );

      expect(updatedUserActions[0]?.response).toHaveProperty(
        'value',
        'https://example.com/modified-answer.jpg',
      );
      expect(updatedUserActions[1]?.response).toHaveProperty(
        'uri',
        'file:///path/to/image.svg',
      );
    });

    it('should handle missing user actions', () => {
      const originalAnswers = [
        {
          value: {
            uri: 'file:///path/to/image.jpg',
            fileName: 'image.jpg',
            type: 'image/jpeg',
          },
        },
      ] as AnswerDto[];

      const modifiedBody = {
        answers: [{ value: 'https://example.com/modified-answer.jpg' }],
        userActions: [],
      } as never as SendAnswersInput;

      const updatedUserActions =
        answersUploadService.assignRemoteUrlsToUserActions(
          originalAnswers,
          modifiedBody,
        );

      expect(updatedUserActions).toEqual([]);
    });
  });

  it('should send answers successfully', async () => {
    const body = {
      createdAt: 1234567890,
      answers: [{ value: 'answer1' }, { value: 'answer2' }],
      userActions: [],
      itemIds: ['item1', 'item2'],
    } as never as SendAnswersInput;

    const modifiedBody = {
      createdAt: 1234567890,
      answers: [
        { value: 'https://example.com/modified-answer.jpg' },
        { value: 'text answer' },
      ],
      userActions: [
        {
          type: 'SET_ANSWER',
          response: { value: { uri: 'file:///path/to/image.jpg' } },
        },
        { type: 'SET_ANSWER', response: { value: 'text answer' } },
      ],
      itemIds: ['item1', 'item2'],
    };

    jest
      .spyOn(answersUploadService as never, 'uploadAllMediaFiles')
      .mockResolvedValue(modifiedBody as never);

    const mockAssignRemoteUrlsToUserActions = jest
      .fn()
      .mockReturnValue(modifiedBody.userActions);
    jest
      .spyOn(answersUploadService as never, 'assignRemoteUrlsToUserActions')
      .mockImplementation(mockAssignRemoteUrlsToUserActions as never);

    const mockEncryptAnswers = jest.fn().mockReturnValue('encrypted-data');
    jest
      .spyOn(answersUploadService as never, 'encryptAnswers')
      .mockImplementation(mockEncryptAnswers as never);

    const mockUploadAnswers = jest.fn();
    jest
      .spyOn(answersUploadService as never, 'uploadAnswers')
      .mockImplementation(mockUploadAnswers as never);

    const mockCleanUpByAnswers = jest.fn();
    jest
      .spyOn(mediaFileCleaner, 'cleanUpByAnswers')
      .mockImplementation(mockCleanUpByAnswers);

    await answersUploadService.sendAnswers(body);

    expect(answersUploadService.uploadAllMediaFiles).toHaveBeenCalledWith(body);
    expect(mockAssignRemoteUrlsToUserActions).toHaveBeenCalledWith(
      body.answers,
      modifiedBody,
    );
    expect(mockEncryptAnswers).toHaveBeenCalledWith(modifiedBody);
    expect(mockUploadAnswers).toHaveBeenCalledWith('encrypted-data');
    expect(mockCleanUpByAnswers).toHaveBeenCalledWith(body.answers);
  });

  it('should handle uploadAllMediaFiles error', async () => {
    const body = {
      createdAt: 1234567890,
      answers: [{ value: 'answer1' }, { value: 'answer2' }],
      userActions: [],
      itemIds: ['item1', 'item2'],
    } as never as SendAnswersInput;

    const uploadError = new Error('Uploading media files failed');
    jest
      .spyOn(answersUploadService as never, 'uploadAllMediaFiles')
      .mockImplementation((() => {
        throw uploadError;
      }) as never);

    await expect(answersUploadService.sendAnswers(body)).rejects.toThrow(
      uploadError,
    );
  });
});

describe('AnswersUploadService real example', () => {
  const MOCK_CREATED_AT = +new Date();

  let logger: ILogger;
  let userPrivateKeyRecord: IUserPrivateKeyRecord;
  let encryptionManager: IEncryptionManager;
  let answerService: IAnswerService;
  let answersUploadService: ITestAnswersUploadService;
  let mediaFileCleaner: IMediaFilesCleaner;

  beforeEach(() => {
    logger = getDefaultLogger();
    jest.spyOn(logger, 'log').mockImplementation(() => {});

    userPrivateKeyRecord = getDefaultUserPrivateKeyRecord();

    encryptionManager = getDefaultEncryptionManager();

    answerService = getDefaultAnswerService();

    answersUploadService =
      getDefaultAnswersUploadService() as never as ITestAnswersUploadService;
    answersUploadService.createdAt = MOCK_CREATED_AT;

    mediaFileCleaner = getDefaultMediaFilesCleaner();
  });

  describe('sendAnswers function', () => {
    it('should successfully upload answers with media files', async () => {
      const body = {
        appletId: '1e631d7f-2ce8-4ec0-be52-c77092bd203e',
        createdAt: MOCK_CREATED_AT,
        version: '3.2.0',
        answers: [
          'Lkjjjkh',
          { value: 1 },
          { value: [0] },
          { value: 5 },
          { value: '1' },
          'Kljk',
        ],
        userActions: [
          {
            type: 'SET_ANSWER',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/df667c1a-a626-4f70-8081-95c504e7bfde',
            time: 1692005982379,
            response: 'Lkjjjkh',
          },
          {
            type: 'NEXT',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/df667c1a-a626-4f70-8081-95c504e7bfde',
            time: 1692005983716,
          },
          {
            type: 'SET_ANSWER',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/977c6e6c-dcd8-4cfa-9fe8-8aac7c7f574b',
            time: 1692005984444,
            response: { value: 1 },
          },
          {
            type: 'SET_ANSWER',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/50919a95-e9d3-4cee-a4be-bc70e3387826',
            time: 1692005985232,
            response: { value: [0] },
          },
          {
            type: 'NEXT',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/50919a95-e9d3-4cee-a4be-bc70e3387826',
            time: 1692005986098,
          },
          {
            type: 'SET_ANSWER',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/3d696b71-48b6-426a-bc21-87833bda0351',
            time: 1692005987044,
            response: { value: 5 },
          },
          {
            type: 'NEXT',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/3d696b71-48b6-426a-bc21-87833bda0351',
            time: 1692005987698,
          },
          {
            type: 'SET_ANSWER',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/90c99a5b-689e-45a0-8e63-c75e2335d85d',
            time: 1692005988956,
            response: { value: '1' },
          },
          {
            type: 'NEXT',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/90c99a5b-689e-45a0-8e63-c75e2335d85d',
            time: 1692005989678,
          },
          {
            type: 'SET_ANSWER',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/b1c54326-d856-492a-8c26-0c6f6e7b9653',
            time: 1692005991357,
            response: 'Kljk',
          },
          {
            type: 'DONE',
            screen:
              '55aa0609-6be5-4c24-83e2-7926fc60d074/b1c54326-d856-492a-8c26-0c6f6e7b9653',
            time: 1692005992241,
          },
        ],
        itemIds: [
          'df667c1a-a626-4f70-8081-95c504e7bfde',
          '977c6e6c-dcd8-4cfa-9fe8-8aac7c7f574b',
          '50919a95-e9d3-4cee-a4be-bc70e3387826',
          '3d696b71-48b6-426a-bc21-87833bda0351',
          '90c99a5b-689e-45a0-8e63-c75e2335d85d',
          'b1c54326-d856-492a-8c26-0c6f6e7b9653',
        ],
        appletEncryption: {
          publicKey:
            '[22,239,40,159,12,174,172,205,133,176,62,81,205,109,177,227,44,17,43,61,4,236,54,236,17,66,0,246,57,137,239,159,106,217,203,112,43,136,126,110,8,68,7,118,198,191,247,62,178,249,137,255,58,63,155,159,143,194,30,79,164,10,37,154,0,231,63,176,131,254,219,140,93,188,177,173,54,28,86,151,210,90,175,219,157,16,252,88,11,248,58,157,97,172,40,240,4,87,10,102,4,115,68,130,214,145,78,64,167,190,12,158,11,63,93,8,195,227,155,210,13,0,55,47,123,2,242,17]',
          prime:
            '[253,248,90,120,216,246,31,0,226,134,172,248,90,126,42,170,135,32,92,167,238,239,74,222,63,141,186,19,103,129,104,7,141,209,83,14,233,199,228,186,51,243,154,131,20,88,62,110,0,98,166,179,48,30,251,158,104,43,186,6,182,97,171,72,67,65,129,143,95,139,196,6,203,49,62,161,253,135,191,60,71,105,229,68,39,33,204,82,152,249,237,11,110,208,245,162,51,231,223,128,216,220,79,180,181,244,249,43,191,147,246,133,174,247,236,154,73,231,146,248,194,21,144,154,105,101,123,91]',
          base: '[2]',
          accountId: 'f5049464-d547-41f0-9b57-79899a63c47f',
        },
        flowId: null,
        activityId: '55aa0609-6be5-4c24-83e2-7926fc60d074',
        executionGroupKey: '080555e1-bc24-414c-962a-1aec7bc99c41',
        startTime: 1692005980453,
        endTime: 1692005992354,
        debug_activityName: 'Activity3',
        debug_completedAt: 'Mon Aug 14 2023 13:39:52 GMT+0400',
        client: {
          appId: 'mindlogger-mobile',
          appVersion: '0.22.0',
          width: 390,
          height: 844,
        },
        alerts: [],
      } as never as SendAnswersInput;

      jest
        .spyOn(answersUploadService as never, 'uploadAllMediaFiles')
        .mockResolvedValue(body as never);

      jest
        .spyOn(answersUploadService as never, 'assignRemoteUrlsToUserActions')
        .mockResolvedValue(body.userActions as never);

      jest.spyOn(userPrivateKeyRecord, 'get').mockReturnValue({} as never);

      jest
        .spyOn(encryptionManager as never, 'createEncryptionService')
        .mockReturnValue({
          encrypt: jest.fn((data: never) => `encrypted_${data}`),
        } as never);

      jest
        .spyOn(encryptionManager as never, 'getPublicKey')
        .mockReturnValue('mocked_public_key' as never);

      jest
        .spyOn(mediaFileCleaner, 'cleanUpByAnswers')
        .mockImplementation(() => {});

      jest
        .spyOn(answerService, 'sendActivityAnswers')
        .mockResolvedValue({} as never);

      let checkIfAnswersUploadedCallCount = 0;
      jest
        .spyOn(answersUploadService as never, 'checkIfAnswersUploaded')
        .mockImplementation((() => {
          checkIfAnswersUploadedCallCount += 1;
          if (checkIfAnswersUploadedCallCount <= 1) {
            return false;
          }
          return true;
        }) as never);

      await answersUploadService.sendAnswers(body);

      expect(answersUploadService.uploadAllMediaFiles).toHaveBeenCalledWith(
        body,
      );
      expect(
        answersUploadService.assignRemoteUrlsToUserActions,
      ).toHaveBeenCalledWith(body.answers, body);
      expect(mediaFileCleaner.cleanUpByAnswers).toHaveBeenCalledWith(
        body.answers,
      );
    });
  });
});
