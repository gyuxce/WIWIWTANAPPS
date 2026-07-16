import { StyleSheet, View } from "react-native";
import React from "react";
import colors from "configs/colors";
import Text from "components/Text";
import Space from "components/Space";
import Button from "components/Button";

interface Props {
  title: string;
  isButton?: boolean;
  score?: number;
  btnTitle?: string;
}

const CardLessonScore = ({ isButton, score, btnTitle, title }: Props) => {
  return (
    <View style={styles.wrapper}>
      <Text size={12} type="bold" variant="CenturyGothicBold">
        {title}
      </Text>
      <Space height={12} />
      {isButton ? (
        <Button
          title={btnTitle}
          style={{ height: 48 }}
          textType="bold"
          fontSize={12}
          variant="CenturyGothicBold"
        />
      ) : (
        <View style={styles.wrapScore}>
          <Text size={10}>Skor</Text>
          <Space width={8} />
          <Text size={32} variant="OpificioNeueRegular" color={colors.orange}>
            {score}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
  },
  wrapScore: {
    backgroundColor: colors.stone100,
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CardLessonScore;
