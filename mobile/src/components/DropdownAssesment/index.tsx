import Button from "components/Button";
import Card from "components/Card";
import ModalAlert from "components/ModalAlert";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { useAuth } from "hooks/useAuth";
import { t } from "i18next";
import moment from "moment";
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Linking, Alert } from "react-native";
import { apiGetAssesment } from "services/ExamServices";
import { ModalAlertProps } from "types/AppTypes";
import { AsesmentType, AssesmentTypeResponse } from "types/TrainingTypes";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { wait } from "utils/Utils";

interface DropdownAssesmentProps {
  assesment: AssesmentTypeResponse[] | undefined;
  icon: string;
  level: string;
  sort: { id: string; title: string };
}

const DropdownAssesment = ({
  assesment,
  icon,
  level,
  sort,
}: DropdownAssesmentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState({} as ModalAlertProps);
  const { user, auth } = useAuth();
  const checkIsInActive = () => {
    return assesment?.reduce((total, item) => {
      // Now, we further reduce the `item.assesment` array, specifically looking for `typeAssesment.status === 2`
      const statusTwoCount =
        item?.assesment?.reduce((count, assesmentItem) => {
          return (
            count +
            (assesmentItem?.typeAssesment &&
            (assesmentItem?.assesmentStudent?.status === 1 ||
              assesmentItem?.assesmentStudent?.status === 3)
              ? 1
              : 0)
          );
        }, 0) || 0;

      return total + statusTwoCount;
    }, 0);
  };

  const startAssesment = (id: string, title: string, working_date: string) => {
    setShowModal({
      showModal: true,
      titleBig: t("memulai_tes"),
      title: t("mulai_asesmen_description"),
      leftText: t("mulai"),
      iconImage: icons.warningRed,
      leftFunction: () => {
        apiGetAssesment(auth?.accessToken, id).then(({ data }) => {
          if (data?.question?.question?.length > 1) {
            setShowModal({ showModal: false, title: "" });
            NavigationService.navigate("AssesmentTimerStart", {
              id: id,
              title: title,
              icon: icon,
              working_date: working_date,
            });
          } else {
            setShowModal({ showModal: false, title: "" });
            wait(500).then(() => {
              Alert.alert(t("asesment"), t("soal_kosong"));
            });
          }
        });
      },
      rightText: t("cek_dulu_deh"),
      rightFunction: () => {
        setShowModal({ showModal: false, title: "" });
      },
    });
  };

  const checkStartAssesmentDisabled = (item: AsesmentType) => {
    if (item?.level_module < (user?.last_level || 5)) {
      return true;
    }

    if (item?.typeAssesment?.exam_template_type === 5) {
      if (item?.assesmentStudent) {
        if (
          item?.assesmentStudent?.status === 1 ||
          item?.assesmentStudent?.is_scheduled === 0 ||
          item?.assesmentStudent?.status === 3
        ) {
          return true;
        } else {
          if (
            moment(new Date()).isBefore(
              moment(item?.assesmentStudent?.working_date),
            )
          ) {
            return false;
          }
          return true;
        }
      } else {
        return true;
      }
    }

    if (item?.typeAssesment?.exam_template_type === 1) {
      if (
        item?.assesmentStudent?.status === 1 ||
        item?.assesmentStudent?.status === 3
      ) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  };

  const getScoreTotal = (item: AsesmentType) => {
    return (
      (Number(item?.assesmentStudent?.userExam?.weight_achieved || 0) /
        Number(item?.assesmentStudent?.userExam?.weight_total || 0)) *
      100
    );
  };

  const getCheckScore = (item: AsesmentType) => {
    if (item?.typeAssesment?.exam_template_type === 5) {
      return (
        Number(item?.assesmentStudent?.weight_final) >
        Number(item?.assesmentStudent?.weight_minimum)
      );
    }
    return (
      (Number(item?.assesmentStudent?.userExam?.weight_achieved || 0) /
        Number(item?.assesmentStudent?.userExam?.weight_total || 0)) *
        100 >
      item?.assesmentStudent?.weight_minimum
    );
  };

  return (
    <Card>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text type="bold" variant="CenturyGothicBold">
          Level {level}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={checkIsInActive() === 0 ? colors.red : colors.black}
            >
              {checkIsInActive()}
            </Text>
            <Text>/</Text>
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={checkIsInActive() === 0 ? colors.red : colors.black}
            >
              {assesment?.reduce((total, item) => {
                return total + (item?.assesment?.length || 0);
              }, 0)}
            </Text>
          </View>
          <Image
            source={isOpen ? icons.arrowRight2 : icons.arrowBottom}
            style={{ height: 24, width: 24, resizeMode: "contain" }}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View>
          {assesment
            ?.map(item => {
              const sortedAssessments = [...(item?.assesment || [])].sort(
                (a, b) => {
                  if (a.typeAssesment?.exam_template_type === 5) {
                    // Sort based on weight_final for exam_template_type === 5
                    return sort.id === "nilai-asc"
                      ? (a.assesmentStudent?.weight_final || 0) -
                          (b.assesmentStudent?.weight_final || 0)
                      : (b.assesmentStudent?.weight_final || 0) -
                          (a.assesmentStudent?.weight_final || 0);
                  } else {
                    // Calculate percentages for other types and sort
                    const percentageA =
                      ((Number(a.assesmentStudent?.userExam?.weight_achieved) ||
                        0) /
                        (Number(a.assesmentStudent?.userExam?.weight_total) ||
                          1)) *
                      100;
                    const percentageB =
                      ((Number(b.assesmentStudent?.userExam?.weight_achieved) ||
                        0) /
                        (Number(b.assesmentStudent?.userExam?.weight_total) ||
                          1)) *
                      100;
                    return sort.id === "nilai-asc"
                      ? percentageA - percentageB
                      : percentageB - percentageA;
                  }
                },
              );

              return { assesment: sortedAssessments };
            })
            .map((item, index) => {
              return (
                <View key={index}>
                  {item?.assesment?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: colors.zinc50,
                          marginTop: scaledVertical(20),
                          paddingHorizontal: scaledHorizontal(20),
                          paddingVertical: scaledVertical(20),
                          borderRadius: 8,
                        }}
                      >
                        <Text size={12} style={{ fontWeight: "900" }}>
                          {item.title}
                        </Text>

                        {item?.assesmentStudent?.status === 1 ? (
                          <View>
                            <Space height={10} />
                            <Card style={{ flexDirection: "row", gap: 20 }}>
                              <View
                                style={{
                                  flex: 1.3,
                                  flexDirection: "row",
                                  gap: 5,
                                  alignItems: "center",
                                  backgroundColor: getCheckScore(item)
                                    ? colors.orange
                                    : colors.red,
                                  justifyContent: "center",
                                  paddingVertical: scaledVertical(10),
                                  borderRadius: 8,
                                }}
                              >
                                <Text size={12} color={colors.white}>
                                  {t("skor")}
                                </Text>
                                <Text
                                  size={32}
                                  variant="OpificioNeueRegular"
                                  style={{ fontWeight: "900" }}
                                  color={colors.white}
                                >
                                  {getScoreTotal(item) ||
                                    Number(
                                      item?.assesmentStudent?.weight_final,
                                    )}
                                </Text>
                              </View>

                              {getCheckScore(item) ? (
                                <View
                                  style={{ flex: 1, justifyContent: "center" }}
                                >
                                  <Text size={12}>{t("nilai_minimum")}</Text>
                                  <Text
                                    size={16}
                                    type="bold"
                                    variant="CenturyGothicBold"
                                  >
                                    {Number(
                                      item?.assesmentStudent?.weight_minimum,
                                    )}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{ flex: 1, justifyContent: "center" }}
                                >
                                  <Text size={12}>{t("poin_diraih")}</Text>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      size={16}
                                      type="bold"
                                      variant="CenturyGothicBold"
                                    >
                                      {Number(
                                        item?.assesmentStudent?.userExam
                                          ?.weight_achieved ||
                                          item?.assesmentStudent?.weight_final,
                                      )}
                                    </Text>
                                    <Text size={12} textAlign="center">
                                      {" "}
                                      {t("dari")}{" "}
                                    </Text>
                                    <Text
                                      size={16}
                                      type="bold"
                                      variant="CenturyGothicBold"
                                    >
                                      {" "}
                                      {Number(
                                        item?.assesmentStudent?.userExam
                                          ?.weight_total ||
                                          item?.assesmentStudent
                                            ?.weight_minimum,
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </Card>
                          </View>
                        ) : null}

                        {item?.assesmentStudent?.status === 4 ? (
                          <View>
                            <Space height={10} />
                            <Card style={{ flexDirection: "row", gap: 20 }}>
                              <View
                                style={{
                                  flex: 1.3,
                                  flexDirection: "row",
                                  gap: 5,
                                  alignItems: "center",
                                  backgroundColor: getCheckScore(item)
                                    ? colors.orange
                                    : colors.red,
                                  justifyContent: "center",
                                  paddingVertical: scaledVertical(10),
                                  borderRadius: 8,
                                }}
                              >
                                <Text size={12} color={colors.white}>
                                  {t("skor")}
                                </Text>
                                <Text
                                  size={32}
                                  variant="OpificioNeueRegular"
                                  style={{ fontWeight: "900" }}
                                  color={colors.white}
                                >
                                  {getScoreTotal(item) ||
                                    Number(
                                      item?.assesmentStudent?.weight_final,
                                    )}
                                </Text>
                              </View>
                              {getCheckScore(item) ? (
                                <View
                                  style={{ flex: 1, justifyContent: "center" }}
                                >
                                  <Text size={12}>{t("nilai_minimum")}</Text>
                                  <Text
                                    size={16}
                                    type="bold"
                                    variant="CenturyGothicBold"
                                  >
                                    {Number(
                                      item?.assesmentStudent?.weight_minimum,
                                    )}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{ flex: 1, justifyContent: "center" }}
                                >
                                  <Text size={12}>{t("poin_diraih")}</Text>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      size={16}
                                      type="bold"
                                      variant="CenturyGothicBold"
                                    >
                                      {Number(
                                        item?.assesmentStudent?.userExam
                                          ?.weight_achieved ||
                                          item?.assesmentStudent?.weight_final,
                                      )}
                                    </Text>
                                    <Text size={12} textAlign="center">
                                      {" "}
                                      {t("dari")}{" "}
                                    </Text>
                                    <Text
                                      size={16}
                                      type="bold"
                                      variant="CenturyGothicBold"
                                    >
                                      {" "}
                                      {Number(
                                        item?.assesmentStudent?.userExam
                                          ?.weight_total ||
                                          item?.assesmentStudent
                                            ?.weight_minimum,
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </Card>
                          </View>
                        ) : null}

                        <Space height={15} />
                        {item?.assesmentStudent?.status !== 1 && (
                          <Button
                            onPress={
                              () => {
                                if (
                                  item?.typeAssesment?.exam_template_type === 1
                                ) {
                                  startAssesment(
                                    item?.id,
                                    item?.title,
                                    String(
                                      item?.assesmentStudent?.working_date ||
                                        new Date(),
                                    ),
                                  );
                                } else {
                                  setShowModal({
                                    showModal: true,
                                    titleBig: t("memulai_tes"),
                                    title: t("mulai_asesmen_description"),
                                    leftText: t("mulai"),
                                    iconImage: icons.warningRed,
                                    leftFunction: () => {
                                      setShowModal({
                                        showModal: false,
                                        title: "",
                                      });
                                      Linking.openURL(
                                        item?.assesmentStudent?.link,
                                      );
                                    },
                                    rightText: t("cek_kembali_deh"),
                                    rightFunction: () => {
                                      setShowModal({
                                        showModal: false,
                                        title: "",
                                      });
                                    },
                                  });
                                }
                              }
                              //NavigationService.navigate("AssesmentQuestionScreen")
                            }
                            title={`${
                              item?.assesmentStudent?.status === 4
                                ? t("ulangi_asesmen")
                                : t("mulai_asesmen")
                            }`}
                            style={{ height: 46 }}
                            textType="bold"
                            fontSize={12}
                            variant="CenturyGothicBold"
                            icon={icons.sheet}
                            innerStyle={{ gap: 10, alignItems: "center" }}
                            iconStyle={{
                              height: 24,
                              width: 24,
                              resizeMode: "contain",
                            }}
                            disabled={checkStartAssesmentDisabled(item)}
                            withBorder={!checkStartAssesmentDisabled(item)}
                          />
                        )}

                        {item?.assesmentStudent?.status == 1 && (
                          <Button
                            onPress={() => {
                              if (item?.file) {
                                NavigationService.navigate(
                                  "AssesmentReviewScreen",
                                  {
                                    title: item?.title,
                                    file: item?.file,
                                  },
                                );
                              } else {
                                Alert.alert(
                                  "Error",
                                  t("tidak_ada_review_video"),
                                );
                              }
                            }}
                            title={t("review_asesmen")}
                            style={{ height: 46 }}
                            textType="bold"
                            fontSize={12}
                            variant="CenturyGothicBold"
                            icon={icons.playButton}
                            innerStyle={{ gap: 10, alignItems: "center" }}
                            iconStyle={{
                              height: 24,
                              width: 24,
                              resizeMode: "contain",
                              tintColor: colors.black,
                            }}
                          />
                        )}

                        <Space height={10} />

                        <Text style={{}} size={10}>
                          {t("tipe_asesmen")}:{" "}
                          <Text
                            size={10}
                            color={colors.accent}
                            type="bold"
                            variant="CenturyGothicBold"
                          >
                            {item?.typeAssesment?.title}
                          </Text>
                        </Text>

                        {item?.typeAssesment?.exam_template_type === 1 &&
                          (item?.assesmentStudent?.status === 1 ||
                            item?.assesmentStudent?.status === 3 ||
                            item?.assesmentStudent?.status === 4) && (
                            <View>
                              <Space height={10} />
                              <Text style={{}} size={10}>
                                {t("dikerjakan_pada")}:{" "}
                                <Text
                                  size={10}
                                  color={colors.accent}
                                  type="bold"
                                  variant="CenturyGothicBold"
                                >
                                  {item?.created_at
                                    ? moment(
                                        item?.assesmentStudent?.working_date,
                                      ).format("DD MMMM YYYY")
                                    : "-"}
                                </Text>
                              </Text>
                            </View>
                          )}

                        {item?.typeAssesment?.exam_template_type === 1 &&
                          item?.assesmentStudent?.status === 3 && (
                            <View>
                              <Space height={10} />
                              <Text style={{}} size={10}>
                                {t("diselesaikan_pada")}:{" "}
                                <Text
                                  size={10}
                                  color={colors.accent}
                                  type="bold"
                                  variant="CenturyGothicBold"
                                >
                                  {item?.assesmentStudent
                                    ? moment(
                                        item?.assesmentStudent?.updated_at,
                                      ).format("DD MMMM YYYY")
                                    : "-"}
                                </Text>
                              </Text>
                            </View>
                          )}

                        {item?.typeAssesment?.exam_template_type === 5 &&
                          item?.assesmentStudent?.is_scheduled === 1 && (
                            <View>
                              <Space height={10} />
                              <Text style={{}} size={10}>
                                {t("dijadwalkan_pada")}:{" "}
                                <Text
                                  size={10}
                                  color={colors.accent}
                                  type="bold"
                                  variant="CenturyGothicBold"
                                >
                                  {item?.assesmentStudent
                                    ? moment(
                                        item?.assesmentStudent?.working_date,
                                      ).format("DD MMMM YYYY")
                                    : "-"}
                                </Text>
                              </Text>
                            </View>
                          )}

                        {item?.typeAssesment?.exam_template_type === 5 &&
                          (item?.assesmentStudent?.status === 1 ||
                            item?.assesmentStudent?.status === 3 ||
                            item?.assesmentStudent?.status === 4) && (
                            <View>
                              <Space height={10} />
                              <Text style={{}} size={10}>
                                {t("dikerjakan_pada")}:{" "}
                                <Text
                                  size={10}
                                  color={colors.accent}
                                  type="bold"
                                  variant="CenturyGothicBold"
                                >
                                  {item?.created_at
                                    ? moment(
                                        item?.assesmentStudent?.updated_at,
                                      ).format("DD MMMM YYYY")
                                    : "-"}
                                </Text>
                              </Text>
                            </View>
                          )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
        </View>
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
        iconImage={showModal?.iconImage}
        withIcon
        titleBig={showModal.titleBig}
        imageSize={showModal?.imageSize}
      />
    </Card>
  );
};

export default DropdownAssesment;
