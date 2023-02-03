import httpService from './httpService';

type AppletDetailsDto = {
  id: number;
  name?: string;
  displayName: string;
  description: string;
};

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
};

function activitiesService() {
  return {
    getAppletDetails(id: number) {
      return httpService.get<AppletDetailsResponse>(`/applets/${id}`);
    },
  };
}

export default activitiesService();
