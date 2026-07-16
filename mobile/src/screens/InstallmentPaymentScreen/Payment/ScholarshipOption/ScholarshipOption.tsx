import Card from "components/Card";
import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import Button from "components/Button";
import icons from "configs/icons";
import Text from "components/Text";
import fonts from "configs/fonts";
import NavigationService from "utils/NavigationService";
import images from "configs/images";

import { InfoFour, InfoOne, InfoThree, InfoTwo } from "./info";

interface ScholarshipOptionProps {}

const ScholarshipOption = (props: ScholarshipOptionProps) => {
  const [form, setForm] = useState({ isAgree: false } as { isAgree: boolean });
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {InfoOne.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={InfoOne.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Space height={20} />
        <Button
          title="Upload SKTM"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={30} />
        {InfoTwo.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={1}
              key={index}
              dataLength={InfoOne.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Button
          title="Upload Slip Gaji"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={30} />
        {InfoThree.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={2}
              key={index}
              dataLength={InfoOne.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Button
          title="Upload Foto Rumah Bagian Dalam"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={20} />
        <Button
          title="Upload Foto Rumah Bagian Depan"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={20} />
        <Button
          title="Upload Foto Rumah Bagian Belakang"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={20} />
        <Button
          title="Upload Foto Rumah Bagian Samping"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={15} />
        <Text textAlign="center" size={12} style={{ flex: 1 }}>
          (Format{" "}
          <Text size={12} type="bold" variant="CenturyGothicBold">
            JPEG, PNG, TIFF
          </Text>{" "}
          maksimum{" "}
          <Text size={12} type="bold" variant="CenturyGothicBold">
            5 MB
          </Text>
          )
        </Text>
        <Space height={30} />
        {InfoFour.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={3}
              key={index}
              dataLength={InfoOne.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Button
          title="Upload KTP Orang Tua / Wali"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          textStyle={{ fontSize: 13 }}
          icon={icons.upload}
          iconStyle={{
            height: 20,
            width: 20,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
          innerStyle={{ alignItems: "center" }}
        />
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

export default ScholarshipOption;
