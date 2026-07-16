import CardScheduleClass from "components/CardScheduleClass";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { t } from "i18next";
import moment from "moment";
import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { VirtualClassType } from "types/TrainingTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface DropdownChildProps {
  //item: VirtualClassType;
  level: string;
  title: string;
  classVirtual: VirtualClassType[];
}

const DropdownChild = ({ level, title, classVirtual }: DropdownChildProps) => {
  const [isOpenChild, setIsOpenChild] = useState(false);

  const checkIsInActive = () => {
    return classVirtual?.filter(item =>
      moment(item?.event?.started_at).isBefore(new Date()),
    ).length;
  };
  return (
    <View
      style={{
        backgroundColor: colors.zinc50,
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => setIsOpenChild(!isOpenChild)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 5,
          paddingHorizontal: scaledHorizontal(5),
          paddingVertical: scaledVertical(25),
        }}
      >
        <Text type="bold" variant="CenturyGothicBold" style={{ flex: 1 }}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={checkIsInActive() === 0 ? colors.red : colors.black}
            >
              {checkIsInActive()}
            </Text>
            <Text>/</Text>
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={checkIsInActive() === 0 ? colors.red : colors.black}
            >
              {classVirtual?.length}
            </Text>
          </View>
          <Image
            source={isOpenChild ? icons.arrowRight2 : icons.arrowBottom}
            style={{ height: 24, width: 24, resizeMode: "contain" }}
          />
        </View>
      </TouchableOpacity>
      {isOpenChild && (
        <View>
          {classVirtual.length > 0 ? (
            <View>
              {classVirtual.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: scaledHorizontal(20),
                      marginBottom: scaledVertical(30),
                    }}
                  >
                    <CardScheduleClass
                      date={item.event?.started_at}
                      description={item.description || "-"}
                      //headerTitle={item.title}
                      image={item?.event.cover?.url}
                      link={item.event?.external_url}
                      title={item.event?.title}
                      numberEvent={level}
                      //btnTitle={item.btnTitle}
                      //urlFile={item.urlFile}
                      style={{
                        borderWidth: 0,
                        backgroundColor: colors.white,
                      }}
                      //withButton
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <Text
              style={{ paddingVertical: scaledVertical(20) }}
              size={12}
              textAlign="center"
            >
              {t("tidak_ada_jadwal_kelas_virtual")}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default DropdownChild;
