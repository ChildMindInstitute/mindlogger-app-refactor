// import httpService from './httpService';
// import { SuccessfulResponse } from '../types';

export type ThemeDto = {
  id: string;
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

// type ThemeResponse = SuccessfulResponse<ThemeDto[]>;

const mockResponse = {
  data: {
    result: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: "Artem's test theme",
        logo: 'https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/3:2/w_3329,h_2219,c_limit/1521-WIRED-Cat.jpeg',
        backgroundImage:
          'https://cdn.theatlantic.com/thumbor/XCE6JmFAoBnzgBXWIKl7Wb-q8iI=/0x62:2000x1187/1952x1098/media/img/mt/2018/03/AP_325360162607/original.jpg',
        primaryColor: '#ff4dff',
        secondaryColor: '#8936b3',
        tertiaryColor: '#ffb84d',
      },
    ],
  },
};

function themeService() {
  return {
    getAll() {
      return Promise.resolve(mockResponse);
      // return httpService.get<ThemeResponse>('/themes');
    },
  };
}

export default themeService();
