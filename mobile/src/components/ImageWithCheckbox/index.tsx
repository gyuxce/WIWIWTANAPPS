import Card from "components/Card";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

import styles from "./styles";
import CheckbooxLoop from "components/CheckboxLoop";

interface ImageWithCheckboxProps {
  data: {
    title: string;
    onPressDetail?: () => void;
    isChecklist?: boolean;
    status: number;
  }[];
  images: any;
}

const ImageWithCheckbox = ({ data, images }: ImageWithCheckboxProps) => {
  return (
    <Card
      style={{
        marginHorizontal: scaledHorizontal(25),
        flexDirection: "row",
      }}
    >
      <Image
        source={images}
        style={{ width: 130, height: 100, resizeMode: "contain" }}
      />
      <View style={styles.containerList}>
        <CheckbooxLoop data={data} />
      </View>
    </Card>
  );
};

export default ImageWithCheckbox;
