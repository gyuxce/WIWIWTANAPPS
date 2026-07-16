import Card from "components/Card";
import React from "react";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import SectionInfo from "components/SectionInfo";
import { Image, TouchableOpacity, View } from "react-native";
import Text from "components/Text";
import icons from "configs/icons";
import Space from "components/Space";
import Button from "components/Button";
import fonts from "configs/fonts";

import styles from "./styles";

interface PaymentTermsProps {
  onPressNext: () => void;
  isAgree: boolean;
  setIsAgree: (arg: boolean) => void;
  data?: any[];
}

const PaymentTerms = ({
  onPressNext,
  isAgree,
  setIsAgree,
  data = [],
}: PaymentTermsProps) => {
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {data?.map((item: any, index: number) => {
          return (
            <SectionInfo
              title={item?.child?.title}
              htmlContent={item?.child?.description}
              isHtml={true}
              index={index}
              key={index}
              dataLength={data?.length}
              withBullet={false}
              textAlign="center"
              alignParagraph="center"
            />
          );
        })}
      </Card>
      <Space height={20} />
      <View style={styles.containerCheckbox}>
        <TouchableOpacity
          onPress={() => setIsAgree(!isAgree)}
          style={{ flexDirection: "row", gap: 10 }}
        >
          <Image
            source={isAgree ? icons.checklistBox : icons.box}
            style={styles.imageCheckbox}
          />
          <Text size={12} variant="CenturyGothicRegular" style={{ flex: 1 }}>
            Saya sudah membaca dengan teliti dan menyetujui seluruh ketentuan
            dan peraturan di atas.
          </Text>
        </TouchableOpacity>
      </View>
      <Space height={20} />
      <Button
        withBorder={isAgree}
        disabled={!isAgree}
        onPress={onPressNext}
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

export default PaymentTerms;
