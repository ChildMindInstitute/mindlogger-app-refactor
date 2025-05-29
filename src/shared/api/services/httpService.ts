import axios from 'axios';

import {
  API_URL,
  ONEUP_HEALTH_SYSTEM_SEARCH_API_URL,
} from '@app/shared/lib/constants';

export const httpService = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

httpService.defaults.headers.common['Content-Type'] = 'application/json';
httpService.defaults.headers.common['Mindlogger-Content-Source'] = 'mobile';

export const getAxiosInstance = () => {
  return axios.create();
};

export const getOneUpHealthAxiosInstance = (accessToken: string) => {
  return axios.create({
    baseURL: ONEUP_HEALTH_SYSTEM_SEARCH_API_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
