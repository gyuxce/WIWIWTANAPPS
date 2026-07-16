import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { InterviewTypeList } from "types/InterviewTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
interface ListInterviewProps {
  data: InterviewTypeList;
}

const ListInterview = ({ data }: ListInterviewProps) => {
  const { t } = useTranslation();

  const listInterviewCard = [
    {
      title: t("tanggal"),
      value: moment(data?.interview_date).isValid()
        ? moment(data?.interview_date).format("DD[ ]MMMM[ ]YYYY")
        : "-",
      color: colors.accent,
    },
    {
      title: t("waktu"),
      value: moment(data?.interview_date).isValid()
        ? moment(data?.interview_date).format("HH:mm")
        : "-",
      color: colors.accent,
    },
    { title: t("link"), value: data?.link, color: colors.red },
    { title: t("pewawancara"), value: data?.name, color: colors.accent },
    { title: t("jabatan"), value: data?.position, color: colors.accent },
    { title: t("instansi"), value: data?.agency, color: colors.accent },
  ];
  return (
    <View
      style={{
        marginBottom: scaledVertical(20),
        marginHorizontal: scaledHorizontal(5),
      }}
    >
      <Space height={20} />
      {listInterviewCard.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: "row",
              gap: 20,
              marginTop: index !== 0 ? 5 : 0,
            }}
          >
            <View style={{ justifyContent: "flex-end", flex: 0.35 }}>
              <Text
                size={10}
                color={colors.accent}
                style={{ flex: 1 }}
                lineHeight={18}
              >
                {item?.title}
              </Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    display: "flex",
                    borderRadius: 4,
                  }}
                >
                  <Text
                    size={12}
                    color={item.color}
                    type="bold"
                    //textAlign="center"
                    variant="CenturyGothicBold"
                    style={{ flex: 1 }}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ListInterview;
