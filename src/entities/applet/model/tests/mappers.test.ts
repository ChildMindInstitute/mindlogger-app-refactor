import {
  appletDetailsResponse,
  firstAppletDto,
  completedEntityDto,
  secondAppletDto,
  appletDetailsDto,
  themeDto,
  activityRecordsDto,
  analyticsMapperInput,
  analyticsMapperInputWithEmptyAnswers,
  themeDtoWithEmptyImages,
  analyticsMapperInputWithEmptyActivities,
} from './mappers.input.mock';
import {
  appletDetails,
  appletTheme,
  mappedActivities,
  mappedAnalytics,
  mappedAnalyticsWithEmptyAnswers,
  mappedApplets,
  appletThemeWithEmptyImages,
} from './mappers.output.mock.ts';
import {
  mapDtoToRespondentMeta,
  mapCompletedEntityFromDto,
  mapAppletDtoToAppletVersion,
  mapApplets,
  mapAppletDetailsFromDto,
  mapThemeFromDto,
  mapActivitiesFromDto,
  mapAppletAnalytics,
} from '../mappers.ts';

describe('Applet entity mappers tests', () => {
  it('Should return mapped result for respondent meta', async () => {
    const result = mapDtoToRespondentMeta(appletDetailsResponse);

    expect(result).toEqual('Some nick');
  });

  it('Should return empty mapped result for respondent meta', async () => {
    const result = mapDtoToRespondentMeta({
      ...appletDetailsResponse,
      // @ts-expect-error
      respondentMeta: null,
    });

    expect(result).toEqual('');
  });

  it('Should return mapped result for completed entity', async () => {
    const result = mapCompletedEntityFromDto(completedEntityDto);

    expect(result).toEqual({
      endAt: +new Date(
        `${completedEntityDto.localEndDate} ${completedEntityDto.localEndTime}`,
      ),
      entityId: '0',
      eventId: '3',
    });
  });

  it('Should return applet version from Applet Dto', async () => {
    const result = mapAppletDtoToAppletVersion(firstAppletDto);

    expect(result).toEqual({ appletId: '1', version: '1.1.11' });
  });

  it('Should return mapped result for array of applet dtos', async () => {
    const result = mapApplets([firstAppletDto, secondAppletDto]);

    expect(result).toEqual(mappedApplets);
  });

  it('Should return mapped result for applet details dto', async () => {
    const result = mapAppletDetailsFromDto(appletDetailsDto);

    expect(result).toEqual(appletDetails);
  });

  it('Should return mapped result for applet theme dto', async () => {
    const result = mapThemeFromDto(themeDto);

    expect(result).toEqual(appletTheme);
  });

  it('Should return mapped result for applet theme dto with empty images', async () => {
    const result = mapThemeFromDto(themeDtoWithEmptyImages);

    expect(result).toEqual(appletThemeWithEmptyImages);
  });

  it('Should return null for undefined theme', async () => {
    const result = mapThemeFromDto(null);

    expect(result).toEqual(null);
  });

  it('Should return mapped result for activity records dto', async () => {
    const result = mapActivitiesFromDto(activityRecordsDto);

    expect(result).toEqual(mappedActivities);
  });

  it('Should return mapped result for applet analytics', async () => {
    const result = mapAppletAnalytics(analyticsMapperInput);

    expect(result).toEqual(mappedAnalytics);
  });

  it('Should return mapped result for applet analytics with empty answers', async () => {
    const result = mapAppletAnalytics(analyticsMapperInputWithEmptyAnswers);

    expect(result).toEqual(mappedAnalyticsWithEmptyAnswers);
  });

  it('Should return mapped result for applet analytics with empty activities array', async () => {
    const result = mapAppletAnalytics(analyticsMapperInputWithEmptyActivities);

    expect(result).toEqual({ activitiesResponses: [], id: '1' });
  });
});
