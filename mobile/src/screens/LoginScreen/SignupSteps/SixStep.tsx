import React from "react";
import { ScrollView, View } from "react-native";
import Space from "components/Space";
import TextInput from "components/TextInput";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import type { Control, FieldValues, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CityType, UserSignupTypes } from "types/UserTypes";
import Button from "components/Button";
import type { ConstantType } from "types/ConstantTypes";
import icons from "configs/icons";

// import icons from "configs/icons";
interface SecondStepProps {
  form: UserSignupTypes;
  setForm: any;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  onPressDomicile: () => void;
  selectedCity: CityType;
  bloodType: ConstantType[];
}
const SixStep = ({
  form,
  setForm,
  control,
  errors,
  onPressDomicile,
  selectedCity,
  bloodType,
}: SecondStepProps) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <Text size={12}>
        Golongan Darah
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={scaledVertical(5)} />

      <Controller
        control={control}
        defaultValue={1}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              marginHorizontal: scaledHorizontal(25),
              flexDirection: "row",
              gap: 5,
              marginTop: 15,
            }}
          >
            {bloodType.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    onChange(item.value);
                    setForm({ ...form, bloodPressure: item.value });
                  }}
                  title={item.name}
                  style={{
                    borderWidth: item.value === value ? 1 : 0,
                    flex: 1,
                    borderRadius: 6,
                    paddingVertical: 8,
                    backgroundColor:
                      item.value === value ? colors.white : colors.stone100,
                  }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  textStyle={{ fontWeight: "600", fontSize: 12 }}
                  withBorder={false}
                />
              );
            })}
          </View>
        )}
        name="bloodPressure"
      />
      <Space height={20} />
      <Text size={scaledFontSize(20)}>
        Alamat Lengkap
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={5} />
      <Controller
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChange={text => {
              onChange(text);
              setForm({ ...form, address: text });
            }}
            type="textarea"
            textAreaHeight={80}
            error={errors.address && errors?.address?.message}
            borderLess={false}
            placeholder="Isi alamat kamu..."
            textStyle={{
              fontFamily: fonts.CenturyGothicBold,
              textAlignVertical: "top",
            }}
            withError={true}
          />
        )}
        name="address"
        rules={{
          required: {
            value: true,
            message: "Alamat harus diisi.",
          },
          minLength: {
            value: 10,
            message: "Alamat minimal harus 10 karakter.",
          },
        }}
      />

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>
        Domisili
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={10} />
      <Button
        onPress={onPressDomicile}
        title={selectedCity?.name ? selectedCity?.name : "Pilih domisili"}
        style={{
          paddingVertical: scaledVertical(20),
          minWidth: "100%",
        }}
        innerStyle={{
          justifyContent: "space-between",
          alignItems: "center",

          flexDirection: "row",
        }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
          textAlign: "center",
          flex: 1,
          marginLeft: scaledHorizontal(30),
          fontFamily: fonts.CenturyGothicBold,
        }}
        iconRight={icons.iosRight}
        iconStyle={{
          width: 18,
          height: 18,
          resizeMode: "contain",
          marginRight: scaledHorizontal(10),
        }}
      />
      <Space height={25} />

      <Text
        type="bold"
        color={colors.red}
        size={scaledFontSize(20)}
        variant="CenturyGothicBold"
      >
        (*) wajib diisi
      </Text>
    </ScrollView>
  );
};

export default SixStep;
