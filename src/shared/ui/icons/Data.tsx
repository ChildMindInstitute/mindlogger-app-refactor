import React from 'react';
import { AccessibilityProps } from 'react-native';

import { Svg, Path, G } from 'react-native-svg';

type Props = {
  color: string;
  size?: number;
  tokenLogger?: boolean;
} & AccessibilityProps;

export default ({
  color,
  size = 45,
  tokenLogger = false,
  accessibilityLabel,
}: Props) => {
  if (tokenLogger) {
    return (
      <Svg
        accessibilityLabel={accessibilityLabel}
        width={size}
        height={size}
        viewBox="0 0 59.736 52.938"
        fill="none"
      >
        <G>
          <Path
            d="M13.818,42.879a22.7,22.7,0,0,1,15.425-1.345,21.155,21.155,0,0,1,5.028,2.4,27.442,27.442,0,0,1,7.04,6.264.7.7,0,0,1-.254,1.066l-2.884,1.321a23.591,23.591,0,0,1-10.433,1.587,20,20,0,0,1-3.865-.727,16.913,16.913,0,0,1-10.7-9.124l-.133-.327a.7.7,0,0,1,.339-.885Z"
            transform="translate(-12.994 -40.725)"
            fill={color}
          />

          <Path
            d="M193.276,126.223a.383.383,0,0,1-.012.485c-2.108,2.411-11.317,2.036-12.832.715a2.992,2.992,0,0,1-.836-1.212c-6.907-17.763,2.847-38.047,6.4-44.469a2.742,2.742,0,0,1,3.368-1.236l.364.133a1.432,1.432,0,0,1,.824,2.011c-.739,1.442-2.435,6.531-3.162,8.676-1.466,4.338-2.266,12.941-.691,20.235C188.672,120.7,192.392,125.072,193.276,126.223Z"
            transform="translate(-157.288 -75.529)"
            fill={color}
          />

          <Path
            d="M292.812,71.645A22.659,22.659,0,0,0,277.9,67.513a20.9,20.9,0,0,0-5.38,1.442,27.41,27.41,0,0,0-8.082,4.9.679.679,0,0,0,.061,1.066l2.617,1.842a23.458,23.458,0,0,0,9.972,3.453,19.34,19.34,0,0,0,3.926-.012A16.941,16.941,0,0,0,293.2,73.172l.194-.315a.654.654,0,0,0-.17-.9Z"
            transform="translate(-233.766 -64.172)"
            fill={color}
          />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 57 57" fill="none">
      <Path
        d="M11.1644 27.6851C13.2278 27.6851 14.9055 25.9878 14.9055 23.9046C14.9055 22.7872 14.4134 21.7926 13.6496 21.1014L19.5719 12.5459C20.0184 12.7379 20.5105 12.8435 21.0254 12.8435C22.002 12.8435 22.8855 12.4538 23.5524 11.8336L29.2657 15.2858C29.2277 15.5008 29.1992 15.7216 29.1992 15.9482C29.1992 18.0333 30.8769 19.7286 32.9403 19.7286C35.0037 19.7286 36.6814 18.0333 36.6814 15.9482C36.6814 14.6656 36.043 13.5347 35.074 12.8512L37.8214 5.03872H40.5156C40.9374 6.65728 42.3871 7.86112 44.1199 7.86112C46.1833 7.86112 47.861 6.16576 47.861 4.08064C47.861 1.99552 46.1833 0.300159 44.1199 0.300159C42.3871 0.300159 40.9412 1.50208 40.5175 3.11872H37.1526C36.7498 3.11872 36.3907 3.376 36.2577 3.75808L33.2861 12.2022C33.1702 12.1907 33.0581 12.1677 32.9403 12.1677C31.787 12.1677 30.7667 12.7091 30.0808 13.5405L24.5727 10.2112C24.6886 9.8464 24.7684 9.46624 24.7684 9.06304C24.7684 6.97792 23.0907 5.28256 21.0273 5.28256C18.9639 5.28256 17.2843 6.976 17.2843 9.06112C17.2843 9.92896 17.5864 10.7181 18.0747 11.3574L11.9472 20.2125C11.6945 20.1587 11.4342 20.1261 11.1663 20.1261C9.10287 20.1261 7.42517 21.8195 7.42517 23.9046C7.42517 25.9898 9.10097 27.6851 11.1644 27.6851ZM44.1199 2.22016C45.1345 2.22016 45.961 3.05344 45.961 4.07872C45.961 5.104 45.1345 5.94112 44.1199 5.94112C43.1053 5.94112 42.2788 5.10592 42.2788 4.08064C42.2788 3.05536 43.1053 2.22016 44.1199 2.22016ZM32.9403 14.0877C33.9549 14.0877 34.7814 14.9229 34.7814 15.9482C34.7814 16.9734 33.9549 17.8086 32.9403 17.8086C31.9257 17.8086 31.0992 16.9734 31.0992 15.9482C31.0992 14.9229 31.9257 14.0877 32.9403 14.0877ZM21.0254 7.20256C22.04 7.20256 22.8665 8.03776 22.8665 9.06304C22.8665 10.0883 22.04 10.9235 21.0254 10.9235C20.0108 10.9235 19.1843 10.0883 19.1843 9.06304C19.1843 8.03776 20.0108 7.20256 21.0254 7.20256ZM11.1644 22.0461C12.1809 22.0461 13.0055 22.8794 13.0055 23.9046C13.0055 24.9299 12.179 25.7651 11.1644 25.7651C10.1498 25.7651 9.32327 24.9299 9.32327 23.9046C9.32327 22.8813 10.1498 22.0461 11.1644 22.0461Z"
        fill={color}
      />

      <Path
        d="M56.126 50.2701C56.1507 50.2336 56.1773 50.2029 56.1982 50.1626C56.2419 50.0742 56.2628 49.9782 56.2761 49.8765C56.2818 49.84 56.3027 49.8093 56.3046 49.7728C56.3046 49.7651 56.3008 49.7594 56.3008 49.7536C56.3008 49.7498 56.3027 49.7459 56.3027 49.7421C56.3027 49.6058 56.2723 49.4752 56.221 49.3581C56.202 49.3158 56.1697 49.2832 56.145 49.2448C56.0975 49.168 56.0481 49.095 55.9816 49.0355C55.9664 49.0221 55.9607 49.001 55.9436 48.9875L52.3336 46.1152C51.9232 45.7926 51.3247 45.8598 50.9998 46.2765C50.6749 46.6931 50.7452 47.296 51.1575 47.6243L52.6148 48.784H46.8844V12.3827C46.8844 11.8528 46.4588 11.4227 45.9344 11.4227H40.85C40.3256 11.4227 39.9 11.8528 39.9 12.3827V48.7821H36.3565V23.9046C36.3565 23.3747 35.9309 22.9446 35.4065 22.9446H30.4741C29.9497 22.9446 29.5241 23.3747 29.5241 23.9046V48.7821H25.9806V16.3283C25.9806 15.7984 25.555 15.3683 25.0306 15.3683H20.1001C19.5757 15.3683 19.1501 15.7984 19.1501 16.3283V48.7821H15.6085V32.0032C15.6085 31.4733 15.1829 31.0432 14.6585 31.0432H9.72797C9.20357 31.0432 8.77797 31.4733 8.77797 32.0032V48.7821H5.27437L5.37317 7.35424L6.28327 8.65984C6.46757 8.9248 6.76207 9.06688 7.06037 9.06688C7.25037 9.06688 7.44037 9.00928 7.60757 8.89216C8.03697 8.58688 8.13957 7.98784 7.83937 7.55392L5.20977 3.7792C5.19457 3.75808 5.16987 3.7504 5.15467 3.72928C5.09577 3.65824 5.02737 3.60256 4.95137 3.55072C4.91337 3.52384 4.88297 3.49504 4.84117 3.47584C4.74047 3.42592 4.62837 3.39904 4.51057 3.38944C4.48967 3.3856 4.47067 3.37216 4.44977 3.37216C4.44787 3.37216 4.44407 3.37408 4.44217 3.37408C4.43837 3.37408 4.43647 3.37216 4.43267 3.37216H4.43077C4.28257 3.37216 4.14767 3.41248 4.02417 3.47392C4.02037 3.47584 4.01847 3.47776 4.01657 3.47776C3.89877 3.53728 3.79997 3.61792 3.71637 3.71776C3.70497 3.7312 3.68787 3.73696 3.67647 3.7504L0.889173 7.44256C0.569973 7.86496 0.651673 8.46592 1.06967 8.78848C1.48197 9.10912 2.08047 9.0304 2.39967 8.608L3.47317 7.18336L3.37437 49.7402C3.37437 49.9955 3.47127 50.2394 3.65177 50.4198C3.83037 50.6003 4.07167 50.7021 4.32437 50.7021H52.2728L51.0454 51.5469C50.6103 51.8445 50.5001 52.4416 50.7946 52.8794C50.9789 53.152 51.2772 53.2998 51.5793 53.2998C51.7655 53.2998 51.9498 53.248 52.1132 53.1328L55.8885 50.5331C55.9075 50.5216 55.9151 50.4986 55.9322 50.4851C56.0082 50.4237 56.0709 50.3526 56.126 50.2701ZM41.8 13.3427H44.9844V48.6189H41.8V13.3427ZM31.4241 24.8646H34.4565V48.6189H31.4241V24.8646ZM21.0501 17.2883H24.0806V48.6189H21.0501V17.2883ZM10.678 32.9632H13.7085V48.6189H10.678V32.9632Z"
        fill={color}
      />
    </Svg>
  );
};
