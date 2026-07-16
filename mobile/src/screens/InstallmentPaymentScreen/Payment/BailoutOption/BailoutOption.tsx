import Card from "components/Card";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import SectionInfo from "components/SectionInfo";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import Text from "components/Text";
import Button from "components/Button";
import Space from "components/Space";
import fonts from "configs/fonts";
import icons from "configs/icons";
import images from "configs/images";
import NavigationService from "utils/NavigationService";

import { InfoBailout } from "./info";

interface BailoutOptionProps {}

const BailoutOption = (props: BailoutOptionProps) => {
  const [form, setForm] = useState({ isAgree: false } as { isAgree: boolean });
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {InfoBailout.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={InfoBailout.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
      </Card>
      <Space height={20} />
      <View
        style={{
          marginHorizontal: scaledHorizontal(25),
          flexDirection: "row",
          gap: 5,
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => setForm({ ...form, isAgree: !form?.isAgree })}
        >
          <Image
            source={form?.isAgree ? icons.checklistBox : icons.box}
            style={{ width: 18, height: 18, resizeMode: "cover" }}
          />
        </TouchableOpacity>

        <Text size={12} variant="CenturyGothicRegular" style={{ flex: 1 }}>
          Saya sudah membaca dengan teliti dan menyetujui seluruh ketentuan dan
          peraturan di atas.
        </Text>
      </View>
      <Space height={10} />
      <Button
        onPress={() =>
          NavigationService.push("PaymentTypeScreen", {
            textJapan: "ありがとうございます！",
            textTitle: "Terima kasih!",
            textSubtitle:
              "Proses beasiswa kamu akan segera diproses. Semoga semua berjalan lancar dan kamud apat bergabung di Wiwitan ya!",
            textButton: "Kembali ke Pembayaran",
            identifier: "scholarship-payment",
            image: images.perjalananStatus,
            titleType: "big",
            imageSize: "small",
          })
        }
        title="Lanjutkan"
        style={{
          paddingVertical: scaledVertical(25),
          marginHorizontal: scaledHorizontal(25),
        }}
        textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
      />
    </View>
  );
};

export default BailoutOption;
