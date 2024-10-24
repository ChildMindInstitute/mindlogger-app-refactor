import {
  getIsMobileOnly,
  getIsWebOnly,
  getSupportsMobile,
  getSupportsWeb,
} from '.';

describe('getSupportsWeb', () => {
  test.each`
    responseType          | expected | description
    ${'ABTrails'}         | ${false} | ${'Returns false for ABTrails'}
    ${'audio'}            | ${false} | ${'Returns false for Audio'}
    ${'audioPlayer'}      | ${true}  | ${'Returns true for AudioPlayer'}
    ${'date'}             | ${true}  | ${'Returns true for Date'}
    ${'drawing'}          | ${false} | ${'Returns false for Drawing'}
    ${'flanker'}          | ${false} | ${'Returns false for Flanker'}
    ${'geolocation'}      | ${false} | ${'Returns false for Geolocation'}
    ${'message'}          | ${true}  | ${'Returns true for Message'}
    ${'multiSelect'}      | ${true}  | ${'Returns true for MultipleSelection'}
    ${'multiSelectRows'}  | ${true}  | ${'Returns true for MultipleSelectionPerRow'}
    ${'numberSelect'}     | ${true}  | ${'Returns true for numberSelect'}
    ${'paragraphText'}    | ${true}  | ${'Returns true for ParagraphText'}
    ${'photo'}            | ${false} | ${'Returns false for Photo'}
    ${'phrasalTemplate'}  | ${true}  | ${'Returns true for PhrasalTemplate'}
    ${'singleSelect'}     | ${true}  | ${'Returns true for SingleSelection'}
    ${'singleSelectRows'} | ${true}  | ${'Returns true for singleSelectRows'}
    ${'slider'}           | ${true}  | ${'Returns true for slider'}
    ${'sliderRows'}       | ${true}  | ${'Returns true for sliderRows'}
    ${'stabilityTracker'} | ${false} | ${'Returns false for stabilityTracker'}
    ${'text'}             | ${true}  | ${'Returns true for Text'}
    ${'time'}             | ${true}  | ${'Returns true for time'}
    ${'timeRange'}        | ${true}  | ${'Returns true for timeRange'}
    ${'unity'}            | ${false} | ${'Returns false for unity'}
    ${'video'}            | ${false} | ${'Returns false for video'}
    ${'test'}             | ${false} | ${'Returns false for other response types'}
    ${1}                  | ${false} | ${'Returns false for other response types'}
    ${false}              | ${false} | ${'Returns false for other response types'}
  `('$description', ({ responseType, expected }) => {
    expect(getSupportsWeb(responseType)).toEqual(expected);
  });

  describe('getSupportsMobile', () => {
    test.each`
      responseType          | expected | description
      ${'ABTrails'}         | ${true}  | ${'Returns true for ABTrails'}
      ${'audio'}            | ${true}  | ${'Returns true for Audio'}
      ${'audioPlayer'}      | ${true}  | ${'Returns true for AudioPlayer'}
      ${'date'}             | ${true}  | ${'Returns true for Date'}
      ${'drawing'}          | ${true}  | ${'Returns true for Drawing'}
      ${'flanker'}          | ${true}  | ${'Returns true for Flanker'}
      ${'geolocation'}      | ${true}  | ${'Returns true for Geolocation'}
      ${'message'}          | ${true}  | ${'Returns true for Message'}
      ${'multiSelect'}      | ${true}  | ${'Returns true for MultipleSelection'}
      ${'multiSelectRows'}  | ${true}  | ${'Returns true for MultipleSelectionPerRow'}
      ${'numberSelect'}     | ${true}  | ${'Returns true for numberSelect'}
      ${'paragraphText'}    | ${true}  | ${'Returns true for ParagraphText'}
      ${'photo'}            | ${true}  | ${'Returns true for Photo'}
      ${'phrasalTemplate'}  | ${false} | ${'Returns false for PhrasalTemplate'}
      ${'singleSelect'}     | ${true}  | ${'Returns true for SingleSelection'}
      ${'singleSelectRows'} | ${true}  | ${'Returns true for singleSelectRows'}
      ${'slider'}           | ${true}  | ${'Returns true for slider'}
      ${'sliderRows'}       | ${true}  | ${'Returns true for sliderRows'}
      ${'stabilityTracker'} | ${true}  | ${'Returns true for stabilityTracker'}
      ${'text'}             | ${true}  | ${'Returns true for Text'}
      ${'time'}             | ${true}  | ${'Returns true for time'}
      ${'timeRange'}        | ${true}  | ${'Returns true for timeRange'}
      ${'unity'}            | ${false} | ${'Returns false for unity'}
      ${'video'}            | ${true}  | ${'Returns true for video'}
      ${'test'}             | ${false} | ${'Returns false for other response types'}
      ${1}                  | ${false} | ${'Returns false for other response types'}
      ${false}              | ${false} | ${'Returns false for other response types'}
    `('$description', ({ responseType, expected }) => {
      expect(getSupportsMobile(responseType)).toEqual(expected);
    });
  });

  describe('getIsWebOnly', () => {
    test.each`
      responseType          | expected | description
      ${'ABTrails'}         | ${false} | ${'Returns false for ABTrails'}
      ${'audio'}            | ${false} | ${'Returns false for Audio'}
      ${'audioPlayer'}      | ${false} | ${'Returns false for AudioPlayer'}
      ${'date'}             | ${false} | ${'Returns false for Date'}
      ${'drawing'}          | ${false} | ${'Returns false for Drawing'}
      ${'flanker'}          | ${false} | ${'Returns false for Flanker'}
      ${'geolocation'}      | ${false} | ${'Returns false for Geolocation'}
      ${'message'}          | ${false} | ${'Returns false for Message'}
      ${'multiSelect'}      | ${false} | ${'Returns false for MultipleSelection'}
      ${'multiSelectRows'}  | ${false} | ${'Returns false for MultipleSelectionPerRow'}
      ${'numberSelect'}     | ${false} | ${'Returns false for numberSelect'}
      ${'paragraphText'}    | ${false} | ${'Returns false for ParagraphText'}
      ${'photo'}            | ${false} | ${'Returns false for Photo'}
      ${'phrasalTemplate'}  | ${true}  | ${'Returns true for PhrasalTemplate'}
      ${'singleSelect'}     | ${false} | ${'Returns false for SingleSelection'}
      ${'singleSelectRows'} | ${false} | ${'Returns false for singleSelectRows'}
      ${'slider'}           | ${false} | ${'Returns false for slider'}
      ${'sliderRows'}       | ${false} | ${'Returns false for sliderRows'}
      ${'stabilityTracker'} | ${false} | ${'Returns false for stabilityTracker'}
      ${'text'}             | ${false} | ${'Returns false for Text'}
      ${'time'}             | ${false} | ${'Returns false for time'}
      ${'timeRange'}        | ${false} | ${'Returns false for timeRange'}
      ${'unity'}            | ${false} | ${'Returns false for unity'}
      ${'video'}            | ${false} | ${'Returns false for video'}
      ${'test'}             | ${false} | ${'Returns false for other response types'}
      ${1}                  | ${false} | ${'Returns false for other response types'}
      ${false}              | ${false} | ${'Returns false for other response types'}
    `('$description', ({ responseType, expected }) => {
      expect(getIsWebOnly(responseType)).toEqual(expected);
    });

    describe('getIsMobileOnly', () => {
      test.each`
        responseType            | expected | description
        ${'ABTrails'}           | ${true}  | ${'Returns true for ABTrails'}
        ${'audio'}              | ${true}  | ${'Returns true for Audio'}
        ${'audioPlayer'}        | ${false} | ${'Returns false for AudioPlayer'}
        ${'date'}               | ${false} | ${'Returns false for Date'}
        ${'drawing'}            | ${true}  | ${'Returns true for Drawing'}
        ${'flanker'}            | ${true}  | ${'Returns true for Flanker'}
        ${'geolocation'}        | ${true}  | ${'Returns true for Geolocation'}
        ${'message'}            | ${false} | ${'Returns false for Message'}
        ${'multiSelect'}        | ${false} | ${'Returns false for MultipleSelection'}
        ${'multiSelectRows'}    | ${false} | ${'Returns false for MultipleSelectionPerRow'}
        ${'numberSelect'}       | ${false} | ${'Returns false for numberSelect'}
        ${'paragraphText'}      | ${false} | ${'Returns false for paragraphText'}
        ${'photo'}              | ${true}  | ${'Returns true for photo'}
        ${'phrasalTemplate'}    | ${false} | ${'Returns false for PhrasalTemplate'}
        ${'singleSelect'}       | ${false} | ${'Returns false for singleSelect'}
        ${'singleSelectPerRow'} | ${false} | ${'Returns false for singleSelectPerRow'}
        ${'slider'}             | ${false} | ${'Returns false for slider'}
        ${'sliderRows'}         | ${false} | ${'Returns false for sliderRows'}
        ${'stabilityTracker'}   | ${true}  | ${'Returns true for stabilityTracker'}
        ${'text'}               | ${false} | ${'Returns false for Text'}
        ${'time'}               | ${false} | ${'Returns false for time'}
        ${'timeRange'}          | ${false} | ${'Returns false for timeRange'}
        ${'unity'}              | ${false} | ${'Returns false for unity'}
        ${'video'}              | ${true}  | ${'Returns true for video'}
        ${'test'}               | ${false} | ${'Returns false for other response types'}
        ${1}                    | ${false} | ${'Returns false for other response types'}
        ${false}                | ${false} | ${'Returns false for other response types'}
      `('$description', ({ responseType, expected }) => {
        expect(getIsMobileOnly(responseType)).toEqual(expected);
      });
    });
  });
});
