import React from "react";
import { ScrollView, View } from "react-native";
import Space from "components/Space";
import TextInput from "components/TextInput";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import { scaledFontSize, scaledVertical } from "utils/ScaledService";
import type { Control, FieldValues, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { UserSignupTypes } from "types/UserTypes";
import Button from "components/Button";
import type { ConstantType } from "types/ConstantTypes";

// import icons from "configs/icons";
interface SecondStepProps {
  form: UserSignupTypes;
  setForm: any;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;

  trainingProgram: ConstantType[];
  isByApple?: boolean;
}
const SecondStep = ({
  form,
  setForm,
  control,
  errors,
  trainingProgram,
  isByApple,
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
      {!isByApple && (
        <>
          <Text size={scaledFontSize(20)}>
            Nama Lengkap
            <Text color={colors.red600} size={scaledFontSize(20)}>
              *
            </Text>
          </Text>
          <Space height={5} />
          <Controller
            control={control}
            defaultValue={form?.fullname}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, fullname: text });
                }}
                error={errors.fullname && errors?.fullname?.message}
                borderLess={false}
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                placeholder="Isi nama lengkapmu..."
              />
            )}
            name="fullname"
            rules={{
              required: {
                value: true,
                message: "Nama lengkap harus diisi.",
              },
              minLength: {
                value: 4,
                message: "Nama lengkap minimal harus 4 karakter",
              },
            }}
          />
        </>
      )}

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>
        NIK
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
              if (text === "") {
                setForm({
                  ...form,
                  nik: "",
                });
                onChange("");
              } else if (/^([0-9]{1,100})+$/.test(text)) {
                setForm({
                  ...form,
                  nik: text,
                });
                onChange(text);
              } else {
                setForm({
                  ...form,
                  nik: form.nik,
                });
                onChange(form.nik);
              }
            }}
            error={errors?.nik && errors?.nik?.message}
            borderLess={false}
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            placeholder="Isi nik kamu..."
            keyboardType="numeric"
            withError={true}
          />
        )}
        name="nik"
        rules={{
          required: {
            value: true,
            message: "Nomor nik harus diisi.",
          },
          validate: (val: string) => {
            if (val.length > 16) {
              return "Nomor nik tidak boleh melebihi 16 karakter";
            }

            if (val.length < 16) {
              return "Nomor nik tidak boleh kurang dari 16 karakter";
            }

            return;
          },
        }}
      />

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>
        Nomor HP Aktif (Whatsapp)
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
              if (text === "") {
                setForm({
                  ...form,
                  phone: "",
                });
                onChange("");
              } else if (/^([0-9]{1,100})+$/.test(text)) {
                setForm({
                  ...form,
                  phone: text,
                });
                onChange(text);
              } else {
                setForm({
                  ...form,
                  phone: form.phone,
                });
                onChange(form.phone);
              }
            }}
            withError={true}
            error={errors.phone && errors?.phone?.message}
            borderLess={false}
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            placeholder="Isi nomor hp kamu..."
            keyboardType="numeric"
          />
        )}
        name="phone"
        rules={{
          required: {
            value: true,
            message: "Nomor telfon harus diisi.",
          },
          minLength: {
            value: 10,
            message: "Nomor telfon minimal harus 10 karakter",
          },
        }}
      />

      <Space height={10} />
      <Text size={scaledFontSize(20)}>
        Program Pelatihan
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>

      <Controller
        control={control}
        defaultValue={2}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              marginTop: 15,
            }}
          >
            {trainingProgram
              .filter(item => item.name === "SSW") //Remove this if training program TITP is ready.
              .map((item, index) => {
                return (
                  <Button
                    key={index}
                    onPress={() => {
                      onChange(item.value);
                      setForm({ ...form, trainingProgram: item.value });
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
        name="trainingProgram"
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

export default SecondStep;
