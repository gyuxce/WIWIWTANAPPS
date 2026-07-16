import Card from "components/Card";
import SectionInfo from "components/SectionInfo";
import React from "react";
import { scaledHorizontal } from "utils/ScaledService";

import { t } from "i18next";

interface InterviewTestProps {}

const InterviewTest = (props: InterviewTestProps) => {
  const Info = [
    {
      title: t("ketentuan_tanya_jawab"),
      withBullet: true,
      subtitle: [
        {
          text: t("kami_mengimbau_anda_hadir"),
        },
        {
          text: t("diharapkan_hadir_30menit"),
        },
        {
          text: t("apabila_anda_tidak_menghadiri"),
        },
        {
          text: t("silahkan_hubungi_pihak_wiwitan"),
        },
      ],
    },
    {
      title: t("metode_tanya_jawab"),
      withBullet: true,
      subtitle: [
        {
          text: t("anda_akan_mengikuti_sesi"),
        },
        {
          text: t("informasi_mengenai_jadwal"),
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
          />
        );
      })}
    </Card>
  );
};

export default InterviewTest;
