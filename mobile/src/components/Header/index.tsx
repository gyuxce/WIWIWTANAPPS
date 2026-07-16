import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { useNavigation } from "@react-navigation/core";
import images from "configs/images";
import { useNotification } from "hooks/useNotification";

import styles from "./styles";
import { useAuth } from "hooks/useAuth";
import { usePersist } from "hooks/usePersist";

type HeaderProps = {
  withBackButton?: boolean;
  withBell?: boolean;
  totalNotification?: number;
  withLogo?: boolean;

  withTextTitle?: boolean;
  textTitle?: string;
  textJapan?: string;
  textTitleSize?: number;
  titleLeft?: boolean;

  withAvatar?: boolean;
  onBackButton?: () => void;

  withHamburger?: boolean;
  textTitleJapanLeft?: string;
  textTitleLeft?: string;

  withSearch?: boolean;
  onSearch?: () => void;
  withAddForum?: boolean;
  withBackLeft?: boolean;
  onBackLeft?: () => void;

  withBurger?: boolean;
  withLogoLong?: boolean;
};

const Header = ({
  withBackButton,
  withBell,
  withLogo,
  withTextTitle,
  textTitle,
  textJapan,
  withAvatar,
  textTitleSize,
  onBackButton,
  withHamburger,
  textTitleJapanLeft,
  textTitleLeft,
  withAddForum,
  withSearch,
  onSearch,
  withBackLeft,
  onBackLeft,
  titleLeft,
  withBurger,
  withLogoLong,
}: HeaderProps) => {
  const [widthText, setWidthText] = useState(0);
  const [widthJapan, setWidthJapan] = useState(0);
  const { auth } = useAuth();
  const navigation: any = useNavigation();
  const { language } = usePersist();

  const { getTotalNotification, totalNotification } = useNotification();
  useEffect(() => {
    if (auth?.accessToken) {
      getTotalNotification();
    }
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {(textTitleJapanLeft && textTitleLeft) || withBackLeft ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            {withBackLeft ? (
              <TouchableOpacity
                onPress={() => {
                  if (onBackLeft) {
                    onBackLeft();
                  }
                }}
                style={{ backgroundColor: colors.stone100 }}
              >
                <Image
                  source={icons.arrowLeft}
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            ) : null}
            {withBurger ? (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ backgroundColor: colors.stone100 }}
              >
                <Image
                  source={icons.burger}
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            ) : null}
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <View
                style={{
                  borderBottomWidth:
                    language === "id" ? (widthText > widthJapan ? 0.5 : 0) : 0,
                  borderBottomColor: "black",
                  paddingHorizontal: 1,
                  paddingBottom: language === "id" ? scaledVertical(10) : 0,
                }}
              >
                <Text
                  size={textTitleSize || 16}
                  onTextLayout={e => {
                    if (textTitleLeft) {
                      setWidthText(e?.nativeEvent?.lines[0]?.width || 0);
                    }
                  }}
                  style={{
                    fontWeight: "400",
                    width: "80%",
                  }}
                  numberOfLines={1}
                >
                  {language === "id" ? textTitleLeft : textTitleJapanLeft}
                </Text>
              </View>

              {language === "id" && (
                <View
                  style={{
                    borderTopWidth: widthJapan > widthText ? 0.5 : 0,
                    paddingTop: scaledVertical(10),
                    borderTopColor: "black",
                    paddingHorizontal: 1,
                  }}
                >
                  <Text
                    size={12}
                    onTextLayout={e => {
                      if (textTitleJapanLeft) {
                        setWidthJapan(e?.nativeEvent?.lines[0]?.width || 0);
                      }
                    }}
                    style={{
                      fontWeight: "400",
                      width: "80%",
                    }}
                    numberOfLines={1}
                  >
                    {textTitleJapanLeft}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : null}
        {withBurger && !textTitleJapanLeft ? (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ backgroundColor: colors.stone100 }}
          >
            <Image
              source={icons.burger}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : null}

        {withBackButton ? (
          <TouchableOpacity
            onPress={() => {
              if (onBackButton) {
                onBackButton();
              } else {
                NavigationService.back();
              }
            }}
            style={{ backgroundColor: colors.stone100 }}
          >
            <Image
              source={icons.arrowLeft}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {!withAvatar ? (
        <View
          style={{
            flex: 1,
            alignItems: titleLeft ? "flex-start" : "center",
          }}
        >
          {withLogoLong ? (
            <Image
              source={images.logoBar2}
              style={{
                height: 40,
                width: 105,
                resizeMode: "contain",
              }}
            />
          ) : null}
          {withLogo ? (
            <Image
              source={images.logoBar2}
              style={{
                height: 40,
                width: 105,
                resizeMode: "contain",
              }}
            />
          ) : null}
          {withTextTitle && (textJapan || textTitle) ? (
            <View
              style={{
                alignItems: titleLeft ? "flex-start" : "center",
                marginLeft: titleLeft ? 16 : 0,
              }}
            >
              <View
                style={{
                  borderBottomWidth:
                    language === "id"
                      ? textJapan
                        ? widthText > widthJapan
                          ? 0.5
                          : 0
                        : 0
                      : 0,
                  borderBottomColor: "black",
                  paddingHorizontal: 1,
                  paddingBottom: language === "id" ? scaledVertical(10) : 0,
                }}
              >
                <Text
                  size={textTitleSize || 16}
                  onTextLayout={e => {
                    if (textTitle && withTextTitle) {
                      setWidthText(e?.nativeEvent?.lines[0]?.width || 0);
                    }
                  }}
                  style={{
                    fontWeight: "400",
                    width: "80%",
                  }}
                  numberOfLines={1}
                >
                  {language === "id" ? textTitle : textJapan}
                </Text>
              </View>

              {textJapan && language === "id" && (
                <View
                  style={{
                    borderTopWidth: widthJapan > widthText ? 0.5 : 0,
                    paddingTop: scaledVertical(10),
                    borderTopColor: "black",
                    paddingHorizontal: 1,
                  }}
                >
                  <Text
                    size={12}
                    onTextLayout={e => {
                      if (textJapan && withTextTitle) {
                        setWidthJapan(e?.nativeEvent?.lines[0]?.width || 0);
                      }
                    }}
                    style={{
                      fontWeight: "400",
                      width: "80%",
                    }}
                    numberOfLines={1}
                  >
                    {textJapan}
                  </Text>
                </View>
              )}
            </View>
          ) : null}
          {/* {withLogo ? (
            <Image
              source={icons.logoHeader}
              style={{
                height: 37,
                width: 40,
                resizeMode: "contain",
              }}
            />
          ) : null} */}
        </View>
      ) : null}

      <View
        style={{
          flex: withAvatar ? 0.3 : withHamburger ? 0.5 : 1,

          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {withAddForum ? (
          <TouchableOpacity
            style={{ marginRight: scaledHorizontal(10) }}
            onPress={() =>
              NavigationService.navigate("ForumEditorScreen", {
                from: "ForumScreen",
              })
            }
          >
            <Image
              source={icons.plus}
              style={{ height: 22, width: 22, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : null}
        {withSearch && onSearch ? (
          <TouchableOpacity
            style={{ marginRight: scaledHorizontal(13) }}
            onPress={onSearch}
          >
            <Image
              source={icons.search}
              style={{ height: 22, width: 22, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : null}
        {withBell ? (
          <TouchableOpacity
            style={{
              paddingRight: scaledHorizontal(10),
              justifyContent: "center",
              alignItems: "center",
              top: totalNotification >= 1 ? 10 : 0,
            }}
            onPress={() => NavigationService.navigate("NotificationScreen")}
          >
            <Image source={icons.bell} style={styles.imageNotification} />
            {totalNotification >= 1 ? (
              <View style={styles.containerNotificationNumber}>
                <Text
                  size={10}
                  style={{ fontWeight: "900" }}
                  color={colors.white}
                  type="bold"
                  numberOfLines={1}
                >
                  {totalNotification}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
