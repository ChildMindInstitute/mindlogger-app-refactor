import axios from 'axios';

// import { API_URL } from '@shared/lib';

const httpService = axios.create({
  // * [TODO] Revert it later when the backend changes
  // * regarding LORIS integration are merged to dev
  // baseURL: API_URL,
  baseURL: 'https://api-dr.cmiml.net',
  withCredentials: true,
});

httpService.defaults.headers.common['Content-Type'] = 'application/json';

export default httpService;
