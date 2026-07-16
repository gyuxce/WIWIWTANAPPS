import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import Avatar from "components/Avatar";
import images from "configs/images";
import Text from "components/Text";
import colors from "configs/colors";
import Space from "components/Space";
import Button from "components/Button";
import NavigationService from "utils/NavigationService";
import { useAuth } from "hooks/useAuth";
import { useDispatch } from "react-redux";
import { onChangeLanguage, onLogin } from "stores/persist/persistSlice";
import type { AuthType, UserType } from "types/UserTypes";
import { resetAllState } from "stores";
import { useTranslation } from "react-i18next";

import styles from "./styles";

const ProfileScreen = () => {
  const { auth, postLogout, user } = useAuth();
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const onLogout = () => {
    postLogout(auth.accessToken).then(({ status }) => {
      if (status === "success") {
        dispatch(onLogin({ auth: {} as AuthType, user: {} as UserType }));
        dispatch(resetAllState());
        dispatch(onChangeLanguage("id"));
        i18n.changeLanguage("id");
        NavigationService.navigateResetGuest();
      }
    });
  };
  const privacyPlicyLink =
    "https://www.privacypolicies.com/live/73dd0b1f-a596-409a-ae18-02ede316df9c";
  const aboutLink = "https://wiwitanbaru.com/about";
  const onClickLink = (link: string) => {
    Linking.canOpenURL(link).then(ok => {
      if (ok) {
        Linking.openURL(link);
      } else {
        Alert.alert("Link bermasalah atau tidak ditemukan");
      }
    });
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Header
        withBurger
        textTitleJapanLeft="アカウント"
        textTitleLeft="Akun"
        totalNotification={4}
        withBell
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.wrapperImg}>
            <Avatar
              image={
                user?.profilePicture
                  ? { uri: user?.profilePicture?.url }
                  : images.userDefault
              }
              style={{ padding: 0, borderWidth: 1 }}
            />
            {/* <Image source={images.sakura} style={styles.emblem} /> */}
            {/* <View style={styles.wrapperPercent}>
              <Text
                size={10}
                variant="CenturyGothicBold"
                type="bold"
                color={colors.red}
              >
                60%
              </Text>
            </View> */}
          </View>
          <Space height={20} />
          <Text color={colors.red} type="bold" variant="CenturyGothicBold">
            {user?.name}
          </Text>
          <Space height={4} />

          <Text size={12}>{user?.name_alias || "-"}</Text>

          <View
            style={[
              styles.post,
              {
                backgroundColor:
                  user?.last_phase < 3
                    ? colors.accent
                    : user?.training_program === 2
                    ? colors.green500
                    : colors.yellow500,
              },
            ]}
          >
            <Text
              size={10}
              color={colors.white}
              variant="CenturyGothicBold"
              type="bold"
            >
              {user?.last_phase < 3
                ? "Siswa Siap Bergabung"
                : `Siswa ${user?.is_active_label} - ${user?.training_program_label} `}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              },
            ]}
            onPress={() => {
              NavigationService.navigate("ProfileMyProgressScreen");
            }}
          >
            <Text size={10} textAlign="center">
              {t("progres_saya")}
            </Text>
            <View
              style={{
                padding: 3,
                backgroundColor: colors.red,
                borderRadius: 4,
              }}
            >
              <Text
                size={12}
                variant="CenturyGothicBold"
                type="bold"
                textAlign="center"
                color={colors.white}
              >
                {user?.last_level_label || "N5"}
              </Text>
            </View>
          </TouchableOpacity>

          <Space height={28} />
          <Button
            title={t("edit_profil")}
            style={styles.btn}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 10 }}
            withBorder={false}
            onPress={() => NavigationService.navigate("EditProfileScreen")}
          />
          <Button
            title={t("privasi_dan_keamanan")}
            style={styles.btn}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 10 }}
            withBorder={false}
            onPress={() => NavigationService.navigate("PrivasiPolicyScreen")}
          />
          <Button
            title={t("kontak_admin")}
            style={styles.btn}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 10 }}
            withBorder={false}
            onPress={() => NavigationService.navigate("ContactAdminScreen")}
          />
          <Space height={30} />
          <TouchableOpacity
            onPress={() => {
              onClickLink(aboutLink);
            }}
          >
            <Text
              type="bold"
              variant="CenturyGothicBold"
              size={10}
              style={{ marginBottom: 20 }}
            >
              {t("tentang_wiwitan")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === "android") {
                Linking.openURL("https://play.google.com");
              } else {
                Linking.openURL("https://www.apple.com/id/app-store/");
              }
            }}
          >
            <Text
              type="bold"
              variant="CenturyGothicBold"
              size={10}
              style={{ marginBottom: 20 }}
            >
              {t("beri_penilaian")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              NavigationService.navigate("ManagementScreen", {
                title: t("syarat_dan_ketentuan"),
                path: "/terms-condition",
              })
            }
          >
            <Text
              type="bold"
              variant="CenturyGothicBold"
              size={10}
              style={{ marginBottom: 20 }}
            >
              {t("syarat_dan_ketentuan")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onClickLink(privacyPlicyLink);
            }}
          >
            <Text
              type="bold"
              variant="CenturyGothicBold"
              size={10}
              style={{ marginBottom: 20 }}
            >
              {t("kebijakan_privasi")}
            </Text>
          </TouchableOpacity>

          <Button
            onPress={onLogout}
            title={t("keluar_akun")}
            style={[styles.btn, { marginTop: 40, width: 220 }]}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 10 }}
            withBorder={false}
          />
        </View>
        <Space height={100} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
