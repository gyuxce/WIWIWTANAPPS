import Text from "components/Text";
import colors from "configs/colors";
import { usePayment } from "hooks/usePayment";
import { t } from "i18next";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";

interface Props {
  active?: "admin" | "training";
}

const PaymentTab = ({ active = "admin" }: Props) => {
  const { paymentStatusType } = usePayment();

  const handleClickAdm = () => {
    NavigationService.replace("PaymentAdministration");
  };

  const handleClickTraining = () => {
    NavigationService.replace("InstallmentPaymentScreen");
    // if (!paymentStatusType?.training_payment_type) {
    //   NavigationService.replace("InstallmentPaymentScreen");
    // } else {
    //   if (
    //     paymentStatusType?.training_payment_type === 1 &&
    //     !paymentStatusType?.training_payment_xendit_status
    //   ) {
    //     NavigationService.replace("InstallmentPaymentScreen");
    //   }
    //   if (
    //     paymentStatusType?.training_payment_type === 1 &&
    //     paymentStatusType?.training_payment_xendit_status === "Lunas"
    //   ) {
    //     NavigationService.replace("FullPaymentDetailScreen", {
    //       price_type: 2,
    //     });
    //   }
    //   if (paymentStatusType?.training_payment_type === 2) {
    //     NavigationService.replace("InstallmentPaymentDetailScreen");
    //   }
    // }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginHorizontal: scaledHorizontal(25),
      }}
    >
      <TouchableOpacity
        onPress={() => (active === "training" ? handleClickAdm() : null)}
        style={{
          flex: 1,
          borderColor: colors.black,
          borderWidth: active === "admin" ? 0.5 : 0,
          backgroundColor: active === "admin" ? colors.white : colors.stone100,
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Text
          variant="CenturyGothicBold"
          type="bold"
          size={10}
          textAlign="center"
        >
          {t("biaya_administrasi")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => (active === "admin" ? handleClickTraining() : null)}
        style={{
          flex: 1,
          borderColor: colors.black,
          borderWidth: active === "training" ? 0.5 : 0,
          backgroundColor:
            active === "training" ? colors.white : colors.stone100,
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Text
          variant="CenturyGothicBold"
          type="bold"
          size={10}
          textAlign="center"
        >
          {t("biaya_pelatihan")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentTab;
