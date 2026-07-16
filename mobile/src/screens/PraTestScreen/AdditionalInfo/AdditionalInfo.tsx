import Card from "components/Card";
import SectionInfo from "components/SectionInfo";
import React from "react";
import { scaledHorizontal } from "utils/ScaledService";
import Space from "components/Space";
import Button from "components/Button";
import { t } from "i18next";

interface AdditionalInfoProps {
  onClickAdminWhatsapp: () => void;
}

const AdditionalInfo = ({ onClickAdminWhatsapp }: AdditionalInfoProps) => {
  const Info = [
    {
      title: t("informasi_tambahan"),
      withBullet: true,
      subtitle: [
        {
          text: t("jadwal_sesi_tanya_jawab"),
        },
        {
          text: t("kamu_mendapatkan_notifikasi"),
        },
        {
          text: t("apabila_ada_kendala"),
        },
      ],
    },
  ];

  return (
    <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
      {Info.map((item, index) => {
        return (
          <SectionInfo
            title={item.title}
            subtitle={item.subtitle}
            index={index}
            key={index}
            dataLength={Info.length}
            withBullet={item.withBullet}
            isCustom={true}
            withIndexNumber={false}
          />
        );
      })}
      <Space height={20} />
      <Button
        onPress={onClickAdminWhatsapp}
        title={t("hubungi_admin_wiwitan")}
        style={{
          paddingVertical: 12,
          width: "70%",
          alignSelf: "center",
        }}
        textStyle={{ fontSize: 12 }}
        textType="bold"
        variant="CenturyGothicBold"
        withBorder={true}
      />
    </Card>
  );
};

export default AdditionalInfo;
