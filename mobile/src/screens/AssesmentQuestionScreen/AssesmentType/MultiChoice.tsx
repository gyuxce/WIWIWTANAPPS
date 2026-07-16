import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { QuestionType } from "types/ExamTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { alphabet } from "utils/Utils";

interface MultiChoiceProps {
  question: QuestionType;
  indexQuestion: number;
  savingQuestion: (
    idxQuestion: number,
    questionId: string,
    idxAnswer: number,
  ) => void;
}
const MultiChoice = ({
  question,
  indexQuestion,
  savingQuestion,
}: MultiChoiceProps) => {
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ fontWeight: "900" }}>{indexQuestion + 1}.</Text>
        <Text style={{ fontWeight: "900", flex: 1 }}>{question?.title}</Text>
      </View>
      <Space height={20} />

      {question?.question_items?.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => savingQuestion(indexQuestion, question?.id, index)}
            style={{
              paddingTop: scaledVertical(25),
              paddingBottom: scaledVertical(25),
              paddingHorizontal: scaledHorizontal(15),
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
            key={index}
          >
            <View
              style={{
                height: 34,
                width: 34,
                borderRadius: 36 / 2,
                backgroundColor:
                  question?.userAnswareSelected?.question_item?.id === item?.id
                    ? colors.red
                    : colors.stone200,

                alignContent: "center",
                justifyContent: "center",
              }}
            >
              {/* Saving the selected question to redux persist */}
              <Text
                textAlign="center"
                style={{ padding: 4 }}
                size={14}
                type="bold"
                variant="CenturyGothicBold"
                color={
                  question?.userAnswareSelected?.question_item?.id === item?.id
                    ? colors?.white
                    : colors.stone400
                }
              >
                {alphabet[index]}
              </Text>
            </View>
            <Text
              style={{ flex: 1 }}
              size={12}
              type={
                question?.userAnswareSelected?.question_item?.id === item.id
                  ? "bold"
                  : "reguler"
              }
              variant={
                question?.userAnswareSelected?.question_item?.id === question.id
                  ? "CenturyGothicBold"
                  : "CenturyGothicRegular"
              }
            >
              {item?.description}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MultiChoice;
