import Card from "components/Card";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, TouchableOpacity } from "react-native";
import { Image, View } from "react-native";
import { CertificationUserType } from "types/CertificationTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface ListCertificationProps {
  certificateItem: CertificationUserType;
}

const ListCertification = ({ certificateItem }: ListCertificationProps) => {
  const { t } = useTranslation();
  const listCertificationCard = [
    {
      title: t("sertifikasi"),
      value: certificateItem?.name || "-",
      field: "text",
    },
    {
      title: t("tanggal"),
      value: moment(certificateItem?.cert_date).isValid()
        ? moment(certificateItem?.cert_date).format("DD[ ]MMMM[ ]YYYY")
        : "-",
      field: "text",
    },
    ,
    {
      title: t("alamat_sertifikasi"),
      value: certificateItem?.location,
      field: "text",
    },
    {
      title: t("hasil_sertifikasi"),
      value: certificateItem?.file?.filename,
      field: "file",
    },
    {
      title: t("status"),
      value: certificateItem?.status,
      field: "label",
    },
  ];
  return (
    <View style={{ marginBottom: scaledVertical(20) }}>
      <Card
        style={{
          marginHorizontal: scaledHorizontal(25),
        }}
      >
        {listCertificationCard.map((item, index) => {
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
                {item?.field === "text" && (
                  <Text
                    lineHeight={18}
                    size={12}
                    color={colors.accent}
                    type="bold"
                    variant="CenturyGothicBold"
                    style={{ flex: 1 }}
                  >
                    {item.value}
                  </Text>
                )}
                {item?.field === "label" && (
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor:
                          item?.value === 0
                            ? colors.orangeAccent
                            : item?.value === 1
                            ? colors.green500
                            : colors.red600,
                        paddingVertical: 2,
                        paddingHorizontal: 10,
                        display: "flex",
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        size={12}
                        color={colors.white}
                        type="bold"
                        textAlign="center"
                        variant="CenturyGothicBold"
                        style={{ flex: 1 }}
                      >
                        {item?.value === 0
                          ? t("menunggu")
                          : item?.value === 1
                          ? t("lulus")
                          : t("tidak_lulus")}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                )}
                {item?.field === "file" && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(certificateItem?.file?.url)}
                    style={{
                      //backgroundColor: colors.orangeAccent,
                      paddingVertical: 2,
                      paddingHorizontal: 5,
                      flexDirection: "row",
                      gap: 10,
                      borderRadius: 4,
                    }}
                  >
                    <Image
                      source={icons.fileIcon}
                      style={{ height: 18, width: 18, resizeMode: "contain" }}
                    />
                    <Text
                      size={12}
                      color={colors.red}
                      type="bold"
                      variant="CenturyGothicBold"
                      style={{ flex: 1 }}
                    >
                      {item?.value}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

export default ListCertification;
