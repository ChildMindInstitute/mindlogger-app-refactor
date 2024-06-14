import axios from 'axios';

const httpService = axios.create({
  baseURL: 'https://api-dr.cmiml.net', // @todo revert after testing
  withCredentials: true,
});

httpService.defaults.headers.common['Content-Type'] = 'application/json';
httpService.defaults.headers.common['Mindlogger-Content-Source'] = 'mobile';

export const getAxiosInstance = () => {
  return axios.create();
};

export default httpService;
