import React, { memo } from "react";
import { View } from "react-native";
import Text from "components/Text";
import colors from "configs/colors";

import styles from "./styles";

interface Props {
  step?: number;
  maxStep?: number;
}

const Steps = ({ step = 1, maxStep = 5 }: Props) => {
  const jsx = [];
  for (let index = 1; index <= maxStep; index++) {
    jsx.push(index);
  }

  return (
    <View style={[styles.container, { flex: 1 }]}>
      {jsx.map(index => (
        <View key={index} style={[styles.containerInner]}>
          {/* check index if less or equal than step then active */}
          {index <= step ? (
            // active steps
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.containerNumber}>
                <Text
                  key={index}
                  size={16}
                  color={colors.white}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ marginTop: -2 }}
                >
                  {index}
                </Text>
              </View>
              {index < maxStep ? (
                <View
                  style={{
                    width: 10,
                    height: 1,
                    backgroundColor:
                      step <= index ? colors.stone300 : colors.red,
                    // blue
                  }}
                />
              ) : null}
            </View>
          ) : (
            // inactive steps
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.containerNumberDisabled}>
                <Text
                  key={index}
                  size={16}
                  color={colors.stone300}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ marginTop: -2 }}
                >
                  {index}
                </Text>
              </View>

              {index < maxStep ? (
                <View
                  style={{
                    width: 10,
                    height: 1,
                    backgroundColor: colors.stone300,
                  }}
                />
              ) : null}
            </View>
          )}

          {/* {index !== maxStep ? (
            <View
              style={{
                backgroundColor: index < step ? colors.red : colors.stone300,
                height: 2,
                flex: 1,
                maxWidth: 14,
                alignSelf: "center",
                marginLeft: -5,
              }}
            />
          ) : null} */}
        </View>
      ))}
    </View>
  );
};

export default memo(Steps);
