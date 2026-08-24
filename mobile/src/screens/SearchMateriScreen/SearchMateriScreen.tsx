import React, { useState, useRef } from "react";
import { ActivityIndicator, FlatList, Image, Platform, View } from "react-native";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import Space from "components/Space";
import Card from "components/Card";
import Text from "components/Text";
import TextInput from "components/TextInput";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import { scaledHorizontal } from "utils/ScaledService";
import { useExam } from "hooks/useExam";
import NavigationService from "utils/NavigationService";
import type { TraningModuleProgressType } from "types/ExamTypes";

const SearchMateriScreen = () => {
  const { searchTrainingModule } = useExam();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<TraningModuleProgressType[]>([]);
  const timeout: any = useRef(null);

  const onChangeKeyword = (text: string) => {
    setKeyword(text);
    clearTimeout(timeout.current);

    if (!text || text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    timeout.current = setTimeout(() => {
      setIsLoading(true);
      searchTrainingModule(text.trim())
        .then(({ data }) => {
          setResults(data || []);
          setHasSearched(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        textJapan="教材を検索"
        textTitle={"Cari Materi"}
        withTextTitle
        withBackButton
      />
      <Space height={20} />

      <View style={{ paddingHorizontal: scaledHorizontal(25) }}>
        <TextInput
          value={keyword}
          onChange={onChangeKeyword}
          borderLess={false}
          placeholder="Cari judul materi..."
          placeholderColor={colors.stone400}
          stylesBox={{ backgroundColor: colors.stone100 }}
          textStyle={{
            height: 35,
            textAlign: "left",
            paddingLeft: scaledHorizontal(30),
          }}
          iconLeft={icons.search}
          iconLeftStyle={{
            height: 18,
            width: 18,
            resizeMode: "contain",
            marginLeft: 5,
            zIndex: 999,
          }}
        />
      </View>

      <Space height={16} />

      {isLoading && (
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}

      {!isLoading && (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingHorizontal: scaledHorizontal(25),
            paddingBottom: 40,
          }}
          ListEmptyComponent={
            hasSearched ? (
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <Text size={12} color={colors.stone400} textAlign="center">
                  Materi dengan kata kunci "{keyword}" tidak ditemukan.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 12, padding: 14 }}>
              <View
                onTouchEnd={() =>
                  NavigationService.navigate("DetailTrainingScreen", {
                    categoryCourse: item,
                  })
                }
                style={{ flexDirection: "row", gap: 12 }}
              >
                <Image
                  source={
                    item?.cover ? { uri: item?.cover?.url } : images.placeholder
                  }
                  style={{
                    height: 56,
                    width: 56,
                    borderRadius: 8,
                    resizeMode: "cover",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    size={14}
                    type="bold"
                    variant="CenturyGothicBold"
                    color={colors.black}
                  >
                    {item?.title}
                  </Text>
                  {!!item?.matched_materi?.length && (
                    <>
                      <Space height={4} />
                      <Text size={11} color={colors.stone400}>
                        Materi:{" "}
                        {item.matched_materi.slice(0, 2).join(", ")}
                        {item.matched_materi.length > 2
                          ? ` +${item.matched_materi.length - 2} lagi`
                          : ""}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default SearchMateriScreen;
