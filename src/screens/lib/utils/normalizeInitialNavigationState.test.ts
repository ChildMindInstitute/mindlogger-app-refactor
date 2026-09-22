import { NavigationState, PartialState } from '@react-navigation/routers';

import { dropAppletDetailsTabState } from './normalizeInitialNavigationState';
import { RootStackParamList } from '../../config/types';

type Route = NavigationState<RootStackParamList>['routes'][number];

const tabState = {
  index: 1,
  key: 'tab-1',
  routeNames: ['ActivityList', 'Data', 'About'],
  routes: [
    { key: 'ActivityList-1', name: 'ActivityList' },
    { key: 'Data-1', name: 'Data' },
    { key: 'About-1', name: 'About' },
  ],
  stale: false,
  type: 'tab',
} as unknown as PartialState<NavigationState>;

const appletDetailsRoute = (): Route =>
  ({
    key: 'AppletDetails-1',
    name: 'AppletDetails',
    params: { appletId: 'applet-1', title: 'Applet One' },
    state: tabState,
  }) as Route;

const appletsRoute = (): Route =>
  ({ key: 'Applets-1', name: 'Applets' }) as Route;

const buildState = (routes: Route[]): NavigationState<RootStackParamList> =>
  ({
    index: routes.length - 1,
    key: 'stack-1',
    routeNames: ['Applets', 'AppletDetails'],
    routes,
    stale: false,
    type: 'stack',
  }) as unknown as NavigationState<RootStackParamList>;

describe('dropAppletDetailsTabState', () => {
  it('Should return undefined when there is no persisted state', () => {
    expect(dropAppletDetailsTabState(undefined)).toBeUndefined();
  });

  it('Should drop the tab state but keep the AppletDetails route', () => {
    const state = buildState([appletDetailsRoute()]);

    const routes = dropAppletDetailsTabState(state)?.routes ?? [];
    const route = routes[0];

    expect('state' in route).toBe(false);
    expect(route.name).toBe('AppletDetails');
    expect(route.params).toEqual({ appletId: 'applet-1', title: 'Applet One' });
  });

  it('Should leave other routes in the stack untouched', () => {
    const applets = appletsRoute();
    const state = buildState([applets, appletDetailsRoute()]);

    const routes = dropAppletDetailsTabState(state)?.routes ?? [];

    expect(routes[0]).toBe(applets);
    expect('state' in routes[1]).toBe(false);
  });
});
