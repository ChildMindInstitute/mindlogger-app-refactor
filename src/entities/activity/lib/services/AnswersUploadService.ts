import { FileSystem } from 'react-native-file-access';

import {
  ActivityAnswersRequest,
  AnswerDto,
  AnswerService,
  DrawerAnswerDto,
  FileService,
  ObjectAnswerDto,
} from '@app/shared/api';
import { MediaFile } from '@app/shared/ui';
import { UserPrivateKeyRecord } from '@entities/identity/lib';
import { encryption } from '@shared/lib';

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
    fakeResult: boolean = false,
  ): Promise<CheckFilesUploadResults> {
    return fileIds.map(x => ({
      // todo
      uploaded: fakeResult,
      fileId: x,
      remoteUrl: null,
    }));
  }

  private async checkIfAnswersUploaded(
    checkInput: CheckAnswersInput,
    fakeResult: boolean = false,
  ): Promise<boolean> {
    console.log(checkInput);
    return fakeResult; // todo
  }

  private getUploadRecord(
    results: CheckFilesUploadResults,
    fileId: string,
  ): CheckFileUploadResult {
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
      }
    }

    return result;
  }

  private async uploadFilesForAnswer(
    mediaAnswer: MediaFile,
    uploadResults: CheckFilesUploadResults,
  ): Promise<string> {
    const localFileExists = await FileSystem.exists(mediaAnswer.uri);

    if (!localFileExists) {
      throw new Error(
        '[UploadAnswersService.uploadFilesForAnswer]: Local file does not exist',
      );
    }

    const uploadRecord = this.getUploadRecord(
      uploadResults,
      this.getFileId(mediaAnswer),
    );

    if (!uploadRecord) {
      throw new Error(
        '[UploadAnswersService.uploadFilesForAnswer]: uploadRecord does not exist',
      );
    }

    try {
      let remoteUrl;

      if (!uploadRecord.uploaded) {
        const uploadResult = await FileService.upload({
          fileName: mediaAnswer.fileName,
          type: mediaAnswer.type,
          uri: mediaAnswer.uri,
        });

        remoteUrl = uploadResult.data.result.url;
      } else {
        remoteUrl = uploadRecord.remoteUrl;
      }

      return remoteUrl!;
    } catch (error) {
      console.warn(
        '[UploadAnswersService.uploadFilesForAnswer]: Error occurred while file uploading',
        error!.toString(),
      );
      throw error;
    }
  }

  private async uploadAllMediaFiles(
    body: SendAnswersInput,
  ): Promise<SendAnswersInput> {
    const fileIds = this.collectFileIds(body.answers);

    let uploadResults: CheckFilesUploadResults;

    try {
      uploadResults = await this.checkIfFilesUploaded(fileIds);
    } catch (error) {
      throw new Error(
        '[UploadAnswersService.uploadAllMediaFiles]: Error occurred on 1st files upload check\n\n' +
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

      const remoteUrl = await this.uploadFilesForAnswer(
        mediaAnswer,
        uploadResults,
      );

      const isSvg = mediaAnswer.type === 'image/svg';

      if (remoteUrl && !isSvg) {
        updatedAnswers.push({ value: remoteUrl });
      } else if (remoteUrl) {
        const svgAnswer = itemAnswer as ObjectAnswerDto;

        const svgValue = svgAnswer.value as DrawerAnswerDto;

        const copy: ObjectAnswerDto = {
          text: svgAnswer.text,
          value: { ...svgValue, uri: remoteUrl },
        };

        updatedAnswers.push(copy);
      }
    }

    try {
      uploadResults = await this.checkIfFilesUploaded(fileIds, true);
    } catch (error) {
      throw new Error(
        '[uploadAnswerMediaFiles.uploadAllMediaFiles]: Error occurred on 2nd files upload check\n\n' +
          error!.toString(),
      );
    }

    if (uploadResults.some(x => !x.uploaded)) {
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
      uploaded = await this.checkIfAnswersUploaded({
        activityId: encryptedData.activityId,
        appletId: encryptedData.appletId,
        flowId: encryptedData.flowId,
        createdAt: encryptedData.createdAt,
      });
    } catch (error) {
      console.warn(
        '[UploadAnswersService.uploadAnswers]: Error occurred while 1st check if answers uploaded\n\n',
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
        '[UploadAnswersService.uploadAnswers]: Error occurred while sending answers\n\n',
        error!.toString(),
      );
      throw error;
    }

    try {
      uploaded = await this.checkIfAnswersUploaded(
        {
          activityId: encryptedData.activityId,
          appletId: encryptedData.appletId,
          flowId: encryptedData.flowId,
          createdAt: encryptedData.createdAt,
        },
        true,
      );
    } catch (error) {
      console.warn(
        '[UploadAnswersService.uploadAnswers]: Error occurred while 2nd check if answers uploaded\n\n',
        error!.toString(),
      );
      throw error;
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
      client: data.client,
    };

    return encryptedData;
  }

  public async sendAnswers(body: SendAnswersInput) {
    this.createdAt = body.createdAt;

    const modifiedBody = await this.uploadAllMediaFiles(body);

    if (modifiedBody.itemIds.length !== modifiedBody.answers.length) {
      throw new Error(
        "[UploadAnswersService.sendAnswers]: Items' length doesn't equal to answers' length ",
      );
    }

    const encryptedData = this.encryptAnswers(modifiedBody);

    await this.uploadAnswers(encryptedData);

    MediaFilesCleaner.cleanUpByAnswers(body.answers);
  }
}

export default new AnswersUploadService();
