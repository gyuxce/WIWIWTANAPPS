import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import React, { useEffect, useState } from "react";
import {
  View,
  Platform,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";
import PaymentTab from "components/PaymentTab";
import icons from "configs/icons";
import Text from "components/Text";
import { usePayment } from "hooks/usePayment";
import { numberToRupiah } from "utils/Utils";
import CardPaymentPaid from "components/CardPaymentPaid";
import Toast from 'react-native-root-toast';
import { t } from "i18next";
import { Payment } from "types/PaymentTypes";
import PaymentScreen from "components/PaymentScreen";
import CardPaymentInstallmentPaid from "components/CardPaymentInstallmentPaid";

const InstallmentPaymentDetailScreen = () => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [dueInstallment, setDueInstallment] = useState<Installment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { paymentStatusType, transaction, getPaymentStatusType } = usePayment();
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dueAmount, setDueAmount] = useState<number | null>(null);
  const [isOverdue, setIsOverdue] = useState<Boolean>(false);

  interface Installment {
    index: number;
    paid_at: string;
    amount: number;
    currency_code: string;
  }

  //old method
  // interface Installment {
  //   index: number;
  //   month: number;
  //   month_string: string;
  //   year: number;
  //   status: "Paid" | "Failed" | "Missed" | "Ongoing" | "Upcoming" | "Due";
  //   amount: number;
  //   currency_code: string;
  // }

  const toastConfig = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true
  };

  const generateInstallments = () => {
    setInstallments([]);
    const monthly = transaction.total_amount / transaction.installment.period_length;
    let result: Installment[];
    result = [];
    let i = 1;

    if (transaction.payments && transaction.payments.length > 0) {
      //filter paid payments
      const paid_payments = transaction.payments.filter((p:Payment) => {
        return p.status === 3;
      });

      paid_payments.forEach((p:Payment) => {
        const paid_at = new Date(p.updated_at);
        const paid_formatted = paid_at.toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24-hour format
        });
        let subresult = {
          index: i,
          paid_at: paid_formatted,
          amount: p.total,
          currency_code: p.currency_code,
        };
        result.push(subresult);
        i ++;
      });
    }

    setDueAmount(i >= transaction.installment.period_length || transaction.total_left_amount < monthly ? transaction.total_left_amount : monthly);

    setInstallments(result);
  }

  // old method
  // const generateInstallments = () => {
  //   setInstallments([]);
  //   const start = new Date(transaction.issued_at);
  //   const now = new Date;
  //   const monthly = transaction.total_amount / transaction.installment.period_length;
  //   let installments_cache: Installment[];
  //   installments_cache = [];
  //   let due = 0;
  //   let is_future = false;

  //   for (let i = 1; i <= transaction.installment.period_length; i++) {
  //     let status: "Paid" | "Failed" | "Missed" | "Ongoing" | "Upcoming" | "Due";
  //     let result: Installment;
  //     let payment = null;
  //     let period_date = new Date(start);
  //     let locale = "id";
  //     let period_date_end = new Date(start);
  //     period_date.setMonth(start.getMonth() + (i - 1));
  //     period_date_end.setMonth(period_date.getMonth() + 1, 0);
  //     period_date.setDate(1);
  //     if (period_date_end > now) { is_future = true; }
  //     let is_now = period_date.getMonth() === now.getMonth() && period_date.getFullYear() === now.getFullYear();
  //     status = is_now ? "Due" : is_future ? "Upcoming" : "Missed";

  //     if (transaction.payments && transaction.payments.length > 0) {
  //       //get all payments this month
  //       const month_payments = transaction.payments.filter((p:Payment) => {
  //         const created_at = new Date(p.created_at);
  //         return created_at.getFullYear() === period_date.getFullYear() && created_at.getMonth() === period_date.getMonth();
  //       });

  //       //get latest payment this month
  //       if (month_payments.length > 0) {
  //         payment = month_payments.sort(
  //           (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //         )[0];
  //       }
  //     }

  //     //reset due
  //     if (payment) {
  //       switch(payment.status) {
  //         case 1: status = "Ongoing"; break;
  //         case 3: status = "Paid"; due = 0; break;
  //         case 4: status = "Failed"; break;
  //       }
  //     }

  //     result = {
  //       index: i,
  //       month: period_date.getMonth(),
  //       month_string: period_date.toLocaleString(locale, { month: "long" }),
  //       year: period_date.getFullYear(),
  //       status: status,
  //       amount: i === transaction.installment.period_length ? transaction.total_left_amount : payment ? payment.total : monthly + due,
  //       currency_code: payment ? payment.currency_code : transaction.currency_code,
  //     };
  //     installments_cache.push(result);

  //     if (!payment && status === "Missed") {
  //       due += monthly;
  //     }
  //     if (status === "Due" || status === "Ongoing") {
  //       setDueInstallment(result);
  //     }
  //     if (payment && is_now) {
  //       setLatestPayment(payment);
  //     }
  //   }

  //   setInstallments(installments_cache);
  // }

  const prepareData = () => {
    //validate
    if (!transaction) { return; }
    // if (!transaction || !transaction.installment) { 
    //   NavigationService.replace("InstallmentPaymentScreen");
    // }

    setIsLoading(true);
    generateInstallments();
    setIsLoading(false);
  };

  useEffect(() => {
    prepareData();
    getPaymentStatusType();
  }, [transaction]);

  useEffect(() => {
    //set due date
    const due = new Date(paymentStatusType?.training_payment_due_date);
    setDueDate(due.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    }));
  }, [paymentStatusType]);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        withBurger
        withTextTitle
        textTitleJapanLeft="支払い"
        textTitleLeft="Pembayaran"
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={prepareData} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Space height={25} />
        <PaymentTab active="training" />
        <Space height={30} />
        <Section textTitle="Biaya Pelatihan" textJapan="手続き費用" />
        <Space height={10} />
        <CardPaymentNominal
          nominal={numberToRupiah(transaction?.total_amount)}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />
        {paymentStatusType?.training_payment_type === 2 && !isLoading && (
          <>
            <CardPaymentNominal
              text={t("sisa_yang_harus_dibayarkan")}
              nominal={numberToRupiah(transaction?.total_left_amount)}
              style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            />
            <Space height={20} />
          </>
        )}
        {transaction?.total_left_amount === 0 && !isLoading && (
          <>
          <CardPaymentPaid />
          <Space height={20} />
          </>
        )}
        
        <View style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Space height={24} />
          <Text
            size={12}
            type={"reguler"}
            variant="CenturyGothicBold"
          >{t("installment_history_intro")}</Text>
          {installments?.map((item: Installment, index: number) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginTop: 3,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Image
                    source={icons.checklistBox}
                    style={{ width: 18, height: 18, resizeMode: "cover" }}
                  />
                  <Text
                    size={12}
                    type={"reguler"}
                    variant="CenturyGothicBold"
                  >
                    #{item.index}: {item.paid_at} {item.currency_code} {numberToRupiah(item.amount)}
                  </Text>
                </View>
              </View>
            );
          })}
          {transaction?.total_left_amount > 0 && (
            <>
            <Space height={24} />
            <Text
              size={12}
              type={"reguler"}
              variant="CenturyGothicBold"
            >{t("installment_due_intro")}</Text>
            <Text
              size={12}
              type={"bold"}
              variant="CenturyGothicBold"
            >
              {dueDate}
            </Text>
            </>
          )}
          {transaction?.total_left_amount > 0 && (
            <>
            <Space height={24} />
            <Text
              size={12}
              type={"reguler"}
              variant="CenturyGothicBold"
            >{t("installment_due_warning")}</Text>
            </>
          )}
        </View>
        
        
        {transaction?.total_left_amount > 0 && latestPayment && latestPayment.status === 3 && !isLoading && (
          <>
          <CardPaymentInstallmentPaid />
          <Space height={20} />
          </>
        )}
        {dueAmount && dueAmount > 0 && (
        <>
        <Space height={20} />
        <View>
          <Space height={30} />
          <PaymentScreen amount={dueAmount} />
        </View>
        </>
        )}
      </ScrollView>
    </View>
  );
};

export default InstallmentPaymentDetailScreen;
