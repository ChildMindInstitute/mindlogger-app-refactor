import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityPathParams,
  ProcessAutocompletion,
  StoreProgress,
} from '@app/abstract/lib';
import {
  AnswersQueueService,
  QueueProcessingService,
} from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import { LogTrigger } from '@app/shared/api';
import {
  Emitter,
  Logger,
  Mutex,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';

import {
  CollectCompletionsService,
  CollectCompletionOutput,
  ConstructCompletionsService,
} from '../services';

type Result = {
  process: ProcessAutocompletion;
  completeEntityIntoUploadToQueue: CompleteEntityIntoUploadToQueue;
  hasItemsInQueue: boolean;
  hasExpiredEntity: () => boolean;
  evaluateIfItemsInQueueExist: () => boolean;
};

export const AutoCompletionMutex = Mutex();

const useAutoCompletion = (): Result => {
  const mutex = AutoCompletionMutex;

  const notCompletedEntities = useAppSelector(
    AppletModel.selectors.selectNotCompletedEntities,
  );

  const storeProgress: StoreProgress = useAppSelector(
    AppletModel.selectors.selectInProgressApplets,
  );

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const hasItemsInQueue = useCallback(() => {
    return AnswersQueueService.getLength() > 0;
  }, []);

  const createConstructService = useCallback(() => {
    return new ConstructCompletionsService(
      null,
      queryClient,
      storeProgress,
      QueueProcessingService,
      dispatch,
    );
  }, [dispatch, queryClient, storeProgress]);

  const constructInternal = async (
    collectOutput: CollectCompletionOutput,
    constructService: ConstructCompletionsService,
  ) => {
    try {
      await constructService.construct({
        ...collectOutput,
        isAutocompletion: true,
      });
    } catch (error) {
      Logger.warn(
        '[useAutoCompletion.constructInternal] Error occurred:\n' + error,
      );
    }
  };

  const collectAllInternal = (
    collectService: CollectCompletionsService,
    exclude?: EntityPathParams,
  ): CollectCompletionOutput[] => {
    try {
      return collectService.collectAll(exclude);
    } catch (error) {
      Logger.log('[useAutoCompletion] Error occurred:\n' + error);
    }
    return [];
  };

  const completeEntityIntoUploadToQueue = useCallback(
    async (entityPath: EntityPath) => {
      if (mutex.isBusy()) {
        Logger.log(
          '[useAutoCompletion.completeEntityIntoUploadToQueue] Mutex is busy',
        );
        return;
      }

      const collectService = new CollectCompletionsService(
        notCompletedEntities,
      );
      const constructService = createConstructService();

      try {
        mutex.setBusy();

        Logger.log(
          '[useAutoCompletion.completeEntityIntoUploadToQueue] Started',
        );

        const collectOutputs = collectService.collectForEntity(entityPath);

        Logger.log(
          '[useAutoCompletion.completeEntityIntoUploadToQueue] collectOutputs: \n' +
            JSON.stringify(collectOutputs, null, 2),
        );

        for (const collectOutput of collectOutputs) {
          await constructInternal(collectOutput, constructService);
        }

        Logger.log('[useAutoCompletion.completeEntityIntoUploadToQueue] Done');
      } finally {
        mutex.release();
      }
    },
    [notCompletedEntities, mutex, createConstructService],
  );

  const processAutocompletion = useCallback(
    async (
      exclude?: EntityPathParams,
      forceRefreshNotifications: boolean = false,
    ): Promise<boolean> => {
      if (mutex.isBusy()) {
        Logger.log('[useAutoCompletion.processAutocompletion] Mutex is busy');
        return true;
      }

      const collectService = new CollectCompletionsService(
        notCompletedEntities,
      );
      const constructService = createConstructService();

      let completionsCollected: boolean;

      try {
        mutex.setBusy();

        Logger.log('[useAutoCompletion.processAutocompletion] Started');

        const collectOutputs = collectAllInternal(collectService, exclude);

        completionsCollected = !!collectOutputs.length;

        Logger.log(
          '[useAutoCompletion.processAutocompletion] collectOutputs: \n' +
            JSON.stringify(collectOutputs, null, 2),
        );

        for (const collectOutput of collectOutputs) {
          await constructInternal(collectOutput, constructService);
        }

        Logger.log('[useAutoCompletion.processAutocompletion] Done');
      } finally {
        mutex.release();
      }

      let result = true;

      if (hasItemsInQueue()) {
        result = await QueueProcessingService.process();
      }

      if (forceRefreshNotifications || completionsCollected) {
        Emitter.emit('on-notification-refresh', LogTrigger.EntityCompleted);
      }

      return result;
    },
    [mutex, notCompletedEntities, createConstructService, hasItemsInQueue],
  );

  const hasExpiredEntity = useCallback((): boolean => {
    const result = new CollectCompletionsService(
      notCompletedEntities,
    ).hasExpiredEntity();

    Logger.log(`[useAutoCompletion.hasExpiredEntity]: ${String(result)}`);

    return result;
  }, [notCompletedEntities]);

  return {
    process: processAutocompletion,
    completeEntityIntoUploadToQueue,
    hasExpiredEntity,
    hasItemsInQueue: hasItemsInQueue(),
    evaluateIfItemsInQueueExist: hasItemsInQueue,
  };
};

export default useAutoCompletion;
