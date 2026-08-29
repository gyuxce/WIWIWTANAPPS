import type { RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import Button from "components/Button";
import { useAuth } from "hooks/useAuth";
import React, { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Pdf from "react-native-pdf";
import WebView from "react-native-webview";
import { apiPostStatusMateri } from "services/ExamServices";
import type { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";

type PdfViewerRouteType = RouteProp<RootStackParamList, "PdfViewerScreen">;

type PdfViewerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PdfViewerScreen"
>;

type Prop = {
  route: PdfViewerRouteType;
  navigation: PdfViewerNavigationProp;
};

/**
 * Full-screen PDF reader.
 *
 * Documents used to render inline on ContentDetailScreen inside a fixed 500px
 * box, which sat inside that screen's ScrollView. The outer ScrollView always
 * won the vertical drag, so the PDF's own page-scrolling never received any
 * gestures -- the document was visible but frozen on page one. Giving the PDF
 * its own screen with no scrollable ancestor is what makes scrolling and
 * pinch-zoom work, and it's the normal way to read a multi-page handbook.
 */
const PdfViewerScreen = ({ route }: Prop) => {
  const fileUrl = route?.params?.url || "";
  const title = route?.params?.title || "";
  const materialContentId = route?.params?.materialContentId;
  const { auth } = useAuth();

  // Progress used to be recorded the moment a student opened (and left) the
  // material screen -- with duration 0 and no requirement to have seen
  // anything, so a handbook could be marked "Selesai" without being opened at
  // all. Recording it here, only once the document has actually rendered,
  // makes the status mean what it says. Videos already worked this way (they
  // only complete once watched to the end).
  const hasReportedProgressRef = useRef(false);
  const reportOpened = () => {
    if (hasReportedProgressRef.current || !materialContentId) {
      return;
    }
    hasReportedProgressRef.current = true;
    apiPostStatusMateri(auth?.accessToken, {
      material_content_id: materialContentId,
      duration: "0",
      status: 1,
    });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFailed, setHasFailed] = useState(false);

  // There is deliberately NO automatic retry here.
  //
  // react-native-pdf downloads through react-native-blob-util, and its
  // componentWillUnmount drops the task handle without cancelling it -- the
  // cancel call is commented out in the library. Retrying by remounting the
  // component (changing `key`) therefore leaves the previous download running
  // as an orphan and starts another alongside it. Three retries meant four
  // concurrent downloads of the same multi-MB file competing over one
  // connection, which is slower than one attempt and eventually fails them
  // all -- visible in the device log as repeated "connection was leaked"
  // warnings. Adding retries made documents fail more often, not less.
  //
  // A single attempt, then an explicit "Coba Lagi" the student taps, keeps
  // exactly one download in flight and also removes the flicker that
  // remounting caused.
  const [useViewerFallback, setUseViewerFallback] = useState(false);

  const startOver = () => {
    setHasFailed(false);
    setErrorMessage("");
    setUseViewerFallback(false);
    setProgress(0);
    setIsLoading(true);
    setReloadKey(prev => prev + 1);
  };

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    fileUrl,
  )}&embedded=true`;

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={5} />
      <Header
        withBackLeft
        titleLeft
        textTitleLeft={title}
        textTitleJapanLeft={title}
        onBackLeft={() => NavigationService.back()}
      />
      <Space height={10} />

      {errorMessage !== "" && (
        <Text
          size={12}
          textAlign="center"
          color={colors.red}
          style={{ marginBottom: 8 }}
        >
          {errorMessage}
        </Text>
      )}

      <View style={{ flex: 1, backgroundColor: colors.stone50 }}>
        {isLoading && !hasFailed && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <ActivityIndicator size="large" color={colors.accent} />
            {progress > 0 && progress < 1 && (
              <>
                <Space height={8} />
                <Text size={12}>{Math.round(progress * 100)}%</Text>
              </>
            )}
          </View>
        )}

        {/*
         * An actionable failure state. Previously this screen handed off to
         * the Google viewer automatically, which frequently answered "No
         * preview available" and left the student staring at a dark screen
         * with no way forward.
         */}
        {hasFailed && !useViewerFallback && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <Text size={14} textAlign="center" type="bold">
              {"Dokumen gagal dimuat"}
            </Text>
            <Space height={8} />
            <Text size={12} textAlign="center" color={colors.stone500}>
              {
                "Koneksi terputus saat mengunduh. Periksa jaringan lalu coba lagi."
              }
            </Text>
            <Space height={20} />
            <Button
              title="Coba Lagi"
              onPress={startOver}
              style={{ paddingVertical: 14 }}
              textType="bold"
              variant="CenturyGothicBold"
            />
            <Space height={10} />
            {/*
             * Was plain coloured text, which readers did not recognise as
             * tappable. Given the same visual weight as a secondary button so
             * the second option is actually discoverable.
             */}
            <Button
              title="Buka dengan penampil alternatif"
              onPress={() => {
                setHasFailed(false);
                setIsLoading(true);
                setUseViewerFallback(true);
              }}
              style={{
                paddingVertical: 14,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: colors.stone400,
              }}
              textStyle={{ color: colors.stone500 }}
              textType="bold"
              variant="CenturyGothicBold"
              withBorder={false}
            />
          </View>
        )}

        {/*
         * Three exclusive states, not a two-way ternary: the previous version
         * fell through to the WebView whenever hasFailed was true, so the
         * Google viewer loaded underneath the error screen even though the
         * student never chose it.
         */}
        {!hasFailed && !useViewerFallback && (
          <Pdf
            key={reloadKey}
            source={{ uri: fileUrl, cache: true }}
            // react-native-pdf defaults trustAllCerts to true, which routes the
            // download through react-native-blob-util's "unsafe" OkHttp client.
            // That path needs a TrustManager this app never registers, so it
            // always threw. Our storage domain has a valid certificate anyway.
            trustAllCerts={false}
            // The library draws its own spinner on top of ours, so two
            // indicators appeared side by side while loading.
            renderActivityIndicator={() => <View />}
            style={{ flex: 1, backgroundColor: colors.stone50 }}
            onLoadProgress={percent => {
              setProgress(percent);
              setIsLoading(true);
            }}
            onLoadComplete={() => {
              setIsLoading(false);
              reportOpened();
            }}
            onError={() => {
              setIsLoading(false);
              setHasFailed(true);
            }}
          />
        )}

        {useViewerFallback && (
          <WebView
            source={{ uri: googleViewerUrl }}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            scalesPageToFit
            mixedContentMode="always"
            onLoadEnd={() => {
              setIsLoading(false);
              reportOpened();
            }}
            onError={() => {
              setIsLoading(false);
              setErrorMessage("Dokumen belum bisa diakses.");
            }}
            onHttpError={() => {
              setIsLoading(false);
              setErrorMessage("Dokumen belum bisa diakses.");
            }}
            // eslint-disable-next-line max-len
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          />
        )}
      </View>
    </View>
  );
};

export default PdfViewerScreen;
