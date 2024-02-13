import { Box, Text, YStack } from '@shared/ui';

import Score, { Props as ScoreProps } from './Score';

type Props = {
  label: string;
  scores: ScoreProps[];
};

function ScoreList({ label, scores }: Props) {
  return (
    <Box btw={1} btc="$lighterGrey0" px={20}>
      <Text fontWeight="600" fontSize={25} mt={10} mb={15}>
        {label}
      </Text>

      <YStack space={20}>
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

export default ScoreList;
