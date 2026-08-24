import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { millisToTime } from "utils/Utils";

interface MediaPlayerControlsProps {
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  onTogglePlay: () => void;
  onSeek: (millis: number) => void;
  disabled?: boolean;
}

const SKIP_MILLIS = 10000;

interface SkipButtonProps {
  label: string;
  enabled: boolean;
  onPress: () => void;
}

const SkipButton = ({ label, enabled, onPress }: SkipButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={8}
    disabled={!enabled}
    onPress={onPress}
    style={({ pressed }) => ({
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: enabled ? colors.black : colors.stone200,
      opacity: pressed ? 0.6 : 1,
    })}
  >
    <Text
      size={11}
      type="bold"
      variant="CenturyGothicBold"
      color={enabled ? colors.black : colors.stone400}
    >
      {label}
    </Text>
  </Pressable>
);

/**
 * Shared transport controls for the exam media (video and audio alike):
 * a tappable progress bar, skip back/forward, play/pause, and elapsed/total
 * time — so both question types behave like an ordinary media player.
 */
const MediaPlayerControls = ({
  isPlaying,
  positionMillis,
  durationMillis,
  onTogglePlay,
  onSeek,
  disabled = false,
}: MediaPlayerControlsProps) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const safeDuration = durationMillis > 0 ? durationMillis : 0;
  const safePosition = Math.min(Math.max(positionMillis || 0, 0), safeDuration);
  const progressPercent =
    safeDuration > 0 ? (safePosition / safeDuration) * 100 : 0;
  const canSeek = !disabled && safeDuration > 0;

  const seekBy = (deltaMillis: number) => {
    if (!canSeek) {
      return;
    }
    const next = Math.min(
      Math.max(safePosition + deltaMillis, 0),
      safeDuration,
    );
    onSeek(next);
  };

  const onPressTrack = (locationX: number) => {
    if (!canSeek || trackWidth <= 0) {
      return;
    }
    const ratio = Math.min(Math.max(locationX / trackWidth, 0), 1);
    onSeek(Math.round(ratio * safeDuration));
  };

  return (
    <View style={{ paddingHorizontal: 16, width: "100%" }}>
      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel="Posisi pemutaran"
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
        onPress={e => onPressTrack(e.nativeEvent.locationX)}
        style={{ paddingVertical: 10 }}
      >
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.stone200,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: colors.red,
            }}
          />
        </View>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text size={12} variant="CenturyGothicBold" type="bold">
          {millisToTime(safePosition)}
          {safeDuration > 0 ? ` / ${millisToTime(safeDuration)}` : ""}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <SkipButton
            label="-10s"
            enabled={canSeek}
            onPress={() => seekBy(-SKIP_MILLIS)}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Jeda" : "Putar"}
            hitSlop={8}
            disabled={disabled}
            onPress={onTogglePlay}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Image
              source={isPlaying ? icons.btnStop : icons.btnPlay}
              style={{ height: 46, width: 46, resizeMode: "contain" }}
            />
          </Pressable>

          <SkipButton
            label="+10s"
            enabled={canSeek}
            onPress={() => seekBy(SKIP_MILLIS)}
          />
        </View>
      </View>
    </View>
  );
};

export default MediaPlayerControls;
