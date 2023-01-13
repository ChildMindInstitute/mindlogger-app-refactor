import axios from 'axios';

const API_URL = 'https://api-dev.cmiml.net/';

const httpService = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

httpService.defaults.headers.common['Content-Type'] = 'application/json';

export default httpService;
