import { AppRegistry } from 'react-native';

import { jobRunner } from './src/shared/lib';
import requestInterception from './src/jobs/request-interception';
import responseInterception from './src/jobs/response-interception';
import setBackgroundTask from './src/jobs/set-background-task';
import displayRemoteNotifications from './src/jobs/display-remote-notifications';
import localization from './src/jobs/localization';
import App from './src/app';
import { name as appName } from './app.json';

jobRunner.runAll([
  requestInterception,
  responseInterception,
  setBackgroundTask,
]);

jobRunner.runAllSync([localization, displayRemoteNotifications]);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
