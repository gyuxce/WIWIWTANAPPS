import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Space from "components/Space";
import TextInput from "components/TextInput";
import Text from "components/Text";
import Button from "components/Button";
// import images from "configs/images";
// import NavigationService from "utils/NavigationService";
import colors from "configs/colors";
import fonts from "configs/fonts";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  scaledFontSize,
  scaledVertical,
  scaledHorizontal,
} from "utils/ScaledService";
import icons from "configs/icons";
import type { Control, FieldValues, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { UserSignupTypes } from "types/UserTypes";
import type { ConstantType } from "types/ConstantTypes";
import moment from "moment";

interface ThirdStepProps {
  form: UserSignupTypes;
  setForm: any;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;

  lastEducation: ConstantType[];
}

const ThirdStep = ({
  form,
  setForm,
  control,
  errors,
  lastEducation,
}: ThirdStepProps) => {
  const [showDatepicker, setShowDatepicker] = useState(false);

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
        Tempat Lahir
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
            withError={true}
            value={value}
            onChange={text => {
              onChange(text);
              setForm({ ...form, cityBirth: text });
            }}
            error={errors.cityBirth && errors?.cityBirth?.message}
            borderLess={false}
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            placeholder="Isi tempat lahir kamu..."
          />
        )}
        name="cityBirth"
        rules={{
          required: {
            value: true,
            message: "Kota kelahiran harus diisi.",
          },
          minLength: {
            value: 4,
            message: "Kota kelahiran minimal harus 4 karakter.",
          },
        }}
      />

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>
        Tanggal Lahir
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={5} />
      {showDatepicker && (
        <Controller
          control={control}
          defaultValue={
            form?.dateBirth !== "" ? new Date(form?.dateBirth) : new Date()
          }
          render={({ field: { onChange, value } }) => (
            <RNDateTimePicker
              maximumDate={moment(new Date()).subtract(12, "year").toDate()}
              minimumDate={moment(new Date()).subtract(40, "year").toDate()}
              value={new Date(value)}
              mode="date"
              onChange={(_, selectedDate) => {
                setShowDatepicker(false);
                onChange(selectedDate?.toDateString());
                setForm({
                  ...form,
                  dateBirth: selectedDate?.toDateString(),
                });
              }}
            />
          )}
          name="dateBirth"
          rules={{
            required: {
              value: true,
              message: "Tanggal lahir harus diisi.",
            },
          }}
        />
      )}

      <Space height={scaledVertical(5)} />
      <Button
        onPress={() => setShowDatepicker(true)}
        title={
          form.dateBirth
            ? moment(form.dateBirth).format("DD/MM/YYYY")
            : "DD/MM/YYYY"
        }
        withBorder={false}
        style={{
          paddingVertical: scaledVertical(30),
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
        iconRight={icons.calendar}
        iconStyle={{
          width: 18,
          height: 18,
          resizeMode: "contain",
          marginRight: scaledHorizontal(10),
        }}
      />

      {form.dateBirth === undefined ? (
        <Text
          style={{
            marginTop: 4,
            alignSelf: "flex-end",
            marginBottom: scaledVertical(10),
            fontSize: 12,
            color: colors.red600,
          }}
        >
          Tanggal lahir harus diisi.
        </Text>
      ) : (
        <Text
          style={{
            alignSelf: "flex-end",
            marginTop: 4,
            fontSize: 12,
            color: colors.red600,
            marginBottom: scaledVertical(10),
          }}
        >
          {""}
        </Text>
      )}

      <Space height={10} />
      <Text size={scaledFontSize(20)}>
        Pendidikan Terakhir
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={scaledVertical(5)} />
      <Controller
        control={control}
        defaultValue={2}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              marginHorizontal: scaledHorizontal(25),
              flexDirection: "row",
              gap: 5,
              marginTop: 15,
            }}
          >
            {lastEducation.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    onChange(item.value);
                    setForm({ ...form, education: item.value });
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
        name="education"
      />
      <Space height={20} />
      <Text size={scaledFontSize(20)}>
        Jurusan
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
              setForm({ ...form, major: text });
            }}
            withError={true}
            error={errors.cityBirth && errors?.major?.message}
            borderLess={false}
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            placeholder="Isi Jurusan kamu..."
          />
        )}
        name="major"
        rules={{
          required: {
            value: true,
            message: "Jurusan harus diisi.",
          },
        }}
      />
      <Space height={5} />

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

export default ThirdStep;
