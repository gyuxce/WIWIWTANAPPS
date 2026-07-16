import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { AVPlaybackStatusSuccess, Audio } from "expo-av";
import {
  Recording,
  RecordingStatus,
  usePermissions,
} from "expo-av/build/Audio";
import React, { useCallback, useEffect, useState } from "react";
import { View, Alert, TouchableOpacity, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import { millisToTime } from "utils/Utils";
import * as FileSystem from "expo-file-system";
import { QuestionType } from "types/ExamTypes";

interface AudioProps {
  question: QuestionType;
  indexQuestion: number;
  soundUri: string;
  setSoundUri: (sound: string) => void;
}

const AudioQuestion = ({
  question,
  indexQuestion,
  setSoundUri,
  soundUri,
}: AudioProps) => {
  const [recordingStatus, setRecordingStatus] = useState({} as RecordingStatus);
  const [recordingAudio, setRecordingAudio] = useState({} as Recording);
  const [permissionResponse, requestPermission] = usePermissions();
  const [sound, setSound] = useState({} as Audio.Sound);
  const [isPlayed, setIsPlayed] = useState(false);
  const [statusSound, setStatusSound] = useState({} as AVPlaybackStatusSuccess);
  const soundObject = new Audio.Sound();

  useEffect(() => {
    return sound
      ? () => {
          if (sound?.unloadAsync) {
            sound.unloadAsync();
          }
        }
      : undefined;
  }, [sound]);

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRrecording = new Audio.Recording();
      setRecordingAudio(newRrecording);

      await newRrecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      newRrecording.setOnRecordingStatusUpdate(
        (status: Audio.RecordingStatus) => setRecordingStatus(status),
      );

      await newRrecording.startAsync();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    setRecordingAudio({} as Recording);
    await recordingAudio.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recordingAudio.getURI();
    setSoundUri(uri || "");
    await soundObject
      .loadAsync({
        //@ts-ignore
        uri: uri,
      })
      .then((status: any) => {
        setStatusSound(status);
      });
    setSound(soundObject);
  };

  const playSound = useCallback(async () => {
    try {
      const info = await FileSystem.getInfoAsync(
        //@ts-ignore
        soundUri,
      );

      if (info.exists) {
        await soundObject
          .loadAsync({
            //@ts-ignore
            uri: soundUri,
          })
          .then((status: any) => {
            setStatusSound(status);
          });
        setSound(soundObject);
        setIsPlayed(true);
        await soundObject.playAsync();
        soundObject.setOnPlaybackStatusUpdate((status: any) => {
          setStatusSound(status);
          if (status?.didJustFinish) {
            setIsPlayed(false);
            soundObject?.unloadAsync();
          }
        });
      } else {
        Alert.alert(
          "Error",
          "Audio file not downloaded. Please contact Admin Wiwitan",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Cannot play audio. Please contact Admin Wiwitan");
    }
  }, [soundUri]);

  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ fontWeight: "900" }}>{indexQuestion + 1}.</Text>
        <Text style={{ fontWeight: "900", flex: 1 }}>
          <Text color={colors.red}>[AUDIO]</Text> {question?.title}
        </Text>
      </View>
      <Space height={20} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          alignSelf: "center",
        }}
      >
        {!recordingStatus?.isRecording && soundUri == "" && (
          <Button
            onPress={() => {
              startRecording();
            }}
            variant="CenturyGothicBold"
            textType="bold"
            type="light"
            style={{
              width: 68,
              height: 68,
              borderRadius: 68 / 2,
              alignSelf: "center",
            }}
            textStyle={{
              fontSize: 22,
              lineHeight: 18,
            }}
            icon={icons.speaker}
            iconStyle={{ width: 28, height: 28, resizeMode: "contain" }}
          />
        )}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {recordingStatus?.isRecording && (
            <TouchableOpacity onPress={stopRecording}>
              <Image
                source={icons.btnStop}
                style={{ height: 68, width: 68, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          )}

          {soundUri !== "" && !isPlayed && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (sound?.unloadAsync) {
                    sound?.stopAsync();
                    sound?.unloadAsync();
                  }

                  setIsPlayed(false);
                  setSoundUri("");
                }}
              >
                <Image
                  source={icons.btnDelete}
                  style={{ height: 32, width: 32, resizeMode: "contain" }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={playSound}>
                <Image
                  source={icons.btnPlay}
                  style={{ height: 68, width: 68, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </View>
          )}

          {soundUri !== "" && isPlayed && (
            <TouchableOpacity
              onPress={async () => {
                if (sound?.unloadAsync) {
                  sound?.stopAsync();
                  sound?.unloadAsync();
                }

                await soundObject
                  .loadAsync({
                    //@ts-ignore
                    uri: soundUri,
                  })
                  .then((status: any) => {
                    setStatusSound(status);
                  });
                setIsPlayed(false);
              }}
            >
              <Image
                source={icons.btnStop}
                style={{ height: 68, width: 68, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          )}

          {recordingStatus?.isRecording ? (
            <Text
              color={colors.accentTint}
              size={12}
              textAlign="center"
              style={{ fontWeight: "900" }}
            >
              {millisToTime(recordingStatus?.durationMillis || 0)}
            </Text>
          ) : recordingStatus?.isDoneRecording &&
            !isPlayed &&
            soundUri !== "" ? (
            <Text
              color={colors.accentTint}
              size={12}
              textAlign="center"
              style={{ fontWeight: "900" }}
            >
              {millisToTime(statusSound?.durationMillis || 0)}
            </Text>
          ) : (
            isPlayed &&
            soundUri !== "" && (
              <Text
                color={colors.accentTint}
                size={12}
                textAlign="center"
                style={{ fontWeight: "900" }}
              >
                {millisToTime(statusSound?.positionMillis || 0)}
              </Text>
            )
          )}
        </View>
      </View>
    </View>
  );
};

export default AudioQuestion;
