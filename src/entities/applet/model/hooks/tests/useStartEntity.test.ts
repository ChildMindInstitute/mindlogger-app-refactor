import { renderHook } from '@testing-library/react-native';

import { ResumeRestartChoice } from '../../../ui/ResumeRestartPrompt';
import { appletActions } from '../../slice';
import { useStartEntity } from '../useStartEntity';

const mockDispatch = jest.fn();
const mockPrompt = jest.fn<Promise<ResumeRestartChoice>, []>();

jest.mock('@app/shared/lib/hooks/redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({}),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({}),
}));

jest.mock('@app/shared/lib/hooks/useAppletInfo', () => ({
  useAppletInfo: () => ({ getName: () => 'Applet' }),
}));

jest.mock('@app/shared/lib/services/loggerInstance', () => ({
  getDefaultLogger: () => ({
    log: jest.fn(),
    warn: jest.fn(),
    cancelSending: jest.fn(),
  }),
}));

jest.mock('@app/shared/lib/services/MigrationValidator', () => ({
  MigrationValidator: { allMigrationHaveBeenApplied: () => true },
}));

jest.mock('@app/shared/lib/utils/networkHelpers', () => ({
  isAppOnline: () => Promise.resolve(true),
}));

jest.mock('@app/shared/lib/utils/survey/survey', () => ({
  getEntityProgression: () => ({}),
  isEntityProgressionInProgress: () => true,
  isProgressionReadyForAutocompletion: () => false,
  isEntityExpired: () => false,
}));

jest.mock('@app/shared/lib/utils/reactQueryHelpers', () => ({
  getAppletDetailsKey: () => ['applet'],
  getDataFromQuery: () => ({
    result: {
      activityFlows: [{ id: 'flow-1', activityIds: ['act-1', 'act-2'] }],
      activities: [
        { id: 'act-1', name: 'A1', description: '', image: null },
        { id: 'act-2', name: 'A2', description: '', image: null },
      ],
    },
  }),
}));

jest.mock('@app/widgets/survey/lib/surveyStateAnalytics', () => ({
  trackStartActivity: jest.fn(),
  trackRestartActivity: jest.fn(),
  trackResumeActivity: jest.fn(),
  trackStartFlow: jest.fn(),
  trackRestartFlow: jest.fn(),
  trackResumeFlow: jest.fn(),
}));

jest.mock('../../../ui/ResumeRestartPrompt', () => ({
  promptResumeRestart: () => mockPrompt(),
}));

const cleanUpMediaFiles = jest.fn();

const renderStartEntity = () =>
  renderHook(() =>
    useStartEntity({
      hasMediaReferences: () => false,
      hasActivityWithHiddenAllItems: () => false,
      cleanUpMediaFiles,
      evaluateAvailableTo: () => null,
      completeEntityIntoUploadToQueue: jest.fn(),
      checkAvailability: () => Promise.resolve(true),
    }),
  ).result.current;

const startActivity = () =>
  renderStartEntity().startActivity(
    'applet-1',
    'act-1',
    'event-1',
    'Activity',
    false,
    null,
    [],
  );

const startFlow = () =>
  renderStartEntity().startFlow(
    'applet-1',
    'flow-1',
    'event-1',
    'Flow',
    false,
    null,
    [],
  );

describe('useStartEntity with an in-progress entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('restarts an activity from scratch after confirmation', async () => {
    mockPrompt.mockResolvedValue('restart');

    const result = await startActivity();

    expect(result).toEqual({ fromScratch: true, failed: false });
    expect(cleanUpMediaFiles).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: appletActions.startActivity.type }),
    );
  });

  it('leaves an activity untouched when the prompt is dismissed', async () => {
    mockPrompt.mockResolvedValue('dismiss');

    const result = await startActivity();

    expect(result).toEqual({ failReason: 'dismissed', failed: true });
    expect(cleanUpMediaFiles).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('restarts a flow from its first activity', async () => {
    mockPrompt.mockResolvedValue('restart');

    const result = await startFlow();

    expect(result).toEqual({ fromScratch: true, failed: false });
    expect(cleanUpMediaFiles).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(
      appletActions.startFlow({
        appletId: 'applet-1',
        flowId: 'flow-1',
        eventId: 'event-1',
        targetSubjectId: null,
        activityId: 'act-1',
        activityName: 'A1',
        activityDescription: '',
        activityImage: null,
        pipelineActivityOrder: 0,
        totalActivities: 2,
        availableTo: null,
      }),
    );
  });
});
