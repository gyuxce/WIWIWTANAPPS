import React from "react";
import type { ImageSourcePropType } from "react-native";
import { View, StyleSheet, Platform, Image } from "react-native";
import Toast from "react-native-root-toast";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import Text from "components/Text";

export interface ToastComponentProps {
  visible: boolean;
  text: string;
  withIcon?: boolean;
  icon?: ImageSourcePropType;
  onShown?: () => void;
  onHide?: () => void;
}

const ToastComponent = ({
  visible,
  text,
  withIcon,
  icon,
  onShown,
  onHide,
}: ToastComponentProps) => {
  return (
    <Toast
      visible={visible}
      position={
        Platform.OS === "ios"
          ? Toast.positions.TOP + scaledVertical(160)
          : Toast.positions.TOP + scaledVertical(80)
      }
      duration={2}
      shadow={true}
      animation={true}
      hideOnPress={true}
      backgroundColor={"white"}
      opacity={1.0}
      containerStyle={styles.container}
      onShown={onShown}
      onHide={onHide}
    >
      <View style={styles.innerContainer}>
        {withIcon && icon ? (
          <Image
            source={icon}
            style={{ height: 25, width: 25 }}
            resizeMode={"contain"}
          />
        ) : null}
        <View
          style={{
            width: scaledHorizontal(295),
            marginRight: scaledHorizontal(10),
          }}
        >
          <Text
            size={14}
            style={{ marginLeft: withIcon ? scaledHorizontal(10) : 0 }}
            numberOfLines={2}
          >
            {text}
          </Text>
        </View>
      </View>
    </Toast>
  );
};

export default ToastComponent;

const styles = StyleSheet.create({
  container: {
    width: "85%",
    backgroundColor: "white",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
  },
  innerContainer: {
    paddingHorizontal: scaledHorizontal(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: scaledVertical(12),
  },
});
