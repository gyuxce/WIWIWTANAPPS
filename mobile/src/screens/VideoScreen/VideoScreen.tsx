import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import globalStyles from "utils/GlobalStyles";
import { type RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import icons from "configs/icons";
import NavigationService from "utils/NavigationService";

type VideoScreenRouteType = RouteProp<RootStackParamList, "VideoScreen">;

type VideoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VideoScreen"
>;

type Prop = {
  route: VideoScreenRouteType;
  navigation: VideoScreenNavigationProp;
};

const VideoScreen = ({ route }: Prop) => {
  const video = useRef(null as any);
  const [isPlayed, setIsPlayed] = useState(false);

  return (
    <View style={globalStyles("black").container}>
      <Video
        ref={video}
        source={{
          uri: route?.params?.uri,
        }}
        style={{ height: "100%", width: "100%" }}
        useNativeControls={false}
        shouldPlay={isPlayed}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={(status: any) => {
          if (status?.didJustFinish) {
            NavigationService.replace("UploadTest");
          }
        }}
      />

      {!isPlayed ? (
        <TouchableOpacity
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
          onPress={() => {
            setIsPlayed(true);
          }}
        >
          <Image
            source={icons.playButton}
            style={{ height: 100, width: 100, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default VideoScreen;
