import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Card from "components/Card";
import SectionInfo from "components/SectionInfo";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import Space from "components/Space";
import Button from "components/Button";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import TextInput from "components/TextInput";
import icons from "configs/icons";
import images from "configs/images";
import NavigationService from "utils/NavigationService";

import { InfoWiwitan } from "./info";

interface WiwitanInstallmentProps {}

const WiwitanInstallment = (props: WiwitanInstallmentProps) => {
  const installment = [
    { text: "2 Bulan", id: "2-month" },
    { text: "4 Bulan", id: "4-month" },
    { text: "8 Bulan", id: "8-month" },
    { text: "12 Bulan", id: "12-month" },
    { text: "Buat sendiri", id: "self" },
  ];
  const [form, setForm] = useState({
    isAgreement: false,
    installmentId: "",
    selfInstallment: "0",
  } as {
    isAgreement: boolean;
    installmentId: string;
    selfInstallment: string;
  });
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {InfoWiwitan.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={InfoWiwitan.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
      </Card>
      <Space height={20} />
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {installment.map((item, index) => {
          return (
            <Button
              onPress={() => {
                if (item.id === "self") {
                  setForm({ ...form, selfInstallment: "0" });
                }
                setForm({ ...form, installmentId: item.id });
              }}
              withBorder={false}
              key={index}
              title={item?.text}
              style={{
                paddingVertical: scaledHorizontal(15),
                marginBottom: scaledVertical(5),
                borderWidth: form.installmentId === item.id ? 1 : 0,
              }}
              textStyle={{
                fontWeight: form.installmentId === item.id ? "bold" : "normal",
                fontFamily:
                  form.installmentId === item.id
                    ? fonts.CenturyGothicBold
                    : fonts.CenturyGothicRegular,
                fontSize: 14,
              }}
            />
          );
        })}
        <Space height={20} />
        <View
          style={{
            backgroundColor: colors.stone100,
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
          }}
        >
          {form?.installmentId === "self" && (
            <TextInput
              stylesBox={{ height: 40 }}
              value={form?.selfInstallment}
              onChange={text => {
                if (text === "") {
                  setForm({
                    ...form,
                    selfInstallment: "",
                  });
                } else if (/^([0-9]{1,100})+$/.test(text)) {
                  setForm({
                    ...form,
                    selfInstallment: text,
                  });
                } else {
                  setForm({
                    ...form,
                    selfInstallment: form.selfInstallment,
                  });
                }
              }}
              borderLess={false}
              placeholder="Untuk berapa bulan?"
              textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            />
          )}

          <Text size={14}>Cicilan per bulan</Text>
          <Space height={5} />
          <Text size={14} type="bold" variant={"CenturyGothicBold"}>
            IDR 16.000.000,-
          </Text>
        </View>
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
          onPress={() => setForm({ ...form, isAgreement: !form?.isAgreement })}
        >
          <Image
            source={form?.isAgreement ? icons.checklistBox : icons.box}
            style={{ width: 18, height: 18, resizeMode: "cover" }}
          />
        </TouchableOpacity>

        <Text size={12} variant="CenturyGothicRegular" style={{ flex: 1 }}>
          Saya sudah membaca dengan teliti seluruh ketentuan di atas
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

export default WiwitanInstallment;
