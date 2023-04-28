/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { jobRunner } from './src/shared/lib';
import requestInterception from './src/jobs/request-interception';
import responseInterception from './src/jobs/response-interception';
import setBackgroundTask from './src/jobs/set-background-task';

import App from './src/app';
import { name as appName } from './app.json';

jobRunner.runAll([
  requestInterception,
  responseInterception,
  setBackgroundTask,
]);

AppRegistry.registerComponent(appName, () => App);
