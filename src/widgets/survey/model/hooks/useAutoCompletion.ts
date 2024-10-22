import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  CompleteEntityIntoUploadToQueue,
  EntityPath,
  EntityPathParams,
  ProcessAutocompletion,
} from '@app/abstract/lib/types/entity';
import { getDefaultAnswersQueueService } from '@app/entities/activity/lib/services/answersQueueServiceInstance';
import { getDefaultQueueProcessingService } from '@app/entities/activity/lib/services/queueProcessingServiceInstance';
import {
  selectAppletsEntityProgressions,
  selectIncompletedEntities,
} from '@app/entities/applet/model/selectors';
import { getDefaultAlertsExtractor } from '@app/features/pass-survey/model/alertsExtractorInstance';
import { getDefaultScoresExtractor } from '@app/features/pass-survey/model/scoresExtractorInstance';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { useAppDispatch, useAppSelector } from '@app/shared/lib/hooks/redux';
import { ReduxPersistor } from '@app/shared/lib/redux-state/store';
import { Emitter } from '@app/shared/lib/services/Emitter';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';
import { CollectCompletionOutput } from '@widgets/survey/model/services/ICollectCompletionsService';

import { CollectCompletionsService } from '../services/CollectCompletionsService';
import { ConstructCompletionsService } from '../services/ConstructCompletionsService';

type Result = {
  process: ProcessAutocompletion;
  completeEntityIntoUploadToQueue: CompleteEntityIntoUploadToQueue;
  hasItemsInQueue: boolean;
  hasExpiredEntity: () => boolean;
  evaluateIfItemsInQueueExist: () => boolean;
};

export const useAutoCompletion = (): Result => {
  const logger = getDefaultLogger();

  const mutex = getMutexDefaultInstanceManager().getAutoCompletionMutex();

  const incompletedEntities = useAppSelector(selectIncompletedEntities);

  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const hasItemsInQueue = useCallback(() => {
    return getDefaultAnswersQueueService().getLength() > 0;
  }, []);

  const createConstructService = useCallback(() => {
    return new ConstructCompletionsService(
      null,
      getDefaultLogger(),
      queryClient,
      getDefaultQueueProcessingService(),
      getDefaultAlertsExtractor(),
      getDefaultScoresExtractor(),
      dispatch,
      ReduxPersistor,
      entityProgressions,
    );
  }, [dispatch, queryClient, entityProgressions]);

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
      logger.warn(
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
      logger.log('[useAutoCompletion] Error occurred:\n' + error);
    }
    return [];
  };

  const completeEntityIntoUploadToQueue = useCallback(
    async (entityPath: EntityPath) => {
      if (mutex.isBusy()) {
        logger.log(
          '[useAutoCompletion.completeEntityIntoUploadToQueue] Mutex is busy',
        );
        return;
      }

      const collectService = new CollectCompletionsService(
        logger,
        incompletedEntities,
      );
      const constructService = createConstructService();

      try {
        mutex.setBusy();

        logger.log(
          '[useAutoCompletion.completeEntityIntoUploadToQueue] Started',
        );

        const collectOutputs = collectService.collectForEntity(entityPath);

        logger.log(
          '[useAutoCompletion.completeEntityIntoUploadToQueue] collectOutputs: \n' +
            JSON.stringify(collectOutputs, null, 2),
        );

        for (const collectOutput of collectOutputs) {
          await constructInternal(collectOutput, constructService);
        }

        logger.log('[useAutoCompletion.completeEntityIntoUploadToQueue] Done');
      } finally {
        mutex.release();
      }
    },
    [incompletedEntities, mutex, createConstructService],
  );

  const processAutocompletion = useCallback(
    async (
      exclude?: EntityPathParams,
      forceRefreshNotifications: boolean = false,
    ): Promise<boolean> => {
      if (mutex.isBusy()) {
        logger.log('[useAutoCompletion.processAutocompletion] Mutex is busy');
        return true;
      }

      const collectService = new CollectCompletionsService(
        logger,
        incompletedEntities,
      );
      const constructService = createConstructService();

      let completionsCollected: boolean;

      try {
        mutex.setBusy();

        logger.log('[useAutoCompletion.processAutocompletion] Started');

        const collectOutputs = collectAllInternal(collectService, exclude);

        completionsCollected = !!collectOutputs.length;

        logger.log(
          '[useAutoCompletion.processAutocompletion] collectOutputs: \n' +
            JSON.stringify(collectOutputs, null, 2),
        );

        for (const collectOutput of collectOutputs) {
          await constructInternal(collectOutput, constructService);
        }

        logger.log('[useAutoCompletion.processAutocompletion] Done');
      } finally {
        mutex.release();
      }

      let result = true;

      if (hasItemsInQueue()) {
        result = await getDefaultQueueProcessingService().process();
      }

      if (forceRefreshNotifications || completionsCollected) {
        Emitter.emit('on-notification-refresh', LogTrigger.EntityCompleted);
      }

      return result;
    },
    [mutex, incompletedEntities, createConstructService, hasItemsInQueue],
  );

  const hasExpiredEntity = useCallback((): boolean => {
    const result = new CollectCompletionsService(
      logger,
      incompletedEntities,
    ).hasExpiredEntity();

    logger.log(`[useAutoCompletion.hasExpiredEntity]: ${String(result)}`);

    return result;
  }, [incompletedEntities]);

  return {
    process: processAutocompletion,
    completeEntityIntoUploadToQueue,
    hasExpiredEntity,
    hasItemsInQueue: hasItemsInQueue(),
    evaluateIfItemsInQueueExist: hasItemsInQueue,
  };
};
