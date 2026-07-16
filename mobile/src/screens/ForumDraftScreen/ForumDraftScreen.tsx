import { useNavigation } from "@react-navigation/core";
import Header from "components/Header";
import ModalAlert from "components/ModalAlert";
import Space from "components/Space";
import Text from "components/Text";
import TextDraft from "components/TextDraft";
import colors from "configs/colors";
import icons from "configs/icons";
import { useAuth } from "hooks/useAuth";
import { useForum } from "hooks/useForum";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { apiDeleteForumDetail } from "services/ForumServices";
import type { ModalAlertProps } from "types/AppTypes";
import type { QueryType } from "types/QueryTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { isCloseToBottom } from "utils/Utils";

const ForumDraftScreen = () => {
  const [showModal, setShowModal] = useState({} as ModalAlertProps);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const { auth } = useAuth();
  const { metaDraft, forumDraft, getPostForumDraft } = useForum();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { t } = useTranslation();
  const [querySearch] = useState({
    type: "pagination",
    relations: ["user", "topic"],
    q: "",
    page: 1,
    limit: 20,
    order_by: "id",
    sort_by: "desc",
    options: [["filter,is_draft,equal,1"]],
  } as QueryType);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, []);

  const getData = () => {
    setIsLoading(true);
    getPostForumDraft([], querySearch).then(({ data }) => {
      if (data) {
        setIsLoading(false);
      } else {
        ErrorStatus(500, dispatch);
      }
    });
  };

  const onPressTrash = (id: string) => {
    setShowModal({
      showModal: true,
      titleBig: t("hapus_draft"),
      withIcon: true,
      title: t("hapus_draft_description"),
      leftText: t("hapus"),
      leftFunction: () => {
        setShowModal({ showModal: false, title: "" });
        apiDeleteForumDetail(auth?.accessToken, id).then(({ success }) => {
          if (success) {
            setShowModal({
              showModal: false,
              title: "",
            });
            getData();
          } else {
            ErrorStatus(500, dispatch);
          }
        });
      },
      rightText: t("cek_kembali_deh"),
      rightFunction: () => {
        setShowModal({ showModal: false, title: "" });
      },
    });
  };

  const onPressCard = (id: string) => {
    NavigationService.push("ForumEditorScreen", {
      id: id,
      from: "ForumDraftScreen",
    });
  };

  const loadMore = () => {
    if (metaDraft?.current_page < metaDraft?.last_page) {
      setLoadingIndicators(true);
      getPostForumDraft(forumDraft, {
        ...querySearch,
        page: metaDraft?.current_page + 1,
        limit: 20,
      } as QueryType).then(() => {
        setLoadingIndicators(false);
      });
    }
  };
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        textJapan="草案"
        textTitle="Draft"
        withTextTitle
        withBackButton
      />
      <Space height={20} />
      {isLoading ? (
        <View>
          <Space height={100} />
          <ActivityIndicator size={"large"} color={colors.black} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: scaledHorizontal(25) }}
          onScrollEndDrag={event => {
            if (isCloseToBottom(event.nativeEvent)) {
              if (!loadingIndicators) {
                loadMore();
              }
            }
          }}
        >
          {forumDraft?.length > 0 ? (
            <View>
              {forumDraft?.map((item, index) => {
                return (
                  <TextDraft
                    key={index}
                    title={item.title}
                    onPressTrash={() => onPressTrash(item.id)}
                    onPressCard={() => onPressCard(item.id)}
                  />
                );
              })}
              {loadingIndicators && (
                <View>
                  <Space height={15} />
                  <ActivityIndicator size={"large"} color={colors.black} />
                </View>
              )}
            </View>
          ) : (
            <View style={{ marginTop: scaledVertical(100) }}>
              <Text textAlign="center">{t("belum_ada_draft")}</Text>
            </View>
          )}
          <Space height={50} />
        </ScrollView>
      )}

      <ModalAlert
        onHide={() => setShowModal({ showModal: false, title: "" })}
        showModal={showModal?.showModal}
        animation={"zoom"}
        title={showModal?.title}
        leftFunction={showModal.leftFunction}
        rightFunction={showModal.rightFunction}
        leftText={showModal.leftText}
        rightText={showModal.rightText}
        iconImage={icons.warningRed}
        withIcon={showModal?.withIcon}
        titleBig={showModal.titleBig}
      />
    </View>
  );
};

export default ForumDraftScreen;
