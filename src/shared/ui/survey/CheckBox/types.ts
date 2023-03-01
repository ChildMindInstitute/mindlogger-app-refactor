export type Item = {
  name: { en: string };
  value: number;
  color: string;
  isVis: boolean;
  description: string;
  image?: string;
};
//
// type RefactoredConfig = {
//   multipleChoice: boolean;
//   scoring: boolean;
//   minValue: number;
//   maxValue: number;
//   colorPalette: boolean;
//   randomizeOptions: boolean;
//   isTokenType: boolean; // was valueType: 'http://www.w3.org/2001/XMLSchema#token' | string;
//   items: [
//     {
//       name: string;
//       value: number;
//       isVisible: boolean;
//       image?: string;
//       description: string;
//       color: string;
//       score: number;
//     },
//   ];
//   // was itemList: [
//   //   {
//   //     name: { en: string | number };
//   //     value: string | number;
//   //     isVis: boolean;
//   //     image?: string;
//   //     description: string;
//   //     color: string;
//   //     score: number;
//   //   },
//   // ]
// };
