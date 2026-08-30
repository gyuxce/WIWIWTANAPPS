import type { RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Button from "components/Button";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import * as FileSystem from "expo-file-system";
import { useAuth } from "hooks/useAuth";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
 * The document is fetched here rather than by react-native-pdf, and that is
 * the whole point of this screen. Handing that library a network URL puts its
 * own downloader and cache in the critical path, and both proved unusable:
 *
 *   - it never cancelled a download when the reader was closed, so an orphan
 *     task kept writing into the file the next attempt would read;
 *   - it trusted any cached file it found without checking that it was
 *     complete, so one truncated file failed forever with no download
 *     attempted, no error and no timeout -- the reader simply sat at 0%;
 *   - and it treats a short read as fatal ("Download interrupted." from
 *     react-native-blob-util, raised whenever the bytes received do not match
 *     Content-Length) with no attempt to resume, which is exactly what a
 *     student on mobile data runs into.
 *
 * expo-file-system is already a dependency of this app, runs on a different
 * networking stack, and its download task can be cancelled and resumed. So we
 * download, verify and store the file ourselves, then hand react-native-pdf a
 * local file:// path -- at which point it only renders, and none of the code
 * above is reachable.
 */

const DOCUMENT_DIR = FileSystem.documentDirectory + "materi-pdf/";

// The storage URLs already end in a server-generated random name, which is
// unique per file and safe to reuse as a filename.
const localFileNameFor = (url: string) => {
  const pathPart = String(url).split("?")[0] || "";
  const lastSegment = pathPart.substring(pathPart.lastIndexOf("/") + 1);
  const safeName = lastSegment.replace(/[^a-zA-Z0-9._-]/g, "_") || "dokumen";

  return safeName.toLowerCase().endsWith(".pdf") ? safeName : safeName + ".pdf";
};

const PdfViewerScreen = ({ route }: Prop) => {
  const fileUrl = route?.params?.url || "";
  const title = route?.params?.title || "";
  const materialContentId = route?.params?.materialContentId;
  const { auth } = useAuth();

  // Progress used to be recorded the moment a student opened (and left) the
  // material screen -- with duration 0 and no requirement to have seen
  // anything, so a handbook could be marked "Selesai" without being opened at
  // all. Recording it only once the document has actually rendered makes the
  // status mean what it says.
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

  const [localUri, setLocalUri] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFailed, setHasFailed] = useState(false);
  const [useViewerFallback, setUseViewerFallback] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const isMountedRef = useRef(true);
  const downloadRef = useRef<FileSystem.DownloadResumable | null>(null);

  const loadDocument = useCallback(async () => {
    const targetUri = DOCUMENT_DIR + localFileNameFor(fileUrl);

    // Ask the server how large the document is. This decides both whether a
    // stored copy is complete and whether a finished download actually
    // arrived in full. A server that will not answer is not a reason to fail:
    // 0 means "unknown", and the caller then trusts what it already has.
    const fetchExpectedSize = async () => {
      try {
        const response = await fetch(fileUrl, { method: "HEAD" });

        return Number(response.headers.get("content-length")) || 0;
      } catch (e) {
        return 0;
      }
    };

    const sizeOf = async (uri: string) => {
      const info = await FileSystem.getInfoAsync(uri, { size: true });

      return info.exists && !info.isDirectory ? Number(info.size) || 0 : 0;
    };

    try {
      await FileSystem.makeDirectoryAsync(DOCUMENT_DIR, {
        intermediates: true,
      });

      const expectedSize = await fetchExpectedSize();
      const storedSize = await sizeOf(targetUri);

      // A stored copy is reused only when it is provably whole.
      if (
        storedSize > 0 &&
        (expectedSize === 0 || storedSize === expectedSize)
      ) {
        if (isMountedRef.current) {
          setLocalUri(targetUri);
        }
        return;
      }

      if (storedSize > 0) {
        await FileSystem.deleteAsync(targetUri, { idempotent: true });
      }

      const task = FileSystem.createDownloadResumable(
        fileUrl,
        targetUri,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (!isMountedRef.current || totalBytesExpectedToWrite <= 0) {
            return;
          }
          setProgress(totalBytesWritten / totalBytesExpectedToWrite);
        },
      );
      downloadRef.current = task;

      await task.downloadAsync();

      // A download reporting success is not proof that all of it arrived: a
      // dropped connection ends the transfer quietly. Resuming asks only for
      // the missing bytes instead of starting the multi-MB file over, which
      // is what lets this survive a patchy mobile connection.
      let downloadedSize = await sizeOf(targetUri);

      if (expectedSize > 0 && downloadedSize !== expectedSize) {
        await task.resumeAsync();
        downloadedSize = await sizeOf(targetUri);
      }

      if (!isMountedRef.current) {
        return;
      }

      if (downloadedSize === 0) {
        throw new Error("Berkas tidak tersimpan di perangkat.");
      }

      if (expectedSize > 0 && downloadedSize !== expectedSize) {
        // Leave nothing partial behind: a truncated file is exactly what used
        // to be reused forever.
        await FileSystem.deleteAsync(targetUri, { idempotent: true });
        throw new Error(
          "Unduhan terputus (" +
            downloadedSize +
            " dari " +
            expectedSize +
            " byte).",
        );
      }

      setLocalUri(targetUri);
    } catch (error: any) {
      if (!isMountedRef.current) {
        return;
      }
      setErrorMessage(String(error?.message || error || "").trim());
      setIsLoading(false);
      setHasFailed(true);
    } finally {
      downloadRef.current = null;
    }
  }, [fileUrl]);

  useEffect(() => {
    isMountedRef.current = true;
    loadDocument();

    return () => {
      isMountedRef.current = false;
      // Closing the reader stops the transfer. Leaving it running is how
      // half-written files were produced in the first place.
      downloadRef.current?.cancelAsync().catch(() => {
        // Already finished or already gone -- nothing left to stop.
      });
      downloadRef.current = null;
    };
  }, [loadDocument, attempt]);

  const startOver = () => {
    setHasFailed(false);
    setErrorMessage("");
    setUseViewerFallback(false);
    setLocalUri("");
    setProgress(0);
    setIsLoading(true);
    setAttempt(prev => prev + 1);
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
              {"Dokumen tidak dapat diunduh. Coba lagi dalam beberapa saat."}
            </Text>
            {/*
             * The underlying wording, kept on screen. A generic "check your
             * connection" sent us chasing the network for days while the
             * fault was local.
             */}
            {errorMessage !== "" && (
              <>
                <Space height={8} />
                <Text size={10} textAlign="center" color={colors.stone400}>
                  {errorMessage}
                </Text>
              </>
            )}
            <Space height={20} />
            <Button
              title="Coba Lagi"
              onPress={startOver}
              style={{ paddingVertical: 14 }}
              textType="bold"
              variant="CenturyGothicBold"
            />
            <Space height={10} />
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
         * A local path only. react-native-pdf resolves a file:// source
         * straight to the renderer, so its downloader and cache -- the source
         * of every failure this screen has seen -- are never entered.
         */}
        {!hasFailed && !useViewerFallback && localUri !== "" && (
          <Pdf
            source={{ uri: localUri }}
            renderActivityIndicator={() => <View />}
            style={{ flex: 1, backgroundColor: colors.stone50 }}
            onLoadComplete={() => {
              setIsLoading(false);
              reportOpened();
            }}
            onError={(error: any) => {
              setErrorMessage(String(error?.message || error || "").trim());
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
