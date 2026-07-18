import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import AssesmentActionSheet from "components/AssesmentActionSheet";
import { scaledHorizontal } from "utils/ScaledService";
import SearchAndSort from "components/SearchAndSort";
import { useTraining } from "hooks/useTraining";
import Space from "components/Space";
import DropdownAssesment from "components/DropdownAssesment";
import { useIsFocused } from "@react-navigation/core";
import { AssesmentTypeResponse } from "types/TrainingTypes";
import { t } from "i18next";
import Text from "components/Text";
import colors from "configs/colors";

interface AsesmenProps {
  categoryId: string;
  icon: string;
}

const Asesmen = ({ categoryId, icon }: AsesmenProps) => {
  const { assesmentList, getAssesmentList } = useTraining();
  const [query, setQuery] = useState({ q: "", lowest: "", highest: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [330], []);
  const timeout: any = useRef(null);
  const isFocused = useIsFocused();
  const dataDate = [
    {
      id: "",
      title: t("semua_tanggal"),
      type: "button",
      start_date: "",
      end_date: "",
    },
    {
      id: `30-day`,
      title: t("30_hari_terakhir"),
      type: "button",
      start_date: dayjs(new Date()).subtract(30, "day").format("YYYY-MM-DD"),
      end_date: dayjs(new Date()).format("YYYY-MM-DD"),
    },
    {
      id: `90-day`,
      title: t("90_hari_terakhir"),
      type: "button",
      start_date: dayjs(new Date()).subtract(90, "day").format("YYYY-MM-DD"),
      end_date: dayjs(new Date()).format("YYYY-MM-DD"),
    },
    {
      id: "custom",
      title: t("pilih_tanggal"),
      type: "custom",
      start_date: "",
      end_date: "",
    },
  ];
  const dataSort = [
    { id: "nilai-asc", title: t("nilai_tertinggi") },
    { id: "nilai-desc", title: t("nilai_terendah") },
    { id: "desc", title: t("level_tertinggi") },
    { id: "asc", title: t("level_terendah") },
  ];
  const dataFilter = [
    { id: "1", title: t("belum_dimulai") },
    { id: "2", title: t("selesai") },
  ];
  const [selectedSort, setSelectedSort] = useState(
    dataSort[0] as { id: string; title: string },
  );
  const [selectedFilter, setSelectedFilter] = useState(
    dataFilter as { id: string; title: string }[],
  );
  const [selectedDate, setSelectedDate] = useState(
    dataDate[0] as {
      id: string;
      title: string;
      type: string;
      start_date: string;
      end_date: string;
    },
  );

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (!categoryId || !isFocused) {
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      getAssesmentList(
        categoryId,
        selectedDate?.start_date,
        selectedDate?.end_date,
        query?.highest,
        query?.lowest,
      ).then(result => {
        setIsLoading(false);
        if (result?.status !== "success") {
          setErrorMessage("Asesmen belum bisa dimuat.");
        }
      });
    }, 1000);
    return () => clearTimeout(timeout.current);
  }, [categoryId, isFocused, selectedDate, query?.highest, query?.lowest]);

  const groupingAssessment = () => {
    const groups: { [key: number]: AssesmentTypeResponse[] } = {};

    assesmentList?.forEach(module => {
      if (!groups[module.level_module]) {
        groups[module.level_module] = [];
      }
      //@ts-ignore
      groups[module.level_module].push(module);
    });

    return Object.keys(groups).map(level_module => ({
      level_module: parseInt(level_module, 10),
      modules: groups[parseInt(level_module, 10)],
    }));
  };

  const displayedAssessment = groupingAssessment()
    ?.sort((c, d) => {
      if (selectedSort.id === "desc") {
        return c.level_module - d.level_module; // Ascending
      } else if (selectedSort.id === "asc") {
        return d.level_module - c.level_module; // Descending
      }

      return 0;
    })
    .filter(item => {
      if (query?.q && query.q !== "") {
        const searchText = query.q.toLowerCase();
        return item?.modules?.some(itm =>
          String(itm?.title || "")
            .toLowerCase()
            .includes(searchText),
        );
      } else {
        return true;
      }
    })
    .filter(itm => {
      return itm.modules?.some(it => {
        if (!selectedFilter || selectedFilter.length === 0) {
          return true;
        } else if (selectedFilter.length === 2) {
          return it.assesment && it.assesment.length > 0;
        } else {
          const filterId = selectedFilter[0]?.id;
          switch (filterId) {
            case "1":
              return it.assesment?.some(item => item.assesmentStudent === null);
            case "2":
              return it.assesment?.some(
                item => item?.assesmentStudent?.status === 1,
              );
            default:
              return it.assesment && it.assesment.length > 0;
          }
        }
      });
    });

  return (
    <View>
      <SearchAndSort
        search={query?.q}
        setSearch={val => {
          setQuery({ ...query, q: val });
          //filterModule(selectedSort, val);
        }}
        actionSheetRef={actionSheetRef}
        btnText={t("filter")}
        placeholder={t("cari")}
        marginHorizontal={scaledHorizontal(0)}
      />

      <Space height={10} />

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={{ marginTop: 40 }}
        />
      ) : errorMessage !== "" ? (
        <Text
          size={12}
          color={colors.red}
          style={{ marginTop: 40 }}
          textAlign="center"
        >
          {errorMessage}
        </Text>
      ) : displayedAssessment.length > 0 ? (
        displayedAssessment.map((item, index) => {
          return (
            <View key={index}>
              <DropdownAssesment
                assesment={item?.modules}
                icon={icon}
                level={"N" + item?.level_module}
                sort={selectedSort}
              />

              <Space height={10} />
            </View>
          );
        })
      ) : (
        <Text size={12} style={{ marginTop: 40 }} textAlign="center">
          Tidak ada asesmen
        </Text>
      )}

      <Space height={110} />
      {/* <DropdownAssesment assesment={assesmentList} /> */}
      {/* <CardLessonScore title="Lanjutan Bahasa Jepang Level 2" score={98} />
      <CardLessonScore title="Lanjutan Bahasa Jepang Level 2" score={93} />
      <CardLessonScore title="Lanjutan Bahasa Jepang Level 2" score={87} />
      <CardLessonScore
        title="Lanjutan Bahasa Jepang Level 2"
        btnTitle="Mulai Asesmen"
        isButton
      />
      <CardLessonScore
        title="Lanjutan Bahasa Jepang Level 2"
        btnTitle="Mulai Asesmen"
        isButton
      /> */}
      <AssesmentActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        dataSort={dataSort}
        selectedSort={selectedSort}
        setSelectedSort={sort => {
          setSelectedSort(sort);
        }}
        dataFilter={dataFilter}
        selectedFilter={selectedFilter}
        setSelectedFilter={filter => {
          setSelectedFilter(filter);
        }}
        dataDate={dataDate}
        selectedDate={selectedDate}
        setSelectedDate={filter => {
          setSelectedDate(filter);
        }}
        query={query}
        setQuery={setQuery}
      />
    </View>
  );
};

export default Asesmen;
