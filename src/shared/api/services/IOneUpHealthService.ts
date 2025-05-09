import { AxiosInstance, AxiosResponse } from 'axios';

export type OneUpHealthRetrieveTokenRequest = {
  appletId: string;
  submitId: string;
  activityId: string;
};

export type OneUpHealthRetrieveTokenResponse = {
  result: {
    accessToken: string;
    refreshToken: string;
    subjectId: string;
    submitId: string;
    oneupUserId: number;
  };
};

export type OneUpHealthSystemSearchRequest = {
  searchQuery?: string;
  offset?: number;
  systemType?: string;
};

export type OneUpHealthSystemSearchResponse = [
  {
    id: number;
    name: string;
    address: string;
    fhirVersion: string;
    ehr: string;
    resourceUrl: string;
    logo: string;
  },
];

export type IOneUpHealthService = {
  retrieveOneUpHealthToken: (
    request: OneUpHealthRetrieveTokenRequest,
  ) => Promise<AxiosResponse<OneUpHealthRetrieveTokenResponse>>;

  systemSearch: (
    request: OneUpHealthSystemSearchRequest,
    axiosInstance: AxiosInstance,
  ) => Promise<AxiosResponse<OneUpHealthSystemSearchResponse>>;
};
