import React from 'react';
import { AccessibilityProps } from 'react-native';

import { Svg, Path, G } from 'react-native-svg';

type Props = {
  color: string;
  size?: number;
  tokenLogger?: boolean;
} & AccessibilityProps;

export default ({ color, size = 45, tokenLogger = false, accessibilityLabel }: Props) => {
  if (tokenLogger) {
    return (
      <Svg accessibilityLabel={accessibilityLabel} width={size} height={size} viewBox="0 0 57.156 57.156" fill="none">
        <G transform="translate(1.847 0.693)">
          <Path
            d="M28.578,0A28.578,28.578,0,1,0,57.156,28.578,28.611,28.611,0,0,0,28.578,0Zm0,51.849A23.382,23.382,0,1,1,51.96,28.467,23.408,23.408,0,0,1,28.578,51.849Z"
            transform="translate(-1.847 -0.693)"
            fill={color}
          />

          <Path
            d="M148.5,70a3.5,3.5,0,1,0,3.5,3.5A3.507,3.507,0,0,0,148.5,70Z"
            transform="translate(-121.786 -59.671)"
            fill={color}
          />

          <Path
            d="M152.263,139.485c-1.34,0-4.375.129-3.235,2.053s.265,4.4,0,9.167a53.2,53.2,0,0,0,.437,9.465c.371,1.349.625,2.613,2.172,2.747s5.018.289,3.98-2.747c0,0-1.769-5.975-1.452-10.46s.53-4.5.844-7.085S153.6,139.485,152.263,139.485Z"
            transform="translate(-125.56 -118.841)"
            fill={color}
          />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 70 70" fill="none">
      <G>
        <Path
          d="M17.3688 11.264C17.3688 11.264 11.8423 11.6905 8.66251 12.738C8.38178 12.8309 8.13748 13.0108 7.96459 13.2518C7.7917 13.4929 7.69909 13.7828 7.70001 14.08V19.074C6.06001 19.7007 4.43513 20.4457 2.84376 21.296C2.61766 21.4167 2.42878 21.5974 2.29765 21.8185C2.16652 22.0396 2.09816 22.2926 2.10001 22.55V57.75C2.10205 57.9919 2.16601 58.2292 2.28573 58.439C2.40544 58.6488 2.57687 58.824 2.7835 58.9478C2.99013 59.0716 3.22498 59.1398 3.46543 59.1458C3.70587 59.1518 3.94379 59.0954 4.15626 58.982C8.99547 56.3965 13.9681 54.8942 18.8781 54.934C18.8854 54.9341 18.8927 54.9341 18.9 54.934C24.8644 54.934 30.3239 56.4927 33.6438 58.256C33.8448 58.3679 34.0702 58.4284 34.3 58.432H35.7C35.9298 58.4284 36.1552 58.3679 36.3563 58.256C39.6801 56.4906 45.1389 54.912 51.1 54.912C51.1073 54.9121 51.1146 54.9121 51.1219 54.912C56.0319 54.8719 61.0046 56.3745 65.8438 58.96C66.0562 59.0734 66.2942 59.1298 66.5346 59.1238C66.775 59.1178 67.0099 59.0496 67.2165 58.9258C67.4232 58.802 67.5946 58.6268 67.7143 58.417C67.834 58.2072 67.898 57.9699 67.9 57.728V22.528C67.9026 22.3414 67.8684 22.1562 67.7992 21.9831C67.73 21.8099 67.6273 21.6523 67.497 21.5195C67.3668 21.3866 67.2115 21.2811 67.0404 21.2091C66.8692 21.1371 66.6856 21.1 66.5 21.1C66.3145 21.1 66.1308 21.1371 65.9596 21.2091C65.7885 21.2811 65.6333 21.3866 65.503 21.5195C65.3727 21.6523 65.27 21.8099 65.2009 21.9831C65.1317 22.1562 65.0974 22.3414 65.1 22.528V55.506C60.5773 53.3745 55.8671 52.0613 51.1 52.096C51.0927 52.0961 51.0854 52.0959 51.0781 52.096C46.7951 52.1008 42.834 52.8577 39.5281 53.944C43.442 51.8205 47.8053 50.688 52.5 50.688C55.407 50.688 57.771 51.1434 60.4625 52.03C60.6732 52.0997 60.8972 52.118 61.1163 52.0835C61.3354 52.0491 61.5432 51.9628 61.7226 51.8317C61.902 51.7007 62.0479 51.5287 62.1483 51.3298C62.2487 51.131 62.3007 50.911 62.3 50.688V14.08C62.3009 13.7828 62.2083 13.4929 62.0354 13.2518C61.8625 13.0108 61.6182 12.8309 61.3375 12.738C58.4449 11.7851 55.7036 11.264 52.5 11.264C46.0363 11.264 40.0554 13.3659 35 16.984C29.9448 13.366 23.9641 11.264 17.5 11.264C17.4563 11.2619 17.4125 11.2619 17.3688 11.264ZM17.5 14.08C23.4692 14.08 28.9205 16.0449 33.6 19.47V52.514C28.8423 49.5014 23.3627 47.872 17.5 47.872C14.9788 47.872 12.7472 48.281 10.5 48.884V15.202C13.1077 14.5478 17.2936 14.1002 17.5 14.08ZM52.5 14.08C55.0485 14.08 57.1994 14.4971 59.5 15.18V48.884C57.2528 48.281 55.0212 47.872 52.5 47.872C46.6148 47.872 41.1691 49.5891 36.4 52.624V19.514C41.0829 16.0825 46.5242 14.08 52.5 14.08ZM7.70001 22.132V50.688C7.70277 50.9091 7.75728 51.1265 7.85912 51.3225C7.96097 51.5185 8.10729 51.6877 8.28623 51.8162C8.46517 51.9448 8.6717 52.0291 8.88909 52.0624C9.10648 52.0957 9.32862 52.0771 9.53751 52.008C12.229 51.1214 14.593 50.688 17.5 50.688C22.2294 50.688 26.6237 51.8183 30.5594 53.966C27.2359 52.87 23.2396 52.1206 18.9219 52.118H18.9C14.1329 52.0835 9.42275 53.3965 4.90001 55.528V23.452C5.82613 22.9795 6.76553 22.5388 7.70001 22.132Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
