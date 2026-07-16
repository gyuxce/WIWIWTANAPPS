import BaseModal from "components/BaseModal";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import TextInput from "components/TextInput";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import images from "configs/images";
import { usePersist } from "hooks/usePersist";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface ModalAlertProps {
  showModal: boolean;
  animation: "zoom" | "slide";
  title?: string;
  onHide?: () => void;
  leftText?: string;
  leftFunction?: (arg?: string) => void;
  rightText?: string;
  rightFunction?: () => void;
  additionalText?: string;
  additionalFunction?: () => void;
  withIcon?: boolean;
  iconImage?: any;
  withPrice?: boolean;
  titleBig?: string;
  withTime?: boolean;
  time?: number;
  listWorstText?: string[];
  withClose?: boolean;
  withTextInput?: boolean;
  valueTextInput?: string;
  onChangeTextInput?: (text: string) => void;
  titleBigJapan?: string;
  subtitle?: string;
  withForgotPassword?: boolean;
  imageSize?: number;
  titleBigColor?: string;
  titleTextInput?: string;
  textInputPlaceholder?: string;
  withMaximumTextInput?: boolean;
  withRequiredTextInput?: boolean;
  textInputOnBottom?: boolean;
  buttonRightDisabled?: boolean;
  deletedEmail?: string;
  withDeletedAccount?: boolean;
}

const ModalAlert = ({
  showModal,
  animation,
  onHide,
  leftText,
  rightText,
  leftFunction,
  rightFunction,
  title,
  withIcon,
  iconImage,
  titleBig,
  withTime,
  time,
  listWorstText,
  withClose,
  withTextInput,
  valueTextInput,
  onChangeTextInput,
  titleBigJapan,
  subtitle,
  additionalFunction,
  additionalText,
  withForgotPassword,
  imageSize = 60,
  titleBigColor = colors.accent,
  titleTextInput,
  textInputPlaceholder,
  withMaximumTextInput,
  withRequiredTextInput,
  textInputOnBottom = false,
  buttonRightDisabled = true,
  deletedEmail,
  withDeletedAccount,
}: ModalAlertProps) => {
  const [timeString, setTimeString] = useState("00:00:00");
  const [icon, setIcon] = useState(iconImage);
  const [titleText, setTitleText] = useState(title);
  const [isIcon, setIsIcon] = useState(withIcon);
  const [isTimer, setIsTimer] = useState(withTime);
  const { attemptPassword, wrongAttemptPassword } = usePersist();

  const [textInput, setTextInput] = useState(valueTextInput);
  let intervalId: any = null;

  useEffect(() => {
    setTimeString("00:00:00");
    setTitleText(title);
    setIcon(iconImage);
    setIsIcon(withIcon);
    setIsTimer(withTime);
    if ((withTime || withForgotPassword) && time) {
      createTimer(time);
    }

    if (withTextInput) {
      setTextInput(valueTextInput);
      onChangeTextInput && onChangeTextInput(valueTextInput || "");
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [time, title, iconImage]);

  function createTimer(endTime: number) {
    if (intervalId === null) {
      intervalId = setInterval(function () {
        const now = new Date().getTime();
        const timeDifference = endTime - now;

        if (timeDifference <= 0) {
          clearInterval(intervalId);
          setTimeString("00:00:00");
          // setTitleText(
          //   "Setelah mengedit postingan, kamu dapat kembali mengedit setelah 1x24 jam.",
          // );
          setIsTimer(false);
          attemptPassword(0, 0, wrongAttemptPassword?.loginTry + 1);
          onHide && onHide();
        } else {
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
          );
          const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          setTimeString(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          );
          attemptPassword(
            wrongAttemptPassword.attempt,
            time || 1000,
            wrongAttemptPassword?.loginTry,
          );
        }
      }, 1000);
    }
  }
  return (
    <BaseModal
      showModal={showModal}
      animation={animation}
      onModalHide={() => {
        onHide && onHide();
        if ((withTime || withForgotPassword) && time) {
          clearInterval(intervalId);
        }
        if (withTextInput) {
          onChangeTextInput && onChangeTextInput("");
          setTextInput("");
        }
      }}
      onBackdropPress={() => {
        onHide && onHide();
        if ((withTime || withForgotPassword) && time) {
          clearInterval(intervalId);
        }
        if (withTextInput) {
          onChangeTextInput && onChangeTextInput("");
          setTextInput("");
        }
      }}
      onBackButtonPress={() => {
        onHide && onHide();
        if ((withTime || withForgotPassword) && time) {
          clearInterval(intervalId);
        }
        if (withTextInput) {
          onChangeTextInput && onChangeTextInput("");
          setTextInput("");
        }
      }}
    >
      {withClose ? (
        <TouchableOpacity
          onPress={() => {
            onHide && onHide();
            if (withTime && time) {
              clearInterval(intervalId);
            }
            if (withTextInput) {
              onChangeTextInput && onChangeTextInput("");
              setTextInput("");
            }
          }}
          style={{
            alignItems: "flex-end",
            marginBottom: scaledVertical(10),
            marginTop: -5,
          }}
        >
          <Image
            source={icons.close}
            style={{ height: 20, width: 20, tintColor: colors.black }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      ) : null}

      {isIcon ? (
        <View
          style={{
            alignItems: "center",
            marginBottom: scaledVertical(20),
          }}
        >
          <Image
            source={icon}
            style={{ height: imageSize, width: imageSize }}
            resizeMode={"contain"}
          />
        </View>
      ) : (
        <></>
      )}

      {withForgotPassword ? (
        <View
          style={{
            alignItems: "center",
            marginBottom: scaledVertical(20),
          }}
        >
          <Image
            source={images.gotProblem}
            style={{ height: 151, width: 151 }}
            resizeMode={"contain"}
          />
        </View>
      ) : (
        <></>
      )}

      {isTimer && time && !withForgotPassword ? (
        <Text
          textAlign="center"
          size={48}
          variant={"OpificioNeueRegular"}
          type="bold"
          color={colors.red600}
        >
          {timeString}
        </Text>
      ) : null}
      {titleBigJapan ? (
        <Text
          size={48}
          textAlign={"center"}
          color={colors.accent}
          style={{ marginVertical: scaledVertical(15) }}
          type="bold"
          variant="CenturyGothicBold"
        >
          {titleBigJapan}
        </Text>
      ) : null}

      {titleBig ? (
        <Text
          size={16}
          textAlign={"center"}
          color={titleBigColor}
          style={{ marginVertical: scaledVertical(15) }}
          type="bold"
          variant="CenturyGothicBold"
        >
          {titleBig}
        </Text>
      ) : null}

      <Space height={5} />

      {!textInputOnBottom &&
        withTextInput &&
        valueTextInput !== undefined &&
        onChangeTextInput !== undefined && (
          <View>
            <Space height={20} />
            <Text size={12} textAlign="center">
              {titleTextInput}
            </Text>
            <Space height={8} />
            <TextInput
              value={textInput}
              onChange={text => {
                setTextInput(text);
                onChangeTextInput(text);
              }}
              borderLess={false}
              placeholder={textInputPlaceholder}
              textStyle={{
                fontFamily: fonts.CenturyGothicBold,
                textAlignVertical: "center",
                marginTop: -5,
              }}
              stylesBox={{ backgroundColor: colors.stone100 }}
              wrapStyle={{ height: 30, justifyContent: "center" }}
              maxLength={200}
            />
            <View style={{ marginTop: -15 }}>
              {withMaximumTextInput && (
                <Text
                  size={12}
                  lineHeight={18}
                  color={colors.zinc500}
                  textAlign="center"
                >
                  {"*Maksimal 200 karakter"}
                </Text>
              )}
              <Space height={5} />
              {withRequiredTextInput && (
                <Text
                  size={12}
                  lineHeight={18}
                  color={colors.red}
                  textAlign="center"
                  type="bold"
                  variant="CenturyGothicBold"
                >
                  {withRequiredTextInput && "(*) wajib diisi"}
                </Text>
              )}
            </View>
          </View>
        )}

      {title ? (
        <Text size={14} textAlign={"center"} color={colors.black}>
          {titleText}
        </Text>
      ) : null}

      {subtitle && (
        <Text
          size={12}
          textAlign={"center"}
          color={colors.black}
          style={{ marginHorizontal: scaledHorizontal(15) }}
        >
          {subtitle}
        </Text>
      )}
      {withDeletedAccount && (
        <View>
          <Space height={20} />
          <Text size={12} textAlign="center">
            Apakah kamu yakin untuk menghapus akun?
          </Text>
          <Space height={5} />
          <Text
            size={12}
            type="bold"
            variant="CenturyGothicBold"
            textAlign="center"
          >
            {deletedEmail}
          </Text>
        </View>
      )}

      {textInputOnBottom &&
        withTextInput &&
        valueTextInput !== undefined &&
        onChangeTextInput !== undefined && (
          <View>
            <Space height={20} />
            <Text size={12} textAlign="center">
              {titleTextInput}
            </Text>
            <Space height={8} />
            <TextInput
              value={textInput}
              onChange={text => {
                setTextInput(text);
                onChangeTextInput(text);
              }}
              borderLess={false}
              placeholder={textInputPlaceholder}
              textStyle={{
                fontFamily: fonts.CenturyGothicBold,
                textAlignVertical: "center",
                marginTop: -5,
              }}
              stylesBox={{ backgroundColor: colors.stone100 }}
              wrapStyle={{ height: 30, justifyContent: "center" }}
              maxLength={200}
            />
            <View style={{ marginTop: -15 }}>
              {withMaximumTextInput && (
                <Text
                  size={12}
                  lineHeight={18}
                  color={colors.zinc500}
                  textAlign="center"
                >
                  {"*Maksimal 200 karakter"}
                </Text>
              )}
              <Space height={5} />
              {withRequiredTextInput && (
                <Text
                  size={12}
                  lineHeight={18}
                  color={colors.red}
                  textAlign="center"
                  type="bold"
                  variant="CenturyGothicBold"
                >
                  {withRequiredTextInput && "(*) wajib diisi"}
                </Text>
              )}
            </View>
          </View>
        )}

      {withForgotPassword && (
        <Text
          size={12}
          textAlign={"center"}
          color={colors.black}
          style={{ marginHorizontal: scaledHorizontal(15) }}
        >
          Password tidak cocok setelah tiga percobaan. Jika masih bermasalah,
          klik{" "}
          <Text color={colors.red} style={{ fontWeight: "900" }} size={12}>
            'Lupa Kata Sandi'
          </Text>{" "}
          untuk bantuan.
        </Text>
      )}

      {withForgotPassword && (
        <Text
          size={16}
          textAlign={"center"}
          color={colors.red}
          style={{
            marginHorizontal: scaledHorizontal(15),
            fontWeight: "900",
            marginTop: scaledVertical(25),
          }}
        >
          {timeString}
        </Text>
      )}

      {listWorstText ? (
        <ScrollView style={{ height: 100, width: "100%" }}>
          {listWorstText.map((item, index) => {
            return (
              <Text
                key={index}
                type="bold"
                variant={"CenturyGothicBold"}
                textAlign="center"
                color={colors.red600}
              >
                {item}
              </Text>
            );
          })}
        </ScrollView>
      ) : null}
      <Space height={10} />
      <View
        style={{
          marginTop: scaledVertical(15),
          justifyContent: "center",
        }}
      >
        {additionalText && additionalFunction ? (
          <Button
            title={additionalText}
            onPress={additionalFunction}
            style={{ paddingVertical: 12 }}
            textStyle={{ fontSize: 14 }}
            textType="bold"
            variant="CenturyGothicBold"
          />
        ) : null}
        <Space height={10} />
        {leftText && leftFunction ? (
          <Button
            withBorder={buttonRightDisabled}
            disabled={!buttonRightDisabled}
            title={leftText}
            onPress={() => leftFunction(textInput)}
            style={{ paddingVertical: 12 }}
            textStyle={{ fontSize: 14 }}
            textType="bold"
            variant="CenturyGothicBold"
          />
        ) : null}
        <Space height={5} />
        {rightText && rightFunction ? (
          <Button
            title={rightText}
            onPress={rightFunction}
            style={{ paddingVertical: 12 }}
            textStyle={{ fontSize: 14, fontWeight: "600" }}
            withBorder={false}
            textType="bold"
            variant="CenturyGothicBold"
          />
        ) : null}
      </View>
    </BaseModal>
  );
};

export default ModalAlert;
