import type { RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Card from "components/Card";
import Header from "components/Header";
import MediaPlayerControls from "components/MediaPlayerControls";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import images from "configs/images";
import { ResizeMode, Video } from "expo-av";
import { useAuth } from "hooks/useAuth";
import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
import { apiPostStatusMateri } from "services/ExamServices";
import type { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { imageExtensions, videoExtensions } from "utils/Utils";

type ModulDetailRouteType = RouteProp<
  RootStackParamList,
  "ContentDetailScreen"
>;

type ModulDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ContentDetailScreen"
>;

type Prop = {
  route: ModulDetailRouteType;
  navigation: ModulDetailNavigationProp;
};

const ContentDetailScreen = ({ route }: Prop) => {
  const video = useRef(null as any);
  const [param, _] = useState(route?.params);
  const durationMillisRef = useRef(0);
  const completeMillisRef = useRef(0);
  const hasSeekedToResumeRef = useRef(false);
  const { width } = useWindowDimensions();
  const { auth } = useAuth();
  const webViewRef: any = useRef();
  const [isVideoLoading, setVideoLoading] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState("");
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [videoMillis, setVideoMillis] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const fileUrl = param?.data?.file?.url || param?.data?.body_url || "";
  const fileName = String(param?.data?.file?.filename || fileUrl).toLowerCase();
  const normalizedFileName = fileName.split("?")[0] || "";
  const isImageFile = imageExtensions.some(ext =>
    normalizedFileName.endsWith("." + ext),
  );
  const isVideoFile = videoExtensions.some(ext =>
    normalizedFileName.endsWith("." + ext),
  );
  const isPdfFile = normalizedFileName.endsWith(".pdf");
  // PDF rendering (plus its retry/fallback handling) now lives in
  // PdfViewerScreen -- see the document row below.

  const backAction = () => {
    // Going back used to wait for apiPostStatusMateri to answer before
    // navigating, so the back button felt frozen for as long as the network
    // took -- seconds on a weak connection. The student gains nothing from
    // that wait: the list re-fetches its progress on focus anyway. Report in
    // the background and leave immediately.
    const goBackToModule = (progressDelta: number) => {
      NavigationService.navigate("ModulDetailScreen", {
        ...param,
        materiProgress:
          Number(route?.params?.materiProgress || 0) + progressDelta,
      });
    };

    const reportProgress = (durationValue: string, status: number) => {
      apiPostStatusMateri(auth?.accessToken, {
        material_content_id: route?.params?.data?.id || "",
        duration: durationValue,
        status,
      });
    };

    // The media never actually loaded (mediaError is set) -- don't report any
    // progress at all. Previously this still posted status: 1 ("selesai") for
    // documents/materi just from opening-then-leaving the screen, and status: 0
    // for videos, even though nothing was actually viewed.
    if (mediaError !== "") {
      goBackToModule(0);
      return true;
    }

    const alreadyComplete = param?.data?.progress?.status === 1;

    if (route?.params?.data?.body_type === 1) {
      if (alreadyComplete) {
        goBackToModule(0);
        return true;
      }
      const watchedToEnd =
        completeMillisRef.current &&
        completeMillisRef.current - durationMillisRef.current === 0;

      if (watchedToEnd) {
        reportProgress(String(completeMillisRef.current), 1);
        goBackToModule(1);
      } else {
        reportProgress(String(durationMillisRef.current), 0);
        goBackToModule(0);
      }
      return true;
    }

    if (!alreadyComplete) {
      reportProgress("0", 1);
    }
    goBackToModule(alreadyComplete ? 0 : 1);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [param, mediaError]);

  useEffect(() => {
    setMediaError("");
  }, [param?.data?.id]);

  const docUrl = encodeURIComponent(fileUrl);
  const googleViewerUrl = `https://docs.google.com/viewer?url=${docUrl}&embedded=true`;

  const toggleVideoPlayback = async () => {
    if (shouldPlayVideo) {
      setShouldPlayVideo(false);
      if (video?.current?.pauseAsync) {
        await video.current.pauseAsync();
      }
      return;
    }
    // Update state AND explicitly call playAsync() -- the `shouldPlay` prop
    // alone isn't reliably picked up by expo-av once the component has
    // already mounted/loaded, which left the overlay hidden with nothing
    // actually playing.
    setShouldPlayVideo(true);
    if (video?.current?.playAsync) {
      await video.current.playAsync();
    }
  };

  const seekVideo = async (millis: number) => {
    if (!video?.current?.setPositionAsync) {
      return;
    }
    await video.current.setPositionAsync(millis);
    setVideoMillis(millis);
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Header
        withBell
        totalNotification={4}
        textJapan="トレーニング"
        textTitle="Pelatihan"
        withTextTitle
        withBackButton
        onBackButton={backAction}
      />
      <Space height={8} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: scaledHorizontal(25) }}
      >
        <Card style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <Image
              source={
                param?.data?.cover
                  ? { uri: param?.data?.cover.url }
                  : images.placeholder
              }
              style={{
                height: 100,
                width: 100,
                resizeMode: "cover",
                borderRadius: 8,
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: colors.stone100,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  size={10}
                  color={colors.red}
                  type="bold"
                  variant="CenturyGothicBold"
                >
                  {param?.data?.body_type === 1 && t("video").toUpperCase()}
                  {param?.data?.body_type === 2 && t("dokumen").toUpperCase()}
                  {param?.data?.body_type === 3 && t("materi").toUpperCase()}
                </Text>
              </View>
              <Space height={3} />
              <Text type="bold" variant="CenturyGothicBold" numberOfLines={3}>
                {param?.data?.title}
              </Text>
            </View>
          </View>
          <Space height={10} />
          <Text size={12} numberOfLines={3} style={{ flex: 1 }}>
            {param?.data?.description}
          </Text>
          <Space height={10} />
          <Image
            source={icons.divider}
            style={{ height: 24, width: "100%", resizeMode: "contain" }}
          />
          <Space height={5} />
          {param?.data?.body_type === 1 && param?.data?.file && isVideoFile && (
            <View>
              <View
                style={{
                  width: "100%",
                  height: 200,
                  minHeight: 200,
                  backgroundColor: colors.black,
                }}
              >
                {isVideoLoading && (
                  <ActivityIndicator size="small" color={colors.accent} />
                )}
                <Video
                  ref={video}
                  source={{
                    uri: param?.data?.file?.url,
                  }}
                  onLoad={(status: any) => {
                    completeMillisRef.current = status?.durationMillis;
                    durationMillisRef.current =
                      status?.durationMillis - status?.positionMillis;
                    // Resume from where the student left off, but only ONCE on
                    // initial load. Passing `positionMillis` as a prop instead
                    // re-seeks to that same fixed value on every re-render --
                    // including the one triggered by tapping play after a pause
                    // -- which was forcing the video back to the start instead
                    // of resuming.
                    const resumeMillis =
                      Number(route?.params?.data?.progress?.duration) || 0;
                    if (resumeMillis > 0 && !hasSeekedToResumeRef.current) {
                      hasSeekedToResumeRef.current = true;
                      video?.current?.setPositionAsync?.(resumeMillis);
                    }
                  }}
                  onLoadStart={() => setVideoLoading(true)}
                  onReadyForDisplay={() => setVideoLoading(false)}
                  onError={() => {
                    setVideoLoading(false);
                    setMediaError("Media belum bisa diakses.");
                  }}
                  style={{ height: "100%", width: "100%" }}
                  useNativeControls={false}
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping={false}
                  shouldPlay={shouldPlayVideo}
                  volume={80}
                  onPlaybackStatusUpdate={(status: any) => {
                    if (!status?.isLoaded) {
                      return;
                    }
                    setVideoMillis(status?.positionMillis);
                    setVideoDuration(status?.durationMillis || 0);
                    completeMillisRef.current = status?.durationMillis;
                    durationMillisRef.current = status?.positionMillis;
                  }}
                />
                {!shouldPlayVideo && (
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
                    activeOpacity={0.8}
                    onPress={toggleVideoPlayback}
                  >
                    <Image
                      source={icons.playButton}
                      style={{ height: 60, width: 60, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <MediaPlayerControls
                isPlaying={shouldPlayVideo}
                positionMillis={videoMillis}
                durationMillis={videoDuration}
                onTogglePlay={toggleVideoPlayback}
                onSeek={seekVideo}
              />
              {mediaError !== "" && (
                <Text size={12} textAlign="center" color={colors.red}>
                  {mediaError}
                </Text>
              )}
            </View>
          )}
          {param?.data?.body_type === 2 && param?.data?.file && (
            <View>
              <Text textAlign="center" size={12}>
                {t("dokumen")}
              </Text>
              <Space height={10} />
              {/* <TouchableOpacity
                //@ts-ignore
                onPress={() => Linking.openURL(param?.data?.file?.url)}
                style={{
                  backgroundColor: colors.stone50,
                  paddingHorizontal: scaledHorizontal(15),
                  paddingVertical: scaledVertical(20),
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={icons.document}
                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                  />
                  <Text
                    size={12}
                    type="bold"
                    variant="CenturyGothicBold"
                    style={{ flex: 0.9 }}
                    numberOfLines={1}
                  >
                    {param?.data?.file?.filename}
                  </Text>
                </View>
                <Image
                  source={icons.download}
                  style={{
                    height: 16,
                    width: 16,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity> */}
              {/*
               * For PDFs the whole row is a button into the full-screen
               * reader (PdfViewerScreen). Rendering the document inline here
               * meant it sat inside this screen's ScrollView, which swallowed
               * every vertical drag -- the PDF showed page one and refused to
               * scroll. Non-PDF documents keep the reload button, since they
               * still render inline via the Google viewer below.
               */}
              <TouchableOpacity
                activeOpacity={isPdfFile ? 0.7 : 1}
                onPress={() => {
                  if (!isPdfFile) {
                    return;
                  }
                  NavigationService.navigate("PdfViewerScreen", {
                    title: param?.data?.file?.filename || "Dokumen",
                    url: fileUrl,
                  });
                }}
                style={{
                  backgroundColor: colors.stone50,
                  paddingHorizontal: scaledHorizontal(15),
                  paddingVertical: scaledVertical(10),
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Image
                    source={icons.document}
                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                  />
                  <Text
                    size={12}
                    type="bold"
                    variant="CenturyGothicBold"
                    style={{ flex: 1, marginLeft: 10 }}
                    numberOfLines={1}
                  >
                    {param?.data?.file?.filename}
                  </Text>
                </View>
                {isPdfFile ? (
                  <Image
                    source={icons.materi}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setMediaError("");
                      if (webViewRef?.current) {
                        webViewRef.current.reload();
                      }
                    }}
                  >
                    <Image
                      source={icons.materiRepeat}
                      style={{
                        height: 24,
                        width: 24,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {isPdfFile && (
                <Text
                  size={12}
                  textAlign="center"
                  color={colors.stone500}
                  style={{ marginBottom: 10 }}
                >
                  {"Ketuk dokumen di atas untuk membaca"}
                </Text>
              )}

              {mediaError !== "" && (
                <Text size={12} textAlign="center" color={colors.red}>
                  {mediaError}
                </Text>
              )}

              {isImageFile && (
                <Image
                  source={{ uri: fileUrl }}
                  style={{ height: 360, width: "100%", resizeMode: "contain" }}
                  onError={() => setMediaError("Dokumen belum bisa diakses.")}
                />
              )}

              {/* PDFs open in PdfViewerScreen (tap the row above); only
                  non-PDF documents still render inline via Google's viewer. */}
              {!isImageFile && !isPdfFile && googleViewerUrl && (
                <View
                  style={{
                    height: 500,
                    borderRadius: 8,
                    overflow: "hidden",
                    marginTop: 4,
                  }}
                >
                  <WebView
                    ref={(ref: any) => (webViewRef.current = ref)}
                    source={{
                      uri: googleViewerUrl,
                    }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    mixedContentMode="always"
                    cacheEnabled={false}
                    onError={() => setMediaError("Dokumen belum bisa diakses.")}
                    onHttpError={() =>
                      setMediaError("Dokumen belum bisa diakses.")
                    }
                    // eslint-disable-next-line max-len
                    userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                  />
                  {/* Overlay to block pop-out button */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 70,
                      height: 50,
                      backgroundColor: "transparent",
                      zIndex: 999,
                    }}
                  />
                </View>
              )}
            </View>
          )}

          {param?.data?.body_type === 3 && (
            <View>
              {param?.data?.file && (
                <Image
                  source={{ uri: fileUrl }}
                  style={{ height: 171, resizeMode: "contain" }}
                  onError={() => setMediaError("Media belum bisa diakses.")}
                />
              )}
              {mediaError !== "" && (
                <Text size={12} textAlign="center" color={colors.red}>
                  {mediaError}
                </Text>
              )}
              <Space height={10} />
              <RenderHTML
                contentWidth={width - 90}
                enableCSSInlineProcessing={true}
                source={{
                  html:
                    `<!DOCTYPE html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=${width}, initial-scale=1">
                            <link rel="stylesheet" href="https://use.typekit.net/oov2wcw.css">
                            <style type="text/css">
                              div {
                                max-width: ${width}px;
                                background-color: 'red';
                                font-family: century-gothic, sans-serif;
                              }
                              div, p {padding: 0; margin: 0; font-family: century-gothic, sans-serif;}
                              
                            </style>
                          </head>
                        <body>
                        <div style="padding: 0px;">` +
                    route?.params?.data?.body_text +
                    "</div></body></html>",
                }}
                tagsStyles={{
                  p: {
                    marginBottom: 10,
                    color: colors.black,
                    fontFamily: fonts.CenturyGothicRegular,
                    fontSize: 14,
                  },
                  br: {
                    marginBottom: 2,
                  },
                }}
                WebView={WebView}
                systemFonts={[fonts.CenturyGothicRegular]}
              />
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

export default ContentDetailScreen;
