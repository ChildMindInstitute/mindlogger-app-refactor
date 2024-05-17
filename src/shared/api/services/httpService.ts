import axios from 'axios';

import { API_URL } from '@shared/lib';

const httpService = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

httpService.defaults.headers.common['Content-Type'] = 'application/json';
httpService.defaults.headers.common['Mindlogger-Content-Source'] = 'mobile';

export const getAxiosInstance = () => {
  return axios.create();
};

export default httpService;
