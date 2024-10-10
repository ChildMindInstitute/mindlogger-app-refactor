import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';

import PropTypes from 'prop-types';

import { Buffer } from 'buffer';

import process from 'process';

import { jobRunner } from '@shared/lib/services/jobManagement';

import { name as appName } from './app.json';
import App from './src/app';
import displayRemoteNotifications from './src/jobs/display-remote-notifications';
import localization from './src/jobs/localization';
import requestInterception from './src/jobs/request-interception';
import responseInterception from './src/jobs/response-interception';
import setBackgroundTask from './src/jobs/set-background-task';

global.Buffer = Buffer;
global.process = process;

jobRunner
  .runAll([requestInterception, responseInterception, setBackgroundTask])
  .catch(console.error);

jobRunner
  .runAllSync([localization, displayRemoteNotifications])
  .catch(console.error);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

HeadlessCheck.propTypes = {
  isHeadless: PropTypes.bool,
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
