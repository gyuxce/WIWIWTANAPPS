import React, { memo } from "react";
import { View } from "react-native";

interface Props {
  height?: number;
  width?: number;
}

const Space = ({ width = 0, height = 0 }: Props) => <View style={{ height, width }} />;

export default memo(Space);
