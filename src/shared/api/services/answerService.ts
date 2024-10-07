import {
  watchForConnectionLoss,
  callApiWithRetry,
} from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  ActivityAnswersRequest,
  ActivityAnswersResponse,
  CheckIfAnswersExistRequest,
  CheckIfAnswersExistResponse,
  IAnswerService,
} from './IAnswerService';

export function answerService(): IAnswerService {
  return {
    async sendActivityAnswers(request: ActivityAnswersRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          // TODO: M2-7407 - Are source_subject_id and input_subject_id not important?

          // TODO: M2-7407 - Add target_subject_id to payload
          const response = await httpService.post<ActivityAnswersResponse>(
            '/answers',
            request,
            {
              signal: abortController.signal,
            },
          );
          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },
    async checkIfAnswersExist(request: CheckIfAnswersExistRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          // TODO: M2-7407 - Check why target_subject_id is not in BE payload
          const response = await httpService.post<CheckIfAnswersExistResponse>(
            '/answers/check-existence',
            request,
            {
              signal: abortController.signal,
            },
          );
          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },
  };
}
