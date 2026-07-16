import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import ModalAlert from "components/ModalAlert";
import Space from "components/Space";
import Text from "components/Text";
import TextInput from "components/TextInput";
import Topic from "components/Topic";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import { useForum } from "hooks/useForum";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, View } from "react-native";
import WebView from "react-native-webview";
import type { ModalAlertProps } from "types/AppTypes";
import globalStyles from "utils/GlobalStyles";
import { useKeyboardVisible } from "utils/KeyboardShowListeners";
import NavigationService from "utils/NavigationService";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";
import type { PostForumType } from "types/ForumTypes";
import { useAuth } from "hooks/useAuth";
import {
  apiDeleteForumDetail,
  apiPostForumPost,
  apiPutForumPost,
} from "services/ForumServices";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import type { RouteProp } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import type { QueryType } from "types/QueryTypes";
import LoadingModal from "components/LoadingModal/LoadingModal";
import { wait } from "utils/Utils";
import { API_URL } from '@env';
import { onErrorState } from "stores/error/errorSlice";
import { useTranslation } from "react-i18next";

import {
  praktikalJepang,
  softSkill,
  teoriJepang,
  belajarDanPeluangDiLuarNegeri,
  karirDiJepang,
  hidupDanKerjaDiJepang,
} from "./ConfigTypes";

type ForumEditorRouteType = RouteProp<RootStackParamList, "ForumEditorScreen">;

type ForumEditorNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForumEditorScreen"
>;

type Prop = {
  route: ForumEditorRouteType;
  navigation: ForumEditorNavigationProp;
};

const ForumEditorScreen = ({ route }: Prop) => {
  const { t } = useTranslation();
  //delta is retrieve or new data
  const [delta, setDelta] = useState(JSON.stringify({ ops: [] }));
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  //deltaText is delta to send to server
  const [deltaText, setDeltaText] = useState(null as any);
  const [form, setForm] = useState({ title: "", topic: {} } as {
    title: string;
    topic: {
      id?: string;
      title?: string;
      image?: any;
      imageSelected?: any;
      type?: number;
    };
  });
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [showModal, setShowModal] = useState({} as ModalAlertProps);
  const webViewRef: WebView | null = null;
  const isKeyboardVisible = useKeyboardVisible();
  const [topic, setTopic] = useState(
    [] as {
      id: string;
      title: string;
      type?: number;
      image: any;
      imageSelected: any;
    }[],
  );

  const {
    getTopicType,
    harshWord,
    getHarsWord,
    getForumDetail,
    metaDraft,
    getPostForumDraft,
  } = useForum();
  const { user, auth } = useAuth();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const editHtmls = [
    // ============ 0 ============
    `<meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://use.typekit.net/oov2wcw.css">
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <link href="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css" rel="stylesheet">
    <script src="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js"></script>
    <style>
      .ql-editor.ql-blank::before{  
        font-style: normal !important;
        
      }
      .ql-editor {
        font-family: century-gothic, sans-serif;
        
        
      }
      .ql-container {
        border: none !important;
        padding: none !important;
      }
      .ql-toolbar {
        padding: 0px 5px;
        border-top-width: 1px !important;
        border-right: none !important;
        border-bottom: none !important;
        border-left: none !important;
      }
      .ql-toolbar .ql-active {
        background-color: #E7E5E4 !important; /* Change to your desired color */
        color: #FFFFFF !important; /* Change to your desired text color */
      }
      
      /* Style for selected toolbar buttons */
      .ql-toolbar .ql-selected {
        background-color: #E7E5E4 !important; /* Change to your desired color */
        color: #000000 !important; /* Change to your desired text color */
      }
      .ql-toolbar button {
        border-radius: 6px !important;
      }

      .ql-active .ql-stroke {
        fill: none;
        stroke: black !important;
      }
      
    </style>
    <div id="editor" style=" font-size: 16px; height: `,
    // ============ 1 ============
    `;"></div>
    <div id="toolbar">
       
        <!-- Add a bold button -->
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-align" value=""></button>
        <button class="ql-align" value="center"></button>
        <button class="ql-align" value="right"></button>
        <button class="ql-align" value="justify"></button>
        
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-image"></button>
        
    </div>
  
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    
    <script>
        
        var quill = new Quill('#editor',{ 
            modules: { toolbar: '#toolbar' },
            placeholder: "Tulis pengalaman mu.",
            theme: 'snow',
        });
        quill.setContents(` + delta,
    // ============ 2 ============
    `,);
        quill.on('text-change', function() {
            var delta = quill.getContents();
            var htmlQuill = quill.root.innerHTML
            window.ReactNativeWebView.postMessage(JSON.stringify(delta));
        });
        quill.getModule('toolbar').addHandler('image', () => {
          var input = document.createElement("input");
          input.setAttribute("type", "file");
          input.click();
           input.onchange = () => {
              const file = input.files[0];
              if (file) {
                const maxSize = 2 * 1024 * 1024; // 2MB in bytes

                if (file.size <= maxSize) {
                  const loading = { 
                        type: 'waiting',
                        message: 'loading',
                        data: {}
                      }
                      window.ReactNativeWebView.postMessage(JSON.stringify(loading));
                  const formData = new FormData();
                  formData.append("file", file);
                  fetch('` +
      API_URL +
      `/files', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      Authorization: 'Bearer ` +
      auth?.accessToken +
      `',
                    },
                  })
                    .then(async (response) => {
                      const result = await response.json();
                      const resultUpload = { 
                        type: 'success',
                        message: 'success',
                        data: result
                      }
                      const range = quill.getSelection();
                      quill.insertEmbed(range.index, 'image', resultUpload.data.url);
                      window.ReactNativeWebView.postMessage(JSON.stringify(resultUpload));
                    })
                    
                    .catch((error) => {
                      const err = { 
                        type: 'error',
                        message: 'API Upload Error',
                        data: error
                      }
                      window.ReactNativeWebView.postMessage(JSON.stringify(err));
                    });
                } else {
                  const err = { 
                        type: 'error',
                        message: 'File tidak boleh melebihi 2MB',
                        data: {}
                      }
                  window.ReactNativeWebView.postMessage(JSON.stringify(err));
                  
                }
              } else {
                const err = { 
                        type: 'error',
                        message: 'API Upload Error',
                        data: error
                      }
                      window.ReactNativeWebView.postMessage(JSON.stringify(err));
              }
          };
        });
        quill.format('align', 'left');
    
    </script>`,
  ];

  useEffect(() => {
    if (route?.params?.id) {
      getForumDetail(route?.params?.id).then(({ data }) => {
        if (data) {
          setForm({
            ...form,
            title: data?.title,
            topic: { id: data?.topic?.id, title: data?.topic?.name },
          });
          try {
            const text = JSON.parse(data?.description);
            setDeltaText(text);
            setDelta(text);
          } catch (error) {
            ErrorStatus(500, dispatch);
          }
        } else {
          ErrorStatus(500, dispatch);
        }
      });
    }
    getTopicType({ type: "collection" }).then(({ status, data }) => {
      if (status === "success" && data) {
        if (data?.length > 0) {
          const updatedTopic = data?.map(item => {
            switch (item?.name) {
              case "Teori Bahasa Jepang":
                return { ...teoriJepang, type: item?.type, id: item?.id };
              case "Praktikal Bahasa Jepang":
                return { ...praktikalJepang, type: item?.type, id: item?.id };
              case "Soft Skill":
                return { ...softSkill, type: item?.type, id: item?.id };
              case "Karir di Jepang":
                return { ...karirDiJepang, type: item?.type, id: item?.id };
              case "Hidup & Kerja di Jepang":
                return {
                  ...hidupDanKerjaDiJepang,
                  type: item?.type,
                  id: item?.id,
                };
              case "Belajar & Peluang lain di luar negeri":
                return {
                  ...belajarDanPeluangDiLuarNegeri,
                  type: item?.type,
                  id: item?.id,
                };
              default:
                return null;
            }
          });

          const filteredUpdatedTopic: any = updatedTopic.filter(
            item => item !== null,
          );

          setTopic(filteredUpdatedTopic);
          setIsLoadingTopic(false);
        }
      }
    });
    getHarsWord({ type: "collection" });
    getPostForumDraft([], {
      type: "pagination",
      relations: ["user", "topic"],
      q: "",
      options: [["filter,is_draft,equal,1"]],
    } as QueryType);
  }, []);

  const onPressPost = (isDraft: number, isPublish: number) => {
    setIsLoadingModal(true);
    const dataHarsh = harshWord.map(item => item?.name);

    const text = JSON.parse(deltaText);
    const highlightedTextSet = new Set();

    text?.ops?.forEach((item: any) => {
      if (!item?.insert?.image) {
        const hars = new RegExp(`(${dataHarsh.join("|")})`, "gi");
        const parts = item?.insert?.split(hars);
        parts?.forEach((part: any) => {
          const isHighlighted = dataHarsh.some(
            searchTerm => part?.toLowerCase() === searchTerm?.toLowerCase(),
          );
          if (isHighlighted) {
            highlightedTextSet.add(part?.toLowerCase());
          }
        });
      }
    });
    const highlightedTextArray: any = [...highlightedTextSet];

    if (highlightedTextArray?.length > 0) {
      setIsLoadingModal(false);
      wait(500).then(() => {
        setShowModal({
          withIcon: true,
          iconImage: icons.warningRed,
          showModal: true,
          titleBig: t("cek_postingan"),
          title: t("cek_postingan_description"),
          leftText: t("perbaiki"),
          listWorstText: highlightedTextArray,
          leftFunction: () => {
            setShowModal({ showModal: false, title: "" });
          },
        });
      });
    } else {
      const body: PostForumType = {
        title: form?.title,
        description: JSON.stringify(deltaText),
        user_id: user?.id,
        topic_id: form?.topic?.id || "",
        is_draft: isDraft,
        is_publish: isPublish,
      };
      if (route?.params?.id) {
        apiPutForumPost(auth?.accessToken, body, route?.params?.id).then(
          ({ data }) => {
            if (data) {
              setIsLoadingModal(false);
              wait(500).then(() => {
                setShowModal({
                  showModal: true,
                  titleBigJapan: "ありがとう",
                  titleBig: "Terimakasih",
                  title: isPublish
                    ? `${
                        route?.params?.id ? t("post_edit") : t("post_publish")
                      }`
                    : `${
                        route?.params?.id
                          ? t("post_edit_draft")
                          : t("post_edit")
                      }`,
                  leftText: t("kembali"),
                  leftFunction: () => {
                    setShowModal({ showModal: false, title: "" });
                    isPublish && route?.params.from === "ForumScreen"
                      ? navigation.navigate("ForumScreen")
                      : NavigationService.back();
                  },
                });
              });
            } else {
              setIsLoadingModal(false);
              ErrorStatus(500, dispatch);
            }
          },
        );
      } else {
        apiPostForumPost(auth?.accessToken, body).then(({ data }) => {
          if (data) {
            setIsLoadingModal(false);
            wait(500).then(() => {
              setShowModal({
                showModal: true,
                titleBigJapan: "ありがとう",
                titleBig: "Terimakasih",
                title: `${isPublish ? t("post_publish") : t("post_draft")} `,
                leftText: t("kembali"),
                leftFunction: () => {
                  setShowModal({ showModal: false, title: "" });
                  isDraft
                    ? NavigationService.replace("ForumDraftScreen")
                    : NavigationService.back();
                },
              });
            });
          } else {
            setIsLoadingModal(false);
            ErrorStatus(500, dispatch);
          }
        });
      }
    }
  };

  const isValid = () => {
    if (deltaText) {
      const text = JSON.parse(deltaText);

      if (form?.title !== "" && form?.topic?.title && text?.ops) {
        return true;
      }

      return false;
    }

    return false;
  };

  const onDeletePost = () => {
    setShowModal({
      iconImage: icons.trashRed,
      withIcon: true,
      showModal: true,
      titleBig: t("hapus_postingan_kamu"),
      subtitle: t("hapus_description"),
      leftText: t("hapus"),
      leftFunction: () => {
        apiDeleteForumDetail(auth?.accessToken, route?.params?.id || "").then(
          ({ success }) => {
            if (success) {
              setShowModal({
                showModal: false,
                title: "",
              });
              navigation.navigate("ForumScreen");
            } else {
              ErrorStatus(500, dispatch);
            }
          },
        );
      },
      rightText: t("batal"),
      rightFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
      },
    });
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        textJapan={`${
          route?.params?.id
            ? "ディスカッションを編集"
            : "新しいディスカッション"
        }`}
        textTitle={`${route?.params?.id ? "Ubah Diskusi" : "Diskusi Baru"}`}
        withTextTitle
        withBackButton
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Space height={25} />

          {metaDraft?.total >= 1 && (
            <View>
              <Button
                onPress={() => NavigationService.navigate("ForumDraftScreen")}
                variant="CenturyGothicBold"
                textType="bold"
                title={`${t("draft")} (${metaDraft?.total || 0})`}
                type="light"
                style={{ paddingVertical: 12, width: "35%" }}
                textStyle={{
                  fontSize: scaledFontSize(20),
                  lineHeight: 18,
                }}
              />
              <Space height={25} />
            </View>
          )}

          <Text size={14}>{t("judul")}</Text>
          <Space height={10} />
          <TextInput
            value={form?.title}
            onChange={(text: string) => {
              setForm({ ...form, title: text });
            }}
            borderLess={false}
            placeholder={t("masukan_judul_diskusi")}
            placeholderColor={colors.stone400}
            stylesBox={{ backgroundColor: colors.white }}
            textStyle={{
              height: 35,
              textAlign: "left",
              fontFamily: fonts.CenturyGothicBold,
              fontSize: 13,
            }}
          />
        </View>
        <View style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Text size={14}>{t("deskripsi")}</Text>
          <Space height={10} />
        </View>

        <View
          style={{
            height: 450,
            //width: "100%",
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <WebView
            nestedScrollEnabled
            ref={webViewRef}
            javaScriptEnabled={true}
            scrollEnabled
            style={{
              borderRadius: 20,
              borderWidth: 0,
              height: 450,
            }}
            source={{
              html:
                editHtmls[0] +
                (400).toString() +
                editHtmls[1] +
                //delta +
                editHtmls[2],
            }}
            onMessage={(e: any) => {
              const data = JSON.parse(e.nativeEvent.data);
              if (data.type === "waiting") {
                wait(500).then(() => {
                  setIsLoadingModal(true);
                });
              } else if (data.type === "error") {
                setIsLoadingModal(false);
                wait(500).then(() => {
                  dispatch(
                    onErrorState({
                      visible: true,
                      text: data.message,
                      icon: icons.searchClose,
                      withCloseIcon: true,
                      withIcon: true,
                    }),
                  );
                });
              } else if (data.type === "success") {
                setIsLoadingModal(false);
              } else {
                let delt = e.nativeEvent.data,
                  n,
                  imgs = [];
                const deltaParsed = JSON.parse(delt);
                for (n = 0; n < deltaParsed.ops.length; n++) {
                  const img = deltaParsed.ops[n].insert.image;
                  if (img) {
                    imgs.push({ path: img });
                  }
                }
                setDeltaText(delt);
              }
            }}
          />
        </View>
        <Space height={20} />
        <View style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Text size={14}>{t("topik")}</Text>
          <Space height={20} />
        </View>
        {isLoadingTopic ? (
          <View>
            <Space height={100} />
            <ActivityIndicator size={"large"} color={colors.black} />
          </View>
        ) : (
          <View>
            {topic.map((item, index) => {
              return (
                <Topic
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  imageSelected={item.imageSelected}
                  key={index}
                  selectedTopic={form?.topic}
                  form={form}
                  setForm={setForm}
                />
              );
            })}
          </View>
        )}

        <Space height={30} />
      </ScrollView>
      {!isKeyboardVisible ? (
        <Card
          style={{
            borderWidth: 1,
            borderRadius: 0,
            borderTopEndRadius: 12,
            borderTopStartRadius: 12,
            borderColor: colors.black,
            borderStyle: "solid",
            zIndex: 999,
          }}
        >
          <Button
            onPress={() => onPressPost(0, 1)}
            variant="CenturyGothicBold"
            textType="bold"
            title={`${
              route?.params?.id
                ? route?.params?.from !== "ForumDraftScreen"
                  ? t("ubah_postingan")
                  : t("buat_postingan")
                : t("buat_postingan")
            }`}
            type="light"
            style={{ paddingVertical: 10, minWidth: "100%" }}
            textStyle={{
              fontSize: 12,
              lineHeight: 18,
            }}
            disabled={!isValid()}
            withBorder={isValid()}
          />

          {isValid() ? (
            <Button
              onPress={() => onPressPost(1, 0)}
              variant="CenturyGothicBold"
              textType="bold"
              title={t("simpan_draft")}
              type="light"
              style={{ paddingVertical: 10, minWidth: "100%" }}
              withBorder={false}
              textStyle={{
                fontSize: 12,
                lineHeight: 18,
              }}
            />
          ) : null}
          {route?.params?.id && (
            <Button
              onPress={onDeletePost}
              variant="CenturyGothicBold"
              textType="bold"
              title={t("hapus")}
              type="light"
              style={{ paddingVertical: 10, minWidth: "100%" }}
              withBorder={false}
              textStyle={{
                fontSize: 12,
                lineHeight: 18,
              }}
            />
          )}
        </Card>
      ) : null}

      <ModalAlert
        onHide={() => setShowModal({ showModal: false, title: "" })}
        showModal={showModal?.showModal}
        animation={"zoom"}
        title={showModal?.title}
        leftFunction={showModal.leftFunction}
        rightFunction={showModal.rightFunction}
        leftText={showModal.leftText}
        rightText={showModal.rightText}
        iconImage={showModal?.iconImage}
        withIcon={showModal?.withIcon}
        titleBig={showModal.titleBig}
        withTime={showModal?.withTime}
        time={showModal?.time}
        listWorstText={showModal?.listWorstText}
        titleBigJapan={showModal?.titleBigJapan}
        subtitle={showModal?.subtitle}
      />
      <LoadingModal showModal={isLoadingModal} />
    </View>
  );
};

export default ForumEditorScreen;
