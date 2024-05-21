import { FileSystem } from 'react-native-file-access';

import {
  ActivityAnswersRequest,
  AnswerDto,
  AnswerService,
  CheckIfFilesExistResultDto,
  DrawerAnswerDto,
  FileService,
  ObjectAnswerDto,
  UserActionDto,
} from '@app/shared/api';
import { MediaFile } from '@app/shared/ui';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import {
  ILogger,
  Logger,
  encryption,
  formatToDtoDate,
  formatToDtoTime,
  isLocalFileUrl,
} from '@shared/lib';

import MediaFilesCleaner from './MediaFilesCleaner';
import {
  CheckAnswersInput,
  CheckFileUploadResult,
  CheckFilesUploadResults,
  SendAnswersInput,
} from '../types';

export interface IAnswersUploadService {
  sendAnswers(body: SendAnswersInput): void;
}

class AnswersUploadService implements IAnswersUploadService {
  private createdAt: number | null;

  private logger: ILogger;

  constructor(logger: ILogger) {
    this.createdAt = null;
    this.logger = logger;
  }

  private mapFileExistenceDto(
    dto: CheckIfFilesExistResultDto,
  ): CheckFilesUploadResults {
    return dto.map<CheckFileUploadResult>(x => ({
      fileId: x.fileId,
      remoteUrl: x.url,
      uploaded: x.uploaded,
    }));
  }

  private async checkIfFilesUploaded(
    fileIds: string[],
    appletId: string,
  ): Promise<CheckFilesUploadResults> {
    const response = await FileService.checkIfFilesExist({
      files: fileIds,
      appletId,
    });

    return this.mapFileExistenceDto(response.data.result);
  }

  private async checkIfAnswersUploaded(
    checkInput: CheckAnswersInput,
  ): Promise<boolean> {
    const response = await AnswerService.checkIfAnswersExist({
      activityId: checkInput.activityId,
      appletId: checkInput.appletId,
      createdAt: checkInput.createdAt,
    });

    return response.data.result.exists;
  }

  private getUploadRecord(
    checks: CheckFilesUploadResults,
    fileId: string,
  ): CheckFileUploadResult {
    return checks.find(x => x.fileId === fileId)!;
  }

  private getFileId(file: MediaFile): string {
    return `${this.createdAt!.toString()}/${file.fileName}`;
  }

  private isFileUrl(url: string): boolean {
    return isLocalFileUrl(url);
  }

  private collectFileIds(answers: AnswerDto[]): string[] {
    const result: string[] = [];

    for (const itemAnswer of answers) {
      const answerValue = (itemAnswer as ObjectAnswerDto)?.value;

      const mediaAnswer = answerValue as MediaFile;

      const isMediaItem = mediaAnswer?.uri && this.isFileUrl(mediaAnswer.uri);

      if (isMediaItem) {
        result.push(this.getFileId(mediaAnswer));
      }
    }

    return result;
  }

  private async processFileUpload(
    mediaFile: MediaFile,
    uploadChecks: CheckFilesUploadResults,
    logAnswerIndex: number,
    appletId: string,
  ): Promise<string> {
    const localFileExists = await FileSystem.exists(mediaFile.uri);

    const logFileInfo = `(${mediaFile.type}, from answer #${logAnswerIndex})`;

    if (!localFileExists) {
      throw new Error(
        `[UploadAnswersService.processFileUpload]: Local file ${logFileInfo} does not exist`,
      );
    }

    const uploadRecord = this.getUploadRecord(
      uploadChecks,
      this.getFileId(mediaFile),
    );

    if (!uploadRecord) {
      throw new Error(
        `[UploadAnswersService.processFileUpload]: uploadRecord does not exist, file: ${logFileInfo}`,
      );
    }

    try {
      let remoteUrl;

      if (!uploadRecord.uploaded) {
        this.logger.log(
          `[UploadAnswersService.processFileUpload] Getting upload fields for file ${logFileInfo}`,
        );

        const fieldsResponse = await FileService.getFieldsForFileUpload({
          appletId,
          fileId: this.getFileId(mediaFile),
        });

        const getFieldsDto = fieldsResponse.data.result;

        this.logger.log(
          `[UploadAnswersService.processFileUpload] Uploading file ${logFileInfo}`,
        );

        this.logger.log(
          `[UploadAnswersService.processFileUpload] Received field names: ${Object.keys(getFieldsDto.fields).toString()}`,
        );

        await FileService.uploadAppletFileToS3({
          fields: getFieldsDto.fields,
          fileName: mediaFile.fileName,
          localUrl: mediaFile.uri,
          type: mediaFile.type,
          uploadUrl: getFieldsDto.uploadUrl,
        });

        remoteUrl = getFieldsDto.url;

        this.logger.log(
          `[UploadAnswersService.processFileUpload]: Upload success, url = "${remoteUrl}"`,
        );
      } else {
        this.logger.log(
          `[UploadAnswersService.processFileUpload] File ${logFileInfo} already uploaded`,
        );

        remoteUrl = uploadRecord.remoteUrl;
      }

      return remoteUrl!;
    } catch (error) {
      throw new Error(
        `[UploadAnswersService.processFileUpload]: Error occurred while file ${logFileInfo} uploading\n\n${error}`,
      );
    }
  }

  private logFilesUploadCheck(
    uploadChecks: CheckFilesUploadResults,
    position: '1' | '2',
  ) {
    this.logger.log(
      `[UploadAnswersService.uploadAllMediaFiles] Check if files uploaded #${position}:\n\n` +
        JSON.stringify(uploadChecks, null, 2),
    );
  }

  private async uploadAllMediaFiles(
    body: SendAnswersInput,
  ): Promise<SendAnswersInput> {
    const fileIds = this.collectFileIds(body.answers);

    if (fileIds.length === 0) {
      return body;
    }

    let uploadChecks: CheckFilesUploadResults;

    try {
      uploadChecks = await this.checkIfFilesUploaded(fileIds, body.appletId);
    } catch (error) {
      throw new Error(
        `[UploadAnswersService.uploadAllMediaFiles]: Error occurred on 1st files upload check\n\n${error}`,
      );
    }

    this.logFilesUploadCheck(uploadChecks, '1');

    const itemsAnswers = [...body.answers] as ObjectAnswerDto[];

    const updatedAnswers = [];
    let logAnswerIndex = -1;

    for (const itemAnswer of itemsAnswers) {
      logAnswerIndex++;

      const answerValue = itemAnswer?.value;

      const text = itemAnswer?.text;

      const mediaAnswer = answerValue as MediaFile;

      const isMediaItem = mediaAnswer?.uri && this.isFileUrl(mediaAnswer.uri);

      if (!isMediaItem) {
        updatedAnswers.push(itemAnswer);
        continue;
      }

      const remoteUrl = await this.processFileUpload(
        mediaAnswer,
        uploadChecks,
        logAnswerIndex,
        body.appletId,
      );

      const isSvg = mediaAnswer.type === 'image/svg';

      if (remoteUrl && !isSvg) {
        updatedAnswers.push({ value: remoteUrl, text });
      } else if (remoteUrl) {
        const svgValue = itemAnswer.value as DrawerAnswerDto;

        const copy: ObjectAnswerDto = {
          text,
          value: { ...svgValue, uri: remoteUrl },
        };

        updatedAnswers.push(copy);
      }
    }

    try {
      uploadChecks = await this.checkIfFilesUploaded(fileIds, body.appletId);
    } catch (error) {
      throw new Error(
        `[uploadAnswerMediaFiles.uploadAllMediaFiles]: Error occurred while 2nd files upload check\n\n${error}`,
      );
    }

    this.logFilesUploadCheck(uploadChecks, '2');

    if (uploadChecks.some(x => !x.uploaded)) {
      throw new Error(
        '[uploadAnswerMediaFiles.uploadAllMediaFiles]: Error occurred on final upload results check',
      );
    }

    const updatedBody = { ...body, answers: updatedAnswers };

    return updatedBody;
  }

  private async uploadAnswers(encryptedData: ActivityAnswersRequest) {
    let uploaded: boolean;

    try {
      const { activityId, appletId, flowId, createdAt } = encryptedData;

      uploaded = await this.checkIfAnswersUploaded({
        activityId,
        appletId,
        flowId,
        createdAt,
      });
    } catch (error) {
      throw new Error(
        `[UploadAnswersService.uploadAnswers]: Error occurred while 1st check if answers uploaded\n\n${error}`,
      );
    }

    if (uploaded) {
      this.logger.log(
        '[UploadAnswersService.uploadAnswers]: Answers already uploaded',
      );
      return;
    }

    try {
      this.logger.log(
        '[UploadAnswersService.uploadAnswers]: Check result: not uploaded yet, so uploading answers',
      );

      await AnswerService.sendActivityAnswers(encryptedData);
    } catch (error) {
      throw new Error(
        `[UploadAnswersService.uploadAnswers]: Error occurred while sending answers\n\n${error}`,
      );
    }

    try {
      uploaded = await this.checkIfAnswersUploaded({
        activityId: encryptedData.activityId,
        appletId: encryptedData.appletId,
        flowId: encryptedData.flowId,
        createdAt: encryptedData.createdAt,
      });
    } catch (error) {
      throw new Error(
        `[UploadAnswersService.uploadAnswers]: Error occurred while 2nd check if answers uploaded\n\n${error}`,
      );
    }

    if (!uploaded) {
      throw new Error(
        '[UploadAnswersService.uploadAnswers] Answers were not uploaded',
      );
    }
  }

  private encryptAnswers(data: SendAnswersInput): ActivityAnswersRequest {
    const { appletEncryption } = data;
    const userPrivateKey = UserPrivateKeyRecord.get();

    if (!userPrivateKey) {
      throw new Error('Error occurred while preparing answers');
    }

    const { encrypt } = encryption.createEncryptionService({
      ...appletEncryption,
      privateKey: userPrivateKey,
    });

    const encryptedAnswers = encrypt(JSON.stringify(data.answers));

    const encryptedUserActions = encrypt(JSON.stringify(data.userActions));

    const identifier = data.userIdentifier && encrypt(data.userIdentifier);

    const userPublicKey = encryption.getPublicKey({
      privateKey: userPrivateKey,
      appletPrime: JSON.parse(appletEncryption.prime),
      appletBase: JSON.parse(appletEncryption.base),
    });

    const encryptedData: ActivityAnswersRequest = {
      appletId: data.appletId,
      version: data.version,
      flowId: data.flowId,
      submitId: data.executionGroupKey,
      activityId: data.activityId,
      isFlowCompleted: data.isFlowCompleted,
      answer: {
        answer: encryptedAnswers,
        itemIds: data.itemIds,
        events: encryptedUserActions,
        startTime: data.startTime,
        endTime: data.endTime,
        scheduledTime: data.scheduledTime ?? undefined,
        userPublicKey: JSON.stringify(userPublicKey),
        identifier,
        localEndDate: formatToDtoDate(data.endTime),
        localEndTime: formatToDtoTime(data.endTime, true),
        scheduledEventId: data.eventId,
        tzOffset: data.tzOffset,
      },
      createdAt: data.createdAt,
      client: data.client,
      alerts: data.alerts,
    };

    return encryptedData;
  }

  private assignRemoteUrlsToUserActions(
    originalAnswers: AnswerDto[],
    modifiedBody: SendAnswersInput,
  ) {
    const userActions = modifiedBody.userActions;
    const updatedAnswers = modifiedBody.answers;

    const processUserActions = () =>
      userActions.map((userAction: UserActionDto) => {
        const response = userAction?.response as ObjectAnswerDto;
        const userActionValue = response?.value as MediaFile;
        const isSvg = userActionValue?.type === 'image/svg';

        if (userAction.type !== 'SET_ANSWER' || !userActionValue?.uri) {
          return userAction;
        }

        const originalAnswerIndex = originalAnswers.findIndex(answer => {
          const currentAnswerValue = (answer as ObjectAnswerDto)
            ?.value as MediaFile;

          return currentAnswerValue?.uri === userActionValue.uri;
        });

        if (originalAnswerIndex === -1) {
          return {
            ...userAction,
            response: {
              value: null,
            },
          };
        }

        if (isSvg) {
          return {
            ...userAction,
            response: updatedAnswers[originalAnswerIndex],
          };
        }

        return {
          ...userAction,
          response: {
            value: (updatedAnswers[originalAnswerIndex] as ObjectAnswerDto)
              .value,
            text: (updatedAnswers[originalAnswerIndex] as ObjectAnswerDto)
              ?.text,
          },
        };
      });

    try {
      return processUserActions();
    } catch (error) {
      throw new Error(
        `[UploadAnswersService.assignRemoteUrlsToUserActions]: Error occurred while mapping user actions with media files\n\n${error}`,
      );
    }
  }

  public async sendAnswers(body: SendAnswersInput) {
    this.createdAt = body.createdAt;

    this.logger.log(
      '[UploadAnswersService.sendAnswers] executing upload files',
    );

    const modifiedBody = await this.uploadAllMediaFiles(body);

    this.logger.log(
      '[UploadAnswersService.sendAnswers] executing assign urls to user actions',
    );

    const updatedUserActions = this.assignRemoteUrlsToUserActions(
      body.answers,
      modifiedBody,
    );

    modifiedBody.userActions = updatedUserActions as UserActionDto[];

    if (modifiedBody.itemIds.length !== modifiedBody.answers.length) {
      throw new Error(
        "[UploadAnswersService.sendAnswers]: Items' length doesn't equal to answers' length ",
      );
    }

    this.logger.log(
      '[UploadAnswersService.sendAnswers] executing prepare answers',
    );

    const encryptedData = this.encryptAnswers(modifiedBody);

    this.logger.log(
      '[UploadAnswersService.sendAnswers] executing upload answers',
    );

    await this.uploadAnswers(encryptedData);

    this.logger.log('[UploadAnswersService.sendAnswers] executing clean up');

    MediaFilesCleaner.cleanUpByAnswers(body.answers);
  }
}

export default new AnswersUploadService(Logger);
