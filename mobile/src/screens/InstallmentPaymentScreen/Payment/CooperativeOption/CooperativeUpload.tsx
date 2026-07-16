import Button from "components/Button";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import SectionInfo from "components/SectionInfo";
import Card from "components/Card";
import Space from "components/Space";
import icons from "configs/icons";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import Text from "components/Text";
import fonts from "configs/fonts";
import images from "configs/images";
import NavigationService from "utils/NavigationService";

import {
  CooperativeEight,
  CooperativeFive,
  CooperativeFour,
  CooperativeOne,
  CooperativeSeven,
  CooperativeSix,
  CooperativeThree,
  CooperativeTwo,
} from "./info";

interface CooperativeUploadProps {}

const CooperativeUpload = (props: CooperativeUploadProps) => {
  const [form, setForm] = useState({ isAgree: false } as { isAgree: boolean });
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {CooperativeOne.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={0}
              key={index}
              dataLength={CooperativeOne.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Space height={20} />
        <Button
          title="Upload KTP"
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
        {CooperativeTwo.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={1}
              key={index}
              dataLength={CooperativeTwo.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload NPWP"
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
        {CooperativeThree.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={2}
              key={index}
              dataLength={CooperativeThree.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload Kartu Keluarga"
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
        {CooperativeFour.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={3}
              key={index}
              dataLength={CooperativeFour.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload Buku Nikah"
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
        {CooperativeFive.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={4}
              key={index}
              dataLength={CooperativeFive.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload Buku Tabungan"
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
        {CooperativeSix.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={5}
              key={index}
              dataLength={CooperativeSix.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload Print Rekening Bank"
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
        {CooperativeSeven.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={6}
              key={index}
              dataLength={CooperativeSeven.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload SLIK / BI Checking"
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
        {CooperativeEight.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={7}
              key={index}
              dataLength={CooperativeTwo.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}

        <Button
          title="Upload SKCK"
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

export default CooperativeUpload;
