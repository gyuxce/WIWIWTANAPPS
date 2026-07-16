import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Space from "components/Space";
import TextInput from "components/TextInput";
import Text from "components/Text";
import Button from "components/Button";
import colors from "configs/colors";
import fonts from "configs/fonts";
import {
  scaledFontSize,
  scaledVertical,
  scaledHorizontal,
} from "utils/ScaledService";
import type {
  Control,
  FieldValues,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import type { UserSignupTypes } from "types/UserTypes";
import type { ConstantType } from "types/ConstantTypes";

interface FourthStepProps {
  form: UserSignupTypes;
  setForm: any;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  registerInformation: ConstantType[];
}

const FourthStep = ({
  form,
  setForm,
  control,
  errors,
  watch,
  registerInformation,
}: FourthStepProps) => {
  const [isOtherSource, setIsOtherSource] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scaledHorizontal(25),
      }}
    >
      <Text size={scaledFontSize(20)}>
        Dari daerah mana Anda berasal?
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
              setForm({ ...form, ethnic: text });
            }}
            error={errors.ethnic && errors?.ethnic?.message}
            borderLess={false}
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            placeholder="Isi daerah kamu..."
            withError={true}
          />
        )}
        name="ethnic"
        rules={{
          required: {
            value: true,
            message: "Daerah harus diisi.",
          },
          minLength: {
            value: 4,
            message: "Daerah minimal harus 4 karakter.",
          },
        }}
      />

      <Space height={scaledVertical(20)} />
      <Text size={scaledFontSize(20)} textAlign="center">
        Dari mana anda mendapatkan informasi pendaftaran ini?
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={5} />
      <Controller
        control={control}
        defaultValue={1}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              marginTop: 10,
            }}
          >
            {registerInformation.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    if (item.value !== 4) {
                      onChange(item.value);
                      setForm({ ...form, informationSource: item.value });
                      setIsOtherSource(false);
                    } else {
                      setIsOtherSource(true);
                      onChange(item.value);
                      setForm({ ...form, informationSource: item.value });
                    }
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
                  textStyle={{
                    fontWeight: "600",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                  withBorder={false}
                />
              );
            })}
          </View>
        )}
        name="informationSource"
        rules={{
          required: {
            value: true,
            message: "Informasi harus diisi.",
          },
        }}
      />
      <Space height={scaledVertical(20)} />
      {isOtherSource ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Space height={scaledVertical(20)} />
          <Text size={scaledFontSize(20)}>
            Tuliskan platform/media lainnya
            <Text color={colors.red600} size={scaledFontSize(20)}>
              *
            </Text>
          </Text>
          <Space height={10} />
          <Controller
            control={control}
            defaultValue=""
            render={({ field: { onChange } }) => (
              <TextInput
                value={form.otherSourceText}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, otherSourceText: text });
                }}
                borderLess={false}
                placeholder="Platform/media lainnya..."
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                error={
                  errors.otherSourceText && errors?.otherSourceText?.message
                }
                stylesBox={{ width: "110%" }}
              />
            )}
            name="otherSourceText"
            rules={{
              validate: (val: string) => {
                if (watch("informationSource") === "lainnya" && val === "") {
                  return "Platform/media lainnya harus diisi.";
                }
                return;
              },
            }}
          />
        </View>
      ) : null}
      <Space height={15} />

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

export default FourthStep;
