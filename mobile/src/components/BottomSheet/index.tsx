import React, { memo } from "react";
import type { ViewStyle } from "react-native";
import { View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import Modal from "react-native-modal";
import globalStyles from "utils/GlobalStyles";

import styles from "./styles";

interface Props {
  children: React.ReactNode;
  isVisible?: boolean;
  onSwipeComplete?: () => void | undefined;
  onBackdropPress?: () => void | undefined;
  lineStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];
}

const Component = ({
  isVisible = false,
  onSwipeComplete = undefined,
  onBackdropPress = undefined,
  children,
  lineStyle,
  style,
}: Props) => (
  <Modal
    testID="modal"
    isVisible={isVisible}
    onBackdropPress={onBackdropPress}
    onSwipeComplete={onSwipeComplete}
    swipeDirection={["down"]}
    onBackButtonPress={onSwipeComplete}
    propagateSwipe
    style={[
      styles.wrapper,
      globalStyles().topSafeArea,
      { backgroundColor: "transparent" },
    ]}
  >
    <RootSiblingParent>
      <View style={[styles.innerWrap, style]}>
        <View style={[styles.line, lineStyle]} />
        {children}
      </View>
    </RootSiblingParent>
  </Modal>
);

export default memo(Component);
