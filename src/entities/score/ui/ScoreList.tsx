import { Box, YStack } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import { Score, Props as ScoreProps } from './Score';

type Props = {
  label: string;
  scores: ScoreProps[];
};

export function ScoreList({ label, scores }: Props) {
  return (
    <Box btw={1} btc="$surface_variant" aria-label="scores-group">
      <Text
        fontSize={22}
        lineHeight={28}
        my={16}
        aria-label="scores-group-name"
      >
        {label}
      </Text>

      <YStack space={16}>
        {scores.map((score, index) => (
          <Score
            key={index}
            label={score.label}
            value={score.value}
            highlighted={score.highlighted}
          />
        ))}
      </YStack>
    </Box>
  );
}
