import { StackedItem } from '../../StackedItemsGrid';

const stackedCheckboxConfig = {
  setAlerts: false,
  addTooltip: false,
  addScores: false,
  rows: [
    {
      id: '6bb6a6cf-5866-44df-8e83-722ff8edbf22',
      rowName: '1',
      rowImage: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg',
      tooltip: null,
    },
    {
      id: '3f8bab53-e06b-43bb-be9f-78afde47c920',
      rowName: '2',
      rowImage: null,
      tooltip: null,
    },
    {
      id: '3420d860-0496-4c61-b376-ac384bafcdbe',
      rowName: '3',
      rowImage: null,
      tooltip: null,
    },
  ],
  options: [
    {
      id: '37269e0e-9220-4c53-b3e6-86ec70c6a1d2',
      text: '1',
      image: null,
      tooltip: null,
    },
    {
      id: '155e78bd-3966-4c8e-b437-85bd98233fa4',
      text: '2',
      image: null,
      tooltip: null,
    },
    {
      id: 'c35e3d08-26b4-424a-8dc6-dfceda059361',
      text: '3',
      image: 'https://www.imgonline.com.ua/examples/bee-on-daisy.jpg',
      tooltip: null,
    },
  ],
  dataMatrix: [],
};

const selectedValues: Array<Array<StackedItem>> = [
  [
    {
      id: '37269e0e-9220-4c53-b3e6-86ec70c6a1d2',
      text: '1',
      image: null,
      tooltip: '',
    },
  ],
  [],
  [
    {
      id: 'c35e3d08-26b4-424a-8dc6-dfceda059361',
      text: '4',
      image: null,
      tooltip: '',
    },
  ],
];

export default { stackedCheckboxConfig, selectedValues };
