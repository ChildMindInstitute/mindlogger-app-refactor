import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Canvas,
  Path,
  Circle,
  Group,
  Text,
  SkPath,
  useFont,
} from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';

import { AbTestPayload } from '@app/abstract/lib/types/abTrails';
import { Point } from '@app/abstract/lib/types/primitive';
import { palette } from '@app/shared/lib/constants/palette';
import { moderatFont } from '@assets/fonts';

import { getEquidistantPoint } from '../lib/utils/calculation';

const FontCrossSize = 20;

const CrossOffsetX = -5;

type Props = {
  testData: AbTestPayload;
  paths?: SkPath[];
  lastPath?: SkPath | null;
  errorPath?: SkPath | null;
  greenRoundOrder?: number | string | null;
};

export const AbShapes: FC<Props> = props => {
  const { nodes, config, deviceType } = props.testData;
  const { paths, greenRoundOrder, errorPath } = props;
  const fontBeginEndSize =
    deviceType === 'mobile' ? config.fontSize / 1.4 : config.fontSizeBeginEnd!;

  const first = nodes[0];

  const last = nodes[nodes.length - 1];

  const fontDigits = useFont(moderatFont, config.fontSize / 1.2);

  const fontBeginEnd = useFont(moderatFont, fontBeginEndSize);

  const fontCross = useFont(moderatFont, FontCrossSize);

  const { t } = useTranslation();

  const getLabelOffset = () => {
    const digitOffset = {
      x1: -config.fontSize / 4,
      x2: -config.fontSize / 2.1,
      y: config.fontSize / 3,
    };
    return digitOffset;
  };

  const getLabelXOffset = (label: string): number => {
    return label.length === 1 ? labelOffset.x1 : labelOffset.x2;
  };

  const getBeginOffset = (): Point => {
    const beginOffsetMobile: Point = {
      x: -4.6,
      y: -7,
    };
    const beginOffsetTablet: Point = {
      x: config.radius - config.beginWordLength! / 2,
      y: -10,
    };
    return deviceType === 'mobile' ? beginOffsetMobile : beginOffsetTablet;
  };

  const getEndOffset = (): Point => {
    const endOffsetMobile: Point = {
      x: 2,
      y: -7,
    };
    const endOffsetTablet: Point = {
      x: config.radius - config.endWordLength! / 2,
      y: -11,
    };
    return deviceType === 'mobile' ? endOffsetMobile : endOffsetTablet;
  };

  const labelOffset = getLabelOffset();

  const beginOffset = getBeginOffset();

  const endOffset = getEndOffset();

  const errorMiddlePoint: Point | null = errorPath
    ? getEquidistantPoint(errorPath)
    : null;

  if (!fontDigits || !fontBeginEnd) {
    return <View />;
  }

  return (
    <View style={styles.canvasView} pointerEvents="none">
      <Canvas style={styles.canvas}>
        {!!paths && (
          <Group>
            {paths.map((path, i) => (
              <Path key={i} path={path} strokeWidth={1.5} style="stroke" />
            ))}
          </Group>
        )}

        {!!errorPath && !!errorMiddlePoint && (
          <Group>
            <Path path={errorPath} strokeWidth={1.5} style="stroke" />

            <Text
              x={errorMiddlePoint.x + CrossOffsetX}
              y={errorMiddlePoint.y}
              text={'x'}
              font={fontCross}
              color={palette.red}
            />
          </Group>
        )}

        <Group>
          {nodes.map((x, i) => (
            <Group key={i}>
              <Circle
                cx={x.cx}
                cy={x.cy}
                r={config.radius}
                color={
                  greenRoundOrder === x.orderIndex
                    ? palette.green
                    : palette.black
                }
              />

              <Text
                x={x.cx + getLabelXOffset(x.label)}
                y={x.cy + labelOffset.y}
                text={x.label}
                font={fontDigits}
                color={palette.white}
              />
            </Group>
          ))}
        </Group>

        <Group>
          <Text
            x={first.cx - config.radius + beginOffset.x}
            y={first.cy - config.radius + beginOffset.y}
            text={t('cognitive:begin')}
            font={fontBeginEnd}
            color={palette.black}
          />

          <Text
            x={last.cx - config.radius + endOffset.x}
            y={last.cy - config.radius + endOffset.y}
            text={t('cognitive:end')}
            font={fontBeginEnd}
            color={palette.black}
          />
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  canvasView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  canvas: {
    height: '100%',
    width: '100%',
  },
});
