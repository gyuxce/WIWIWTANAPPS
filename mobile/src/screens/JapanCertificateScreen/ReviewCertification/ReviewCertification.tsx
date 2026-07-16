import Button from "components/Button";
import EmptyCertification from "components/EmptyCertification/EmptyCertification";
import ListCertification from "components/ListCertification";
import Section from "components/Section";
import Space from "components/Space";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  CertificationListType,
  CertificationUserType,
} from "types/CertificationTypes";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface ReviewCertificationProps {
  certificationUser: CertificationUserType[];
  openAdminWhatsapp: () => void;
  certificationList: CertificationListType[];
}

const ReviewCertification = ({
  certificationUser,
  openAdminWhatsapp,
  certificationList,
}: ReviewCertificationProps) => {
  const { t } = useTranslation();
  const disabledButton = () => {
    if (certificationUser.length > 0) {
      if (certificationUser.some(item => item.status === 0)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return (
    <View>
      {certificationUser.length > 0 ? (
        <>
          <Section textTitle="Status Tes" textJapan="テストの進捗" />
          <Space height={20} />
          <View>
            {certificationUser.map((item, index) => {
              return <ListCertification key={index} certificateItem={item} />;
            })}
          </View>
        </>
      ) : (
        <EmptyCertification />
      )}

      <Space height={20} />
      <View style={{ paddingHorizontal: scaledHorizontal(25) }}>
        <Button
          onPress={() =>
            NavigationService.navigate("UploadCertificationScreen", {
              data: certificationList,
            })
          }
          title={t("unggah_hasil")}
          style={{ paddingVertical: scaledVertical(25) }}
          textStyle={{ fontWeight: "600", fontSize: 12 }}
          disabled={disabledButton()}
          withBorder={!disabledButton()}
        />
        <Space height={20} />
        <Button
          onPress={openAdminWhatsapp}
          title={t("hubungi_admin_sertifikasi")}
          style={{ paddingVertical: scaledVertical(25) }}
          textStyle={{ fontWeight: "600", fontSize: 12 }}
        />
      </View>
    </View>
  );
};

export default ReviewCertification;
