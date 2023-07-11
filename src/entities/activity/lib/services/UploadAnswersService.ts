import { FileSystem } from 'react-native-file-access';

import {
  ActivityAnswersRequest,
  AnswerDto,
  AnswerService,
  FileService,
  ObjectAnswerDto,
} from '@app/shared/api';
import { MediaFile } from '@app/shared/ui';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { encryption, wait } from '@shared/lib';

import MediaFilesCleaner from './MediaFilesCleaner';
import {
  CheckAnswersInput,
  CheckFileResult,
  CheckFilesResults,
  SendAnswersInput,
} from '../types';

class UploadAnswersService {
  private createdAt: number | null;

  constructor() {
    this.createdAt = null;
  }

  private isFileUrl(value: string): boolean {
    const localFileRegex =
      /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV|svg)$/;

    return localFileRegex.test(value);
  }

  private async checkIfFilesUploaded(
    fileIds: string[],
  ): Promise<CheckFilesResults> {
    return fileIds.map(x => ({
      // todo
      exists: false,
      fileId: x,
      remoteUrl: null,
    }));
  }

  private async checkIfAnswersUploaded(
    checkInput: CheckAnswersInput,
  ): Promise<boolean> {
    console.log(checkInput);
    return false; // todo
  }

  private getUploadRecord(
    results: CheckFilesResults,
    fileId: string,
  ): CheckFileResult {
    return results.find(x => x.fileId === fileId)!;
  }

  private getFileId(file: MediaFile): string {
    return `${this.createdAt!.toString()}/${file.fileName}`;
  }

  private collectFileIds(answers: AnswerDto[]): string[] {
    const result: string[] = [];

    for (const itemAnswer of answers) {
      const { value: answerValue } = itemAnswer as ObjectAnswerDto;

      const mediaAnswer = answerValue as MediaFile;

      const isMediaItem = mediaAnswer?.uri && this.isFileUrl(mediaAnswer.uri);

      if (isMediaItem) {
        result.push(this.getFileId(mediaAnswer));
        continue;
      }
    }

    return result;
  }

  private async uploadAnswerMediaFiles(body: SendAnswersInput) {
    const fileIds = this.collectFileIds(body.answers);

    let uploadedResult: CheckFilesResults;

    try {
      uploadedResult = await this.checkIfFilesUploaded(fileIds);
    } catch (error) {
      throw new Error(
        '[uploadAnswerMediaFiles.checkIfFilesUploaded]: Error occurred on 1st files check api call\n\n' +
          error!.toString(),
      );
    }

    const itemsAnswers = [...body.answers];

    const updatedAnswers = [];

    for (const itemAnswer of itemsAnswers) {
      const { value: answerValue } = itemAnswer as ObjectAnswerDto;

      const mediaAnswer = answerValue as MediaFile;

      const isMediaItem = mediaAnswer?.uri && this.isFileUrl(mediaAnswer.uri);

      if (!isMediaItem) {
        updatedAnswers.push(itemAnswer);
        continue;
      }

      const localFileExists = await FileSystem.exists(mediaAnswer.uri);

      if (!localFileExists) {
        throw new Error(
          '[uploadAnswerMediaFiles.FileSystem.exists]: local file does not exist',
        );
      }

      const uploadRecord = this.getUploadRecord(
        uploadedResult,
        this.getFileId(mediaAnswer),
      );

      try {
        let remoteUrl;

        if (!uploadRecord.exists) {
          const uploadResult = await FileService.upload({
            fileName: mediaAnswer.fileName,
            type: mediaAnswer.type,
            uri: mediaAnswer.uri,
          });

          remoteUrl = uploadResult?.data.result.url;
        } else {
          remoteUrl = uploadRecord.remoteUrl;
        }

        const isSvg = mediaAnswer.type === 'image/svg';

        if (remoteUrl && !isSvg) {
          updatedAnswers.push({ value: remoteUrl });
        } else if (remoteUrl) {
          mediaAnswer.uri = remoteUrl;
          updatedAnswers.push(itemAnswer);
        }
      } catch (error) {
        console.warn(
          '[uploadAnswerMediaFiles.FileService.upload]: error occurred',
          error!.toString(),
        );
        throw error;
      }
    }

    try {
      uploadedResult = await this.checkIfFilesUploaded(fileIds);
    } catch (error) {
      throw new Error(
        '[uploadAnswerMediaFiles.checkIfFilesUploaded]: Error occurred on 2nd files check api call\n\n' +
          error!.toString(),
      );
    }

    if (uploadedResult.some(x => !x.exists)) {
      throw new Error(
        '[uploadAnswerMediaFiles.uploadedResult.some]: Error occurred on final upload results check',
      );
    }

    const updatedBody = { ...body, answers: updatedAnswers };

    return updatedBody;
  }

  private encryptAnswers(data: SendAnswersInput): ActivityAnswersRequest {
    const { appletEncryption } = data;
    const userPrivateKey = UserPrivateKeyRecord.get();

    if (!userPrivateKey) {
      throw new Error('User private key is undefined');
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
      answer: {
        answer: encryptedAnswers,
        itemIds: data.itemIds,
        events: encryptedUserActions,
        startTime: data.startTime,
        endTime: data.endTime,
        scheduledTime: data.scheduledTime,
        userPublicKey: JSON.stringify(userPublicKey),
        identifier,
      },
      createdAt: data.createdAt,
    };

    return encryptedData;
  }

  private async uploadAnswers(
    encryptedData: ActivityAnswersRequest,
    body: SendAnswersInput,
  ) {
    let uploaded;

    try {
      uploaded = await this.checkIfAnswersUploaded({
        activityId: body.activityId,
        appletId: body.appletId,
        createdAt: body.createdAt,
        flowId: body.flowId,
      });
    } catch (error) {
      console.warn(
        '[uploadAnswers.checkIfAnswersUploaded]: Error occurred\n\n',
        error!.toString(),
      );
      throw error;
    }

    if (uploaded) {
      return;
    }

    try {
      await AnswerService.sendActivityAnswers(encryptedData);
    } catch (error) {
      console.warn(
        '[uploadAnswers.AnswerService.sendActivityAnswers]: Error occurred\n\n',
        error!.toString(),
      );
      throw error;
    }

    try {
      uploaded = await this.checkIfAnswersUploaded({
        activityId: body.activityId,
        appletId: body.appletId,
        createdAt: body.createdAt,
        flowId: body.flowId,
      });
    } catch (error) {
      console.warn(
        '[uploadAnswers.checkIfAnswersUploaded]: Error occurred on 2nd check\n\n',
        error!.toString(),
      );
      throw error;
    }

    if (!uploaded) {
      throw new Error('[uploadAnswers] Answers were not uploaded');
    }
  }

  public async sendAnswers(body: SendAnswersInput) {
    // This delay is for postponing encryption operation which blocks the UI thread
    await wait(100);

    this.createdAt = body.createdAt;

    const data = await this.uploadAnswerMediaFiles(body);

    const encryptedData = this.encryptAnswers(data);

    await this.uploadAnswers(encryptedData, body);

    MediaFilesCleaner.cleanUpByAnswers(body.answers);
  }
}

export default new UploadAnswersService();
