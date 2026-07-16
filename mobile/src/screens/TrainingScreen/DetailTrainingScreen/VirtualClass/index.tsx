import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Text from "components/Text";
import Dropdown from "components/Dropdown/Dropdown";
import { VirtualClassModuleType, VirtualClassType } from "types/TrainingTypes";
import SearchAndSort from "components/SearchAndSort";
import { scaledHorizontal } from "utils/ScaledService";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Space from "components/Space";
import VirtualClassActionSheet from "components/VirtualClassActionSheet";
import dayjs from "dayjs";
import { useTraining } from "hooks/useTraining";
import { t } from "i18next";

interface Props {
  virtualClassList: VirtualClassModuleType[];
  categoryId: string;
}

const VirtualClass = ({ virtualClassList, categoryId }: Props) => {
  const { getVirtualClassList } = useTraining();
  const [query, setQuery] = useState({ q: "" });
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [630], []);
  const timeout: any = useRef(null);
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
    { id: "date-asc", title: t("tanggal_terbaru") },
    { id: "date-desc", title: t("tanggal_terlama") },
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
      getVirtualClassList(
        categoryId,
        query?.q || "",
        selectedDate?.start_date,
        selectedDate?.end_date,
        selectedFilter,
        selectedSort,
      );
    }, 1000);
  }, [query?.q, selectedDate, selectedFilter, selectedSort]);

  const groupingAssessment = () => {
    const groups: { [key: number]: VirtualClassType[] } = {};

    virtualClassList?.forEach(module => {
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

  return (
    <View>
      <SearchAndSort
        search={query?.q}
        setSearch={val => {
          setQuery({ q: val });
          //filterModule(selectedSort, val);
        }}
        actionSheetRef={actionSheetRef}
        btnText={t("filter")}
        placeholder={t("cari")}
        marginHorizontal={scaledHorizontal(0)}
      />
      <Space height={10} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {virtualClassList.length > 0 ? (
          <View>
            {groupingAssessment()
              ?.sort((a, b) => {
                if (selectedSort?.id === "asc") {
                  return b.level_module - a.level_module;
                } else if (selectedSort?.id === "desc") {
                  return a.level_module - b.level_module;
                } else {
                  return a.level_module - b.level_module;
                }
              })
              .map((item, index) => {
                return (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Dropdown
                      level={"N" + item?.level_module}
                      classVirtual={item?.modules || []}
                    />
                  </View>
                );
              })}
          </View>
        ) : (
          <Text size={12} style={{ marginTop: 40 }} textAlign="center">
            Tidak ada kelas virtual
          </Text>
        )}
      </ScrollView>
      <VirtualClassActionSheet
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
      />
    </View>
  );
};

export default VirtualClass;
