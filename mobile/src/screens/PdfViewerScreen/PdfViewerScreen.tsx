import type { RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
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

  // Same resilience strategy as the old inline viewer: a multi-MB download over
  // a weak connection can get cut off ("Download interrupted"), so retry a
  // couple of times, then hand off to the Google Docs Viewer, which streams
  // rendered pages from Google's servers instead of pulling the whole file.
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  const [useViewerFallback, setUseViewerFallback] = useState(false);

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
        {isLoading && (
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

        {!useViewerFallback ? (
          <Pdf
            key={reloadKey}
            source={{ uri: fileUrl, cache: true }}
            // react-native-pdf defaults trustAllCerts to true, which routes the
            // download through react-native-blob-util's "unsafe" OkHttp client.
            // That path needs a TrustManager this app never registers, so it
            // always threw. Our storage domain has a valid certificate anyway.
            trustAllCerts={false}
            style={{ flex: 1, backgroundColor: colors.stone50 }}
            onLoadProgress={percent => {
              setProgress(percent);
              setIsLoading(true);
            }}
            onLoadComplete={() => {
              retryCountRef.current = 0;
              setIsLoading(false);
              reportOpened();
            }}
            onError={() => {
              if (retryCountRef.current < maxRetries) {
                retryCountRef.current += 1;
                setReloadKey(prev => prev + 1);
                return;
              }
              // Retries spent -- switch to the Google viewer rather than
              // showing a dead end. No error text here: the fallback is
              // about to try, so saying it failed would be premature.
              setIsLoading(true);
              setUseViewerFallback(true);
            }}
          />
        ) : (
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
