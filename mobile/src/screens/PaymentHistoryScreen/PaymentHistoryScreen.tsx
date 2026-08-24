import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, View } from "react-native";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import Space from "components/Space";
import Card from "components/Card";
import Text from "components/Text";
import colors from "configs/colors";
import { scaledHorizontal } from "utils/ScaledService";
import { usePayment } from "hooks/usePayment";
import { numberToRupiah, formatDate } from "utils/Utils";

const PRICE_TYPE_LABEL: { [key: number]: string } = {
  1: "Administrasi",
  2: "Pelatihan",
};

const PAYMENT_STATUS: { [key: number]: { label: string; color: string } } = {
  1: { label: "Belum Bayar", color: colors.stone400 },
  2: { label: "Sebagian Terbayar", color: colors.yellow500 },
  3: { label: "Lunas", color: colors.green500 },
  4: { label: "Gagal/Dibatalkan", color: colors.red },
};

const PaymentHistoryScreen = () => {
  const { getPaymentHistory } = usePayment();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    getPaymentHistory()
      .then(({ status, data }) => {
        if (status === "success") {
          setTransactions(data || []);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        textJapan="お支払い履歴"
        textTitle={"Riwayat Pembayaran"}
        withTextTitle
        withBackButton
      />
      <Space height={20} />

      {isLoading ? (
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          contentContainerStyle={{
            paddingHorizontal: scaledHorizontal(25),
            paddingBottom: 40,
          }}
          ListEmptyComponent={
            <View style={{ marginTop: 60, alignItems: "center" }}>
              <Text size={12} color={colors.stone400} textAlign="center">
                Belum ada riwayat pembayaran.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const status = PAYMENT_STATUS[item?.status] || {
              label: "-",
              color: colors.stone400,
            };
            return (
              <Card style={{ marginBottom: 16, padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      size={14}
                      type="bold"
                      variant="CenturyGothicBold"
                      color={colors.black}
                    >
                      {PRICE_TYPE_LABEL[item?.price_type] || "Pembayaran"}
                    </Text>
                    <Space height={4} />
                    <Text size={11} color={colors.stone400}>
                      {item?.number}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 100,
                      backgroundColor: status.color,
                    }}
                  >
                    <Text size={10} color={colors.white} type="bold">
                      {status.label}
                    </Text>
                  </View>
                </View>

                <Space height={12} />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size={12} color={colors.stone400}>
                    Total
                  </Text>
                  <Text size={14} type="bold" color={colors.black}>
                    Rp {numberToRupiah(item?.total_amount)}
                  </Text>
                </View>

                {item?.total_left_amount > 0 && (
                  <>
                    <Space height={4} />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text size={12} color={colors.stone400}>
                        Sisa Tagihan
                      </Text>
                      <Text size={12} color={colors.red}>
                        Rp {numberToRupiah(item?.total_left_amount)}
                      </Text>
                    </View>
                  </>
                )}

                <Space height={4} />
                <Text size={11} color={colors.stone400}>
                  {item?.created_at
                    ? formatDate(item.created_at, "DD MMMM YYYY, HH:mm")
                    : "-"}
                </Text>

                {Array.isArray(item?.payments) && item.payments.length > 0 && (
                  <>
                    <Space height={12} />
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: colors.stone100,
                        paddingTop: 10,
                      }}
                    >
                      <Text size={11} type="bold" color={colors.stone400}>
                        Riwayat Percobaan Bayar ({item.payments.length})
                      </Text>
                      {item.payments.map((payment: any, idx: number) => {
                        const pStatus = PAYMENT_STATUS[payment?.status] || {
                          label: "-",
                          color: colors.stone400,
                        };
                        return (
                          <View
                            key={idx}
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 6,
                            }}
                          >
                            <Text size={11} color={colors.black}>
                              {payment?.response_method ||
                                payment?.request_method ||
                                "-"}{" "}
                              &middot; Rp {numberToRupiah(payment?.total)}
                            </Text>
                            <Text size={11} color={pStatus.color}>
                              {pStatus.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

export default PaymentHistoryScreen;
