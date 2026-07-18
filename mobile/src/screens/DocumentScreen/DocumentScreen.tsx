import Button from "components/Button";
import CardDocument from "components/CardDocument";
import Header from "components/Header";
import SearchAndSort from "components/SearchAndSort";
import Space from "components/Space";
import Text from "components/Text";
import icons from "configs/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  View,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import colors from "configs/colors";
import SortActionSheet from "components/SortActionSheet";
import DocumentPicker from "react-native-document-picker";
import { useDispatch } from "react-redux";
import { onErrorState } from "stores/error/errorSlice";
import { apiUploadDocument } from "services/UserService";
import { useAuth } from "hooks/useAuth";
import { ErrorStatus } from "utils/ErrorStatus";
import type { DocDataType, DocType, UserDocumentsType } from "types/DocTypes";
import { useUser } from "hooks/useUser";
import { useTranslation } from "react-i18next";

import styles from "./styles";
import { DOCUMENT_TYPE, USER_DOCUMENTS } from "./list";

const DocInfo = ({
  file,
  allowUpload = false,
  uploadText,
  onPress,
}: {
  file?: any;
  allowUpload?: boolean;
  uploadText?: string;
  onPress?: any;
}) => {
  const { t } = useTranslation();

  if (!file && allowUpload) {
    return (
      <View>
        <Button
          fontSize={12}
          variant="CenturyGothicBold"
          textType="bold"
          title={uploadText}
          textStyle={styles.buttonUpload}
          style={styles.buttonStyle}
          icon={icons.upload}
          iconStyle={styles.iconUpload}
          onPress={() => onPress && onPress()}
        />
        <Space height={4} />
        <Text textAlign="center" size={12}>
          ({t("document_format")}{" "}
          <Text size={12} variant="CenturyGothicBold" type="bold">
            PDF
          </Text>{" "}
          {t("maximum_size_document")})
        </Text>
      </View>
    );
  }
  return file ? (
    <View style={styles.docInfoWrapper}>
      <View style={styles.docInfo}>
        <Image style={styles.docInfoIcon} source={icons.document} />
        <Text
          size={12}
          numberOfLines={1}
          style={{ paddingRight: 20 }}
          type="bold"
          variant="CenturyGothicBold"
        >
          {file?.filename}
        </Text>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL(file?.url)}>
        <Image style={styles.docDownloadIcon} source={icons.download} />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.docInfoWrapper}>
      <View style={[styles.docInfo, { justifyContent: "center", flex: 1 }]}>
        <Image style={styles.docInfoIcon} source={icons.documentStone400} />
        <Text
          size={12}
          numberOfLines={1}
          style={{ paddingRight: 20 }}
          color={colors.stone400}
          type="bold"
          variant="CenturyGothicBold"
        >
          {t("belum_tersedia")}
        </Text>
      </View>
    </View>
  );
};

const DocumentScreen = () => {
  const [q, setQ] = useState("");
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();

  const dataSort = [
    { id: "1", title: t("sudah_upload") },
    { id: "0", title: t("belum_upload") },
  ];
  const [selectedSort, setSelectedSort] = useState(
    dataSort[1] as { id: string; title: string },
  );
  const [selectedFilter, setSelectedFilter] = useState([
    "bahasa",
    "karakter",
    "pelatihan",
    "pembayaran",
    "sertifikasi",
  ] as string[]);
  const dataFilter = [
    { id: "bahasa", title: t("dokumen_tes_bahasa") },
    { id: "karakter", title: t("dokumen_tes_karakter") },
    { id: "pelatihan", title: t("dokumen_pelatihan") },
    { id: "pembayaran", title: t("dokumen_pembayaran") },
    { id: "sertifikasi", title: t("dokumen_sertifikasi_bahasa_jepang") },
  ];

  const snapPoints = useMemo(() => [412], []);
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const { getUserDocs, userDocs } = useUser();
  const [docs, setDocs] = useState([] as DocType[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDocs, setIsFetchingDocs] = useState(false);

  const handlePickDocument = async (slug: string, type: number | string) => {
    try {
      const result: any = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.pdf,
      });
      const data: any = new FormData();
      data.append("file", {
        uri: result.uri,
        name: result.name,
        mime: result?.type,
        type: result.type,
      });
      data.append("slug", slug);
      data.append("type", type);
      try {
        setIsLoading(true);
        await apiUploadDocument(auth?.accessToken, data).then(() => {
          fetchData();
        });

        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        ErrorStatus(400, dispatch);
      }
    } catch (err: any) {
      if (!DocumentPicker.isCancel(err)) {
        dispatch(
          onErrorState({
            visible: true,
            text: err?.message || "Failed to select document",
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
    }
  };

  const checkFile = (
    userData: UserDocumentsType[],
    slug: string,
    type: number,
  ) => {
    const data = userData?.find(
      (item: UserDocumentsType) => item?.slug === slug,
    );

    return data?.file || null;
  };

  const renderDocsData = (
    data: any,
    type: number,
    userData: UserDocumentsType[],
  ) => {
    return data?.map((item: DocDataType) => ({
      label: item?.label,
      value: (
        <DocInfo
          file={checkFile(userData, item?.slug, type)}
          allowUpload={item?.allowUpload}
          uploadText={item?.uploadText}
          onPress={
            item?.allowUpload
              ? () => {
                  handlePickDocument(item?.slug, type);
                }
              : null
          }
        />
      ),
      status: checkFile(userData, item?.slug, type) ? "1" : "0",
      isRequired: item?.isRequired,
    }));
  };

  const filterDocs = (userData = userDocs, sort = selectedSort, query = q) => {
    let data: DocType[] = [
      {
        id: "pelatihan",
        title: t("dokumen_pelatihan"),
        data: renderDocsData(
          USER_DOCUMENTS.PELATIHAN,
          DOCUMENT_TYPE.PELATIHAN,
          userData,
        ),
      },
      // {
      //   id: "bahasa",
      //   title: "Dokumen Tes Bahasa",
      //   data: renderDocsData(
      //     USER_DOCUMENTS.TES_BAHASA,
      //     DOCUMENT_TYPE.TES_BAHASA,
      //     userData,
      //   ),
      // },
      {
        id: "karakter",
        title: t("dokumen_tes_karakter"),
        data: renderDocsData(
          USER_DOCUMENTS.TES_KARAKTER,
          DOCUMENT_TYPE.TES_KARAKTER,
          userData,
        ),
      },
      {
        id: "pembayaran",
        title: t("dokumen_pembayaran"),
        data: renderDocsData(
          USER_DOCUMENTS.PEMBAYARAN,
          DOCUMENT_TYPE.PEMBAYARAN,
          userData,
        ),
      },
      {
        id: "sertifikasi",
        title: t("dokumen_sertifikasi_bahasa_jepang"),
        data: renderDocsData(
          USER_DOCUMENTS.SERTIFIKASI_BAHASA_JEPANG,
          DOCUMENT_TYPE.SERTIFIKASI_BAHASA_JEPANG,
          userData,
        ),
      },
    ];
    // filter
    data = data?.filter((item: DocType) => selectedFilter.includes(item?.id));
    // sort && search
    const _sortedData: DocType[] = [];
    data?.forEach((doc: any) => {
      let value = doc?.data;
      if (sort?.id) {
        value = doc?.data?.sort((a: any, b: any) => {
          if (sort?.id === "0") {
            return a.status - b.status;
          }
          if (sort?.id === "1") {
            return b.status - a.status;
          }
          return 0;
        });
      }
      if (query) {
        value = value?.filter((item: DocDataType) =>
          item?.label.toLowerCase().includes(query),
        );
      }
      _sortedData.push({ ...doc, data: value });
    });
    setDocs(_sortedData);
  };

  const fetchData = async () => {
    setIsFetchingDocs(true);
    getUserDocs({
      type: "collection",
      relations: ["file"],
      order_by: "created_at",
      sort_by: "desc",
    }).then(({ data, status }) => {
      if (data) {
        filterDocs(data, selectedSort);
      }
      if (status === "failed") {
        ErrorStatus(500, dispatch);
      }
      setIsFetchingDocs(false);
    }).catch(() => {
      setIsFetchingDocs(false);
      ErrorStatus(500, dispatch);
    });
  };

  useEffect(() => {
    //if (firstLoad) {
    fetchData();

    //}
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        withTextTitle
        textTitleJapanLeft="自分の書類"
        textTitleLeft="Dokumen Saya"
        withBurger
      />
      <Space height={5} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <Space height={20} />
        <SearchAndSort
          search={q}
          setSearch={val => {
            setQ(val);
            filterDocs(userDocs, selectedSort, val);
          }}
          actionSheetRef={actionSheetRef}
          btnText="Filter"
          placeholder={t("cari_dokumen")}
        />
        {isFetchingDocs ? (
          <View style={{ marginTop: 40 }}>
            <ActivityIndicator size={"large"} color={colors.accent} />
          </View>
        ) : docs.length > 0 ? (
          <View style={styles.listDocContainer}>
            {docs?.map((item: DocType, i) => (
              <CardDocument
                key={"card_doc_" + i}
                title={item?.title}
                data={item?.data}
              />
            ))}
          </View>
        ) : (
          <Text size={12} style={{ marginTop: 40 }} textAlign="center">
            Dokumen tidak ditemukan
          </Text>
        )}
      </ScrollView>
      <SortActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        dataSort={dataSort}
        setSelectedSort={sort => {
          setSelectedSort(sort);
          filterDocs(userDocs, sort);
        }}
        selectedSort={selectedSort}
      >
        <Space height={20} />
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("filter")}
        </Text>
        <Space height={10} />
        <View style={styles.filterWrapper}>
          {dataFilter.map((item, index) => {
            return (
              <Button
                key={index}
                onPress={() => {
                  let currentFilter = selectedFilter;
                  if (selectedFilter.includes(item?.id)) {
                    currentFilter = selectedFilter?.filter(
                      (i: string) => i !== item?.id,
                    );
                  } else {
                    currentFilter = [...selectedFilter, item?.id];
                  }
                  setSelectedFilter(currentFilter);
                }}
                title={item?.title}
                style={[
                  styles.buttonFilter,
                  {
                    borderWidth: selectedFilter.includes(item.id) ? 1 : 0,
                  },
                ]}
                textType="bold"
                variant="CenturyGothicBold"
                textStyle={styles.buttonTextFilter}
                withBorder={false}
              />
            );
          })}
        </View>
      </SortActionSheet>
      <Modal transparent visible={isLoading}>
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={colors.accent} />
        </View>
      </Modal>
    </View>
  );
};

export default DocumentScreen;
