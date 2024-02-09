import { getChunkedPointsAsStrings } from './helpers';
import { DrawLine } from '../types';

const ResponseSerializer = function () {
  const getSvgStart = () => {
    return '<svg height="100" width="100" preserveAspectRatio="xMidYMid meet">';
  };

  const getSvgEnd = () => {
    return '</svg>';
  };

  const getPolyline = (points: string) => {
    return `<polyline points="${points}" fill="none" stroke="black" stroke-width="0.6"></polyline>`;
  };

  const serialize = (logLines: DrawLine[], width: number): string => {
    const ratio = 100 / width;

    const transformedLines = logLines.map<DrawLine>((l) => ({
      startTime: l.startTime,
      points: l.points.map((p) => ({
        time: p.time,
        x: p.x * ratio,
        y: p.y * ratio,
      })),
    }));

    const chunks: string[] = getChunkedPointsAsStrings(transformedLines);

    const polyLines: string[] = chunks.map((x) => getPolyline(x));

    const joinedLineNodes = polyLines.join('\n');

    const svgStart = getSvgStart();

    const svgEnd = getSvgEnd();

    const svg = [svgStart, joinedLineNodes, svgEnd].join('\n');

    return svg;
  };

  return {
    process: serialize,
  };
};

export default ResponseSerializer();
