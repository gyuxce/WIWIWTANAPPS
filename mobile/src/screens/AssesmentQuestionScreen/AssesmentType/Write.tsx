import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { FileType, QuestionType } from "types/ExamTypes";
import { scaledHorizontal } from "utils/ScaledService";
import DocumentPicker from "react-native-document-picker";
import { apiUploadImage } from "services/UserService";
import { useAuth } from "hooks/useAuth";
import { ErrorStatus } from "utils/ErrorStatus";
import { onErrorState } from "stores/error/errorSlice";

interface WriteProps {
  question: QuestionType;
  indexQuestion: number;
  file: FileType;
  setFile: (file: FileType) => void;
}

const Write = ({ indexQuestion, question, file, setFile }: WriteProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();

  const upload = async () => {
    try {
      const result: any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      const data: any = new FormData();
      data.append("file", {
        uri: result.uri,
        name: result.name,
        mime: result?.type,
        type: result.type,
      });
      try {
        setIsLoading(true);
        const resp = await apiUploadImage(auth?.accessToken, data, dispatch);
        if (resp?.uuid) {
          setFile(resp);
        } else {
          ErrorStatus(400, dispatch);
        }
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
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ fontWeight: "900" }}>{indexQuestion + 1}.</Text>
        <Text style={{ fontWeight: "900", flex: 1 }}>
          <Text color={colors.red}>[TULIS]</Text> {question?.title}
        </Text>
      </View>

      <Space height={20} />
      <Button
        onPress={upload}
        title={file?.id ? file?.filename : "Foto Jawaban"}
        style={{ paddingVertical: scaledHorizontal(15) }}
        textStyle={{ fontWeight: "900" }}
        textType="bold"
        icon={file?.id ? undefined : icons.camera}
        iconStyle={{ height: 24, width: 24, resizeMode: "contain" }}
        innerStyle={{ alignItems: "center", gap: 10 }}
        isLoading={isLoading}
      />
    </View>
  );
};

export default Write;
