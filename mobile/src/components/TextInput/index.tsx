import React, { useState } from "react";
import type {
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  ImageStyle,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputContentSizeChangeEventData,
} from "react-native";
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import icons from "configs/icons";
import { scaledHorizontal } from "utils/ScaledService";
import Text from "components/Text";
import colors from "configs/colors";

import styles from "./InputStyles";

interface Props {
  placeholder?: string;
  onChange?: (e: any) => void;
  value?: any;
  type?: "input" | "textarea";
  keyboardType?: "default" | "number-pad" | "email-address" | "numeric";
  error?: any;
  secureTextEntry?: boolean;
  onClearButton?: boolean;
  onClear?: () => void;
  borderLess?: boolean;
  label?: string;
  useRef?: any;
  editable?: boolean;
  labelColor?: any;
  bold?: boolean;
  isPhone?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  isRequired?: boolean;
  autoCapitalize?: "none" | "sentences";
  focusInput?: boolean;
  confirmPasword?: boolean;
  textAreaHeight?: number;
  placeholderColor?: string;
  customBorder?: boolean;
  customText?: boolean;
  stylesBox?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  customButton?: boolean;
  customIcon?: ImageSourcePropType | any;
  customStyle?: ImageStyle | ImageStyle[];
  customPress?: () => void;
  wrapStyle?: any;
  heightBox?: number;
  iconLeft?: ImageSourcePropType | any;
  iconLeftStyle?: ImageStyle | ImageStyle[];
  withError?: boolean;
  children?: any;
  onChangeEvent?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => void;
}

const Component = ({
  onChange,
  placeholder = "Ketik disini",
  secureTextEntry,
  value,
  onClearButton,
  onClear,
  type = "input",
  borderLess,
  //label,
  error = "",
  keyboardType = "default",
  useRef,
  editable = true,
  //labelColor,
  bold,
  isPhone,
  maxLength,
  onBlur,
  onFocus,
  isRequired = false,
  autoCapitalize = "none",
  focusInput = false,
  confirmPasword,
  textAreaHeight,
  placeholderColor,
  customBorder,
  customText,
  stylesBox,
  textStyle,
  customButton,
  customIcon,
  customStyle,
  customPress,
  wrapStyle,
  heightBox,
  iconLeft,
  iconLeftStyle,
  withError = true,
  children,
  onContentSizeChange,
  onChangeEvent,
}: Props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <View
        style={[
          styles.container,
          borderLess && styles.borderLess,
          !borderLess ? {} : {},
          customBorder ? { borderWidth: 1, borderColor: colors.gainsboro } : {},
          //focusInput ? styles.borderContainer : {},
          error ? styles.borderError : {},
          stylesBox,
          heightBox ? { minHeight: heightBox } : { minHeight: 30 },
        ]}
      >
        {/* {label || focusInput ? (
          <View style={styles.label}>
            <Text color={labelColor && labelColor} size={10}>
              {label}
              {isRequired ? (
                <Text color={color.cinnabar} size={12}>
                  *
                </Text>
              ) : null}
            </Text>
          </View>
        ) : (
          <></>
        )} */}

        {iconLeft ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              position: "absolute",
              left: 0,
              bottom: 2,
              top: 0,
              zIndex: 999,
              justifyContent: "center",
            }}
            onPress={customPress}
          >
            <Image
              source={iconLeft}
              style={iconLeftStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}

        <View style={[styles.wrapInput, wrapStyle]}>
          {isPhone && (focusInput || value) ? (
            <Text
              size={16}
              style={{
                alignSelf: "center",
                paddingBottom: Platform.OS === "android" ? 2 : 0,
                marginRight: 4,
              }}
            >
              +62
            </Text>
          ) : (
            <></>
          )}
          <TextInput
            ref={useRef}
            style={[
              //styles.textInput,

              customText
                ? { fontSize: 15, height: 40, color: colors.black }
                : styles.textInput,
              type === "textarea" && {
                minHeight: textAreaHeight || 84,
                textAlignVertical: "top",
              },
              bold && { fontWeight: "bold" },
              isPhone
                ? { width: "80%" }
                : { width: confirmPasword ? "80%" : "100%" },
              editable
                ? { paddingLeft: 0 }
                : { paddingLeft: scaledHorizontal(-10) },
              textStyle,
            ]}
            placeholderTextColor={
              placeholderColor ? placeholderColor : colors.stone400
            }
            onChangeText={onChange}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry && !visible}
            value={value}
            multiline={type === "textarea"}
            editable={editable}
            keyboardType={keyboardType}
            onBlur={onBlur}
            onFocus={onFocus}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
            onContentSizeChange={e =>
              onContentSizeChange && onContentSizeChange(e)
            }
            onChange={e => onChangeEvent && onChangeEvent(e)}
          >
            {children}
          </TextInput>

          <View style={{ flexDirection: "row", flex: 1 }}>
            {customButton ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.wrapIcon]}
                onPress={customPress}
              >
                <Image
                  source={customIcon}
                  style={customStyle}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
            {onClearButton ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.wrapIcon]}
                onPress={() => onClear && onClear()}
              >
                <Image
                  source={icons.clearIcon}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    tintColor: colors.accent,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
            {secureTextEntry && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.wrapIcon}
                onPress={() => setVisible(!visible)}
              >
                <Image
                  source={visible ? icons.eye : icons.eyeSlash}
                  resizeMode={"contain"}
                  style={styles.icon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {withError ? (
        <>
          {error && error !== "" ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.errorText}>{""}</Text>
          )}
        </>
      ) : null}
    </>
  );
};

export default Component;
