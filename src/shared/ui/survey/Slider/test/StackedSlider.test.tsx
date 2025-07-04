import { render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { Text } from '@app/shared/ui/Text';

import { sliderConfig, sliderValues } from './mockData';
import { StackedSlider } from '../StackedSlider';
import { SurveySlider } from '../SurveySlider';

describe('StackedSlider', () => {
  it('should render correct slider count', () => {
    const changeHandler = jest.fn();
    const stackedSlider = render(
      <TamaguiProvider>
        <StackedSlider
          config={sliderConfig}
          values={null}
          onChange={changeHandler}
        />
      </TamaguiProvider>,
    );

    const rows = stackedSlider.root.findAllByType(SurveySlider);

    expect(rows.length).toBe(2);
  });

  it('should render correct slider values', () => {
    const changeHandler = jest.fn();
    const stackedSlider = render(
      <TamaguiProvider>
        <StackedSlider
          config={sliderConfig}
          values={sliderValues}
          onChange={changeHandler}
        />
      </TamaguiProvider>,
    );

    const rows = stackedSlider.root.findAllByType(SurveySlider);

    expect(rows.length).toBe(2);

    const firstRowValue = rows[0].props.initialValue;
    const secondRowValue = rows[1].props.initialValue;

    expect(firstRowValue).toBe(2);
    expect(secondRowValue).toBe(1);
  });

  it('should render right and left images', () => {
    const changeHandler = jest.fn();
    const stackedSlider = render(
      <TamaguiProvider>
        <StackedSlider
          config={sliderConfig}
          values={sliderValues}
          onChange={changeHandler}
        />
      </TamaguiProvider>,
    );

    const rightImages = stackedSlider.root.findAllByProps({
      'data-test': 'slide-right-image',
    });

    const leftImages = stackedSlider.root.findAllByProps({
      'data-test': 'slide-left-image',
    });

    expect(rightImages.length).toBe(1);
    expect(leftImages.length).toBe(1);
  });

  it('should render right and left titles', () => {
    const changeHandler = jest.fn();
    const stackedSlider = render(
      <TamaguiProvider>
        <StackedSlider
          config={sliderConfig}
          values={sliderValues}
          onChange={changeHandler}
        />
      </TamaguiProvider>,
    );

    const textComponents = stackedSlider.root.findAllByType(Text);

    const rightTitles = textComponents.filter(
      component => component.props['data-test'] === 'slide-right-title',
    );

    const leftTitles = textComponents.filter(
      component => component.props['data-test'] === 'slide-left-title',
    );

    expect(rightTitles.length).toBe(2);
    expect(leftTitles.length).toBe(2);
  });
});
