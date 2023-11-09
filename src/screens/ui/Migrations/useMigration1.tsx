import { useQueryClient } from '@tanstack/react-query';

import { ActivityPipelineType, FlowProgress } from '@app/abstract/lib';
import { AppletModel } from '@app/entities/applet';
import { EventModel } from '@app/entities/event';
import {
  AppletDetailsDto,
  AppletDetailsResponse,
  AppletEventsResponse,
  AppletsResponse,
  ScheduleEventDto,
} from '@app/shared/api';
import {
  Logger,
  createStorage,
  getAppletDetailsKey,
  getAppletsKey,
  getDataFromQuery,
  getEventsKey,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';
import { FlowState } from '@app/widgets/survey/lib';
import { getScheduledDate } from '@app/widgets/survey/model';

const flowStorage = createStorage('flow_progress-storage');

const LogModuleName = '[useMigration1]: ';

const useMigration1 = () => {
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const state: RootState = useAppSelector(s => s);

  const getAppletDto = (appletId: string): AppletDetailsDto | null => {
    const result = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      queryClient,
    );
    return result?.result ?? null;
  };

  const getEventsDto = (appletId: string): ScheduleEventDto[] | null => {
    const eventsKey = getEventsKey(appletId);

    const response = getDataFromQuery<AppletEventsResponse>(
      eventsKey,
      queryClient,
    );
    return response?.result.events ?? null;
  };

  const getFlowState = (key: string) => {
    const json = flowStorage.getString(key);

    if (json) {
      return JSON.parse(json) as FlowState;
    } else {
      return null;
    }
  };

  const setFlowState = (key: string, newState: FlowState) => {
    flowStorage.set(key, JSON.stringify(newState));
  };

  const getFlowRecordKey = (
    appletId: string,
    flowId: string | null,
    eventId: string,
  ) => {
    const flowKey = flowId ?? 'default_one_step_flow';
    return `${flowKey}-${appletId}-${eventId}`;
  };

  const migrateInternal = () => {
    const appletsResponse = getDataFromQuery<AppletsResponse>(
      getAppletsKey(),
      queryClient,
    );

    if (!appletsResponse) {
      Logger.warn(
        LogModuleName +
          "Migration cannot be executed as appletsResponse doesn't exist, which means - refresh hasn't been ever done",
      );
      return;
    }

    const entitiesInProgress =
      AppletModel.selectors.selectNotCompletedEntities(state);

    for (let progress of entitiesInProgress) {
      const { appletId, entityId, eventId, payload } = progress;

      Logger.info(
        LogModuleName +
          'Migrating progress: \n' +
          JSON.stringify(progress, null, 2),
      );

      const applet = getAppletDto(appletId);

      if (!applet) {
        Logger.warn(
          LogModuleName +
            "Migration cannot be executed as applet doesn't exist: " +
            appletId,
        );
        continue;
      }

      const isFlow = payload.type === ActivityPipelineType.Flow;

      const activityFlow = isFlow
        ? applet.activityFlows.find(f => f.id === entityId)
        : null;

      const key = getFlowRecordKey(appletId, isFlow ? entityId : null, eventId);

      const flowState: FlowState = getFlowState(key)!;

      if (isFlow) {
        Logger.info(LogModuleName + 'Updating flow progress record');

        const flowProgress = payload as FlowProgress;

        const currentActivity = applet.activities.find(
          a => a.id === flowProgress.currentActivityId,
        );

        if (!currentActivity) {
          Logger.warn(
            LogModuleName +
              "currentActivity doesn't exist in react-query cache: " +
              flowProgress.currentActivityId,
          );
        }
        if (!activityFlow) {
          Logger.warn(
            LogModuleName + "activityFlow doesn't exist: " + entityId,
          );
          continue;
        }

        const newProgress = {
          appletId: appletId,
          eventId: eventId,
          flowId: entityId,
          pipelineActivityOrder: flowProgress.pipelineActivityOrder,
          activityId: flowProgress.currentActivityId,
          activityDescription:
            currentActivity?.description ?? '[Description unknown]',
          activityImage: currentActivity?.image ?? null,
          activityName: currentActivity?.name ?? '[Name unknown]',
          totalActivities: flowState.pipeline.filter(x => x.type === 'Stepper')
            .length,
        };

        dispatch(AppletModel.actions.flowUpdated(newProgress));

        Logger.info(
          LogModuleName +
            'Flow progress record updated, action object: \n' +
            JSON.stringify(newProgress, null, 2),
        );
      }

      const eventDtos = getEventsDto(appletId)!;

      const eventDto = eventDtos.find(e => e.id === eventId);

      Logger.info(
        LogModuleName +
          'Updating pipeline flow state. Before update:\n' +
          JSON.stringify(flowState, null, 2),
      );

      if (isFlow) {
        flowState.flowName = activityFlow!.name;
      }

      if (eventDto) {
        flowState.scheduledDate =
          getScheduledDate(EventModel.mapEventFromDto(eventDto)) ?? null;
      } else {
        Logger.warn(LogModuleName + "Event doesn't exist: " + eventId);
      }

      for (let pipelineItem of flowState.pipeline) {
        const pipelineActivity = applet.activities.find(
          a => a.id === pipelineItem.payload.activityId,
        );

        switch (pipelineItem.type) {
          case 'Stepper': {
            pipelineItem.payload.activityName =
              pipelineActivity?.name ?? "'[Name unknown]'";
            pipelineItem.payload.activityDescription =
              pipelineActivity?.description ?? '[Description unknown]';
            pipelineItem.payload.activityImage =
              pipelineActivity?.image ?? null;
            break;
          }
          case 'Finish':
          case 'Summary':
          case 'Intermediate':
            pipelineItem.payload.activityName =
              pipelineActivity?.name ?? '[Name unknown]';
            break;
        }
      }

      setFlowState(key, flowState);

      const updateFlowState: FlowState = getFlowState(key)!;

      Logger.info(
        LogModuleName +
          'Pipeline flow state updated. After update:\n' +
          JSON.stringify(updateFlowState, null, 2),
      );
    }
  };

  const migrate = () => {
    try {
      Logger.log(LogModuleName + 'Migration #1 started');
      migrateInternal();
      Logger.log(LogModuleName + 'Migration #1 completed');
    } catch (error) {
      Logger.warn(
        LogModuleName + 'Error occurred:\n\nInternal error\n' + error,
      );
    }
  };

  return {
    migrate,
  };
};

export default useMigration1;
