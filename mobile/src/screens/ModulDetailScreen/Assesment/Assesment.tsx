import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React, { useState } from "react";
import { Alert, Image, Linking, TouchableOpacity, View } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import CardInfo from "./CardInfo";
import icons from "configs/icons";
import Button from "components/Button";
import { AsesmentType, AssesmentTypeResponse } from "types/TrainingTypes";
import moment from "moment";
import NavigationService from "utils/NavigationService";
import { ModalAlertProps } from "types/AppTypes";
import ModalAlert from "components/ModalAlert";
import { useAuth } from "hooks/useAuth";
import { t } from "i18next";

interface AssesmentProps {
  data: AssesmentTypeResponse;
  icon: string;
}

const Assesment = ({ data, icon }: AssesmentProps) => {
  const [isAgree, setIsAgree] = useState(false);
  const [showModal, setShowModal] = useState({} as ModalAlertProps);
  const { user } = useAuth();
  const checkIfAssesmentStudentExists = () => {
    return data.assesment.some(item => item.assesmentStudent !== null);
  };

  const startAssesment = (id: string, title: string, working_date: string) => {
    setShowModal({
      showModal: true,
      titleBig: t("memulai_tes"),
      title: t("mulai_asesmen_description"),
      leftText: t("mulai"),
      iconImage: icons.warningRed,
      leftFunction: () => {
        setShowModal({ showModal: false, title: "" });
        NavigationService.navigate("AssesmentTimerStart", {
          id: id,
          title: title,
          icon: icon,
          working_date: working_date,
        });
      },
      rightText: t("cek_kembali_deh"),
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
    <View>
      {checkIfAssesmentStudentExists() ? (
        <View>
          {data === null ? (
            <View>
              <Text>No Assesment</Text>
            </View>
          ) : (
            <View>
              <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
                {data?.assesment.map((item, index) => {
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
                                  Number(item?.assesmentStudent?.weight_final)}
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
                                        item?.assesmentStudent?.weight_minimum,
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
                                  Number(item?.assesmentStudent?.weight_final)}
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
                                        item?.assesmentStudent?.weight_minimum,
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
                              Alert.alert("Error", t("tidak_ada_review_video"));
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
              </Card>
            </View>
          )}
        </View>
      ) : (
        <View>
          <CardInfo />
          <TouchableOpacity
            onPress={() => setIsAgree(!isAgree)}
            style={{
              flexDirection: "row",
              gap: 10,
              marginHorizontal: scaledHorizontal(25),
              marginTop: scaledVertical(25),
            }}
          >
            <Image
              source={isAgree ? icons.checklistBox : icons.box}
              style={{ width: 18, height: 18, resizeMode: "cover" }}
            />
            <Text size={12} variant="CenturyGothicRegular" style={{ flex: 1 }}>
              {t("agreement_asesmen")}
            </Text>
          </TouchableOpacity>
          <Space height={15} />
          <Button
            //onPress={onPressSubmit}
            title={t("mulai_asesmen")}
            style={{
              paddingVertical: 15,
              marginHorizontal: scaledHorizontal(25),
            }}
            textStyle={{ fontSize: 12 }}
            disabled={!isAgree}
            textType="bold"
            variant="CenturyGothicBold"
            withBorder={isAgree ? true : false}
          />
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
    </View>
  );
};

export default Assesment;
