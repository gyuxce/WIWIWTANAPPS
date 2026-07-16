import Button from "components/Button";
import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const BulletinInfo = () => {
  return (
    <View>
      <Space height={30} />
      <View style={{ marginHorizontal: scaledHorizontal(25) }}>
        <Card
          style={{
            alignItems: "center",
            paddingHorizontal: scaledHorizontal(30),
          }}
        >
          <Image
            source={images.imagePerjalanan}
            style={{ width: 130, height: 105, resizeMode: "cover" }}
          />
          <Space height={20} />
          <Text size={40} color={colors.accent}>
            おめでとう!
          </Text>
          <Text size={16} color={colors.accent} style={{ fontWeight: "600" }}>
            Selamat!
          </Text>
          <Space height={25} />
          <Text textAlign="center" size={12}>
            Kamu sudah melewati tahap Pre-Test. Yuk selesaikan proses pembayaran
            dan bergabung dengan keluarga Wiwitan
          </Text>
          <Space height={20} />
          <Button
            title="Tutup"
            style={{ paddingVertical: 12, width: "100%" }}
            textStyle={{ fontWeight: "600" }}
          />
        </Card>
      </View>
    </View>
  );
};

export default BulletinInfo;
