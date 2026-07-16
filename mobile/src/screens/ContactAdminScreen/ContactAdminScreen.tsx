import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { useAuth } from "hooks/useAuth";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { View, Platform, ScrollView, Linking, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { apiGetSettingAdmin } from "services/ConstantServices";
import type { QueryType } from "types/QueryTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

const ContactAdminScreen = () => {
  const [query, _] = useState({
    type: "collection",
    options: [["filter,group,equal,kontak-admin"]],
  } as QueryType);
  const [contactData, setContactData] = useState([] as any[]);
  const { auth } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetSettingAdmin(auth?.accessToken, query).then(({ data }) => {
      if (data) {
        const contact: any[] = [];
        data.map(item => {
          contact.push({
            title: item.name,
            subtitle: item.description,
            phone: item.value,
          });
        });
        setContactData(contact);
      } else {
        ErrorStatus(500, dispatch);
      }
    });
  }, []);

  const onClickAdmin = async (phone: any) => {
    const uri = `https://api.whatsapp.com/send/?phone=${phone.replaceAll(
      "+",
      "",
    )}&type=phone_number`;

    await Linking.openURL(uri).catch(err => {
      Alert.alert("Errorr", err);
    });
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        textJapan="管理者に連絡する"
        textTitle={"Kontak Admin"}
        withTextTitle
        withBackButton
        withBell
        totalNotification={4}
      />
      <Space height={5} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: scaledHorizontal(25) }}
      >
        <Space height={20} />
        {contactData?.map((item, index) => {
          return (
            <View key={index}>
              <Card>
                <Text
                  textAlign="center"
                  variant="CenturyGothicBold"
                  type="bold"
                  color={colors.accent}
                >
                  {item.title}
                </Text>
                <Space height={10} />
                <Text
                  size={12}
                  textAlign="center"
                  color={colors.black}
                  lineHeight={18}
                >
                  {item.subtitle}
                </Text>
                <Space height={25} />
                <Button
                  onPress={() => onClickAdmin(item.phone)}
                  icon={icons.whatsappIcon}
                  innerStyle={{ gap: 10, alignItems: "center" }}
                  iconStyle={{ height: 24, width: 24, resizeMode: "contain" }}
                  title={t("hubungi_admin")}
                  textStyle={{ fontSize: 12 }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  style={{
                    paddingVertical: scaledVertical(15),
                    borderRadius: 12,
                  }}
                />
              </Card>
              <Space height={20} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ContactAdminScreen;
