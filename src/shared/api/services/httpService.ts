import axios from 'axios';

//import { API_URL } from '@shared/lib';

//console.log('API_URL', API_URL);

const httpService = axios.create({
  baseURL: 'https://api-dev.cmiml.net', // API_URL,
  withCredentials: true,
});

httpService.defaults.headers.common['Content-Type'] = 'application/json';

export default httpService;
