import type { ImageSourcePropType, ViewStyle } from "react-native";
import { View, Image, TouchableOpacity, Linking, Platform } from "react-native";
import React, { useState } from "react";
import Text from "components/Text";
import colors from "configs/colors";
import Space from "components/Space";
import icons from "configs/icons";
import Button from "components/Button";
import { formatDate } from "utils/Utils";
import * as Calendar from "expo-calendar";
import styles from "./styles";
import images from "configs/images";
import moment from "moment";
import dayjs from "dayjs";
import { useAuth } from "hooks/useAuth";
import { t } from "i18next";

interface Props {
  image?: ImageSourcePropType | null;
  headerTitle?: string;
  title: string;
  description: string;
  numberEvent?: string;
  date: string;
  btnTitle?: string;
  link?: string;
  urlFile?: string;
  style?: ViewStyle | ViewStyle[];
  withButton?: boolean;
}

const CardScheduleClass = ({
  image,
  headerTitle,
  title,
  date,
  description,
  numberEvent,
  link,
  urlFile,
  btnTitle = "Rekaman Kelas Virtual",
  style,
  withButton,
}: Props) => {
  const isActive = moment(date).isBefore(new Date());
  const { user } = useAuth();
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const checkLocaleCalendarExists = async () => {
    async function getDefaultCalendarSource() {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    }

    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Wiwitan" };

    const calendars = await Calendar.getCalendarsAsync();
    const selectedCalendar =
      Platform.OS === "ios"
        ? calendars.find(calendar => calendar.title === "Wiwitan Schedule")
        : calendars.find(calendar => calendar.ownerAccount === user?.email);

    if (selectedCalendar === undefined) {
      const calendarId = await Calendar.createCalendarAsync({
        title: "Wiwitan Schedule",
        color: "red",
        entityType: Calendar.EntityTypes.EVENT,
        //@ts-ignore
        sourceId: defaultCalendarSource.id,
        //@ts-ignore
        source: defaultCalendarSource,
        type: Calendar.EntityTypes.EVENT,
        name: "Wiwitan",
        ownerAccount: user?.email,
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
        isVisible: true,
        isSynced: true,
      });

      return calendarId;
    } else {
      return selectedCalendar?.id;
    }
  };

  const createEvent = async (date: Date, link: string) => {
    if (Platform.OS === "ios") {
      const res = await Calendar.requestRemindersPermissionsAsync();
      if (res?.status !== "granted") {
        alert("Permission to access the reminder is denied");
        return;
      }
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the calendar is denied.");
      return;
    }
    setLoadingCalendar(true);
    checkLocaleCalendarExists().then(async value => {
      const eventDetails: Partial<Calendar.Event> = {
        title: `Kelas Virtual - ${title}`,
        calendarId: value,
        startDate: date,
        endDate: dayjs(date).add(2, "hour").toDate(),
        location: "",
        notes: `Link kelas virtual di link ${link}`,
        url: link,
        guestsCanSeeGuests: true,
        alarms: [
          { relativeOffset: -30, method: Calendar.AlarmMethod.ALARM },
          { relativeOffset: -15, method: Calendar.AlarmMethod.ALARM },
          { relativeOffset: 0, method: Calendar.AlarmMethod.ALARM },
        ],
        organizer: "Wiwitan",
        organizerEmail: "wiwitan@62teknologi.com",
      };

      try {
        await Calendar.createEventAsync(value, eventDetails);
        setLoadingCalendar(false);
        alert(`Event added to calendar`);
      } catch (error) {
        alert(`Error adding event to calendar: ${error}`);
      }
    });
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.detailWrapImg}>
        <Image
          source={image ? { uri: image } : images.scheduleClass}
          style={{ width: "100%", height: "100%" }}
        />
        {isActive && (
          <View
            style={{
              position: "absolute",
              right: 0,
              backgroundColor: colors.red,
              padding: 8,
              borderBottomLeftRadius: 4,
            }}
          >
            <Text
              color="white"
              variant="CenturyGothicBold"
              type="bold"
              size={14}
            >
              {t("kelas_selesai")}
            </Text>
          </View>
        )}
      </View>
      <Space height={12} />
      {headerTitle && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.red,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
            size={12}
            type="bold"
            textAlign="center"
            variant="CenturyGothicBold"
            color={colors.white}
          >
            {headerTitle}
          </Text>
        </View>
      )}

      <Text
        type="bold"
        variant="CenturyGothicBold"
        textAlign="center"
        style={{ marginVertical: 12 }}
      >
        {title}
      </Text>
      <Text textAlign="center" size={12}>
        {description}
      </Text>
      <Space height={20} />
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image source={icons.sheet} style={{ height: 20, width: 20 }} />
          <Text size={12} variant="CenturyGothicBold" type="bold">
            {numberEvent}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            source={icons.calendarEvent}
            style={{ height: 20, width: 20 }}
          />
          <Text size={12} variant="CenturyGothicBold" type="bold">
            {formatDate(date, "D MMMM YYYY")}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image source={icons.clockEvent} style={{ height: 20, width: 20 }} />
          <Text size={12} variant="CenturyGothicBold" type="bold">
            {formatDate(date, "HH:mm")} WIB
          </Text>
        </View>
        {link ? (
          <TouchableOpacity
            disabled={isActive}
            onPress={() => Linking.openURL(link)}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <Image source={icons.link} style={{ height: 20, width: 20 }} />
            <Text
              color={colors.red}
              size={12}
              variant="CenturyGothicBold"
              type="bold"
              style={{ flex: 1 }}
            >
              {isActive ? t("kelas_virtual_telah_selesai") : link}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {withButton && !isActive ? (
        <Button
          onPress={() => {
            !isActive ? createEvent(new Date(date), link || "") : null;
          }}
          title={btnTitle}
          style={styles.buttonStyle}
          textStyle={styles.buttonDownload}
          icon={link ? icons.calendarEventGray : icons.download}
          iconStyle={styles.iconDownload}
          variant="CenturyGothicBold"
          isLoading={loadingCalendar}
        />
      ) : null}
    </View>
  );
};

export default CardScheduleClass;
