import { View, TouchableOpacity, TextInput, Image, StyleSheet, Linking, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from "react";
import Card from "components/Card";
import images from "configs/images";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { usePayment } from 'hooks/usePayment';
import Button from "components/Button";
import fonts from "configs/fonts";
import Text from "components/Text";
import { t } from "i18next";
import { numberToRupiah } from "utils/Utils";
import colors from "configs/colors";
import { Payment } from 'types/PaymentTypes';
import Toast from 'react-native-root-toast';
import { Method } from 'axios';
import CardPaymentPaid from "components/CardPaymentPaid";
import DeviceInfo from 'react-native-device-info';
import QRCode from 'react-native-qrcode-svg';

// import { Dimensions } from 'react-native';
//import TextInput from "components/TextInput";

interface Props {
  amount?: number | null;
}

type PaymentMethod = 'VIRTUAL_ACCOUNT' | 'CARD' | 'EWALLET' | 'QRIS' | null;

type PaymentMethods = {
  [key: string]: {
    enabled: boolean;
    [key: string]: any;
  };
}

type PaymentForm = {
  price_type: number,
  method: Method,
  provider?: string | null
}

type FormData = {
  bank?: string | null;
  cardNumber?: string | null;
  cvc?: string | null;
  expiry_month?: string | null;
  expiry_year?: string | null;
  provider?: string | null;
  name?: string | null;
  country?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  pin?: string | null;
};

interface CardData {
  payment_id: string;
  card: {
    cvc: string;
    number: string;
    nameOnCard: string;
    expiryMonth: string;
    expiryYear: string;
  },
  deviceInformations: {
    type?: string | null;
    userAgent?: string | null;
    ipAddress: string;
    acceptLanguage?: string | null;
    cookieToken?: string | null;
    deviceId?: string | null;
    browserWidth?: number | null;
    browserHeight?: number | null;
    country?: string | null;
  }
}

const PaymentScreen = ({ amount = null }: Props) => {
  const { getPaymentMethods, transaction, getLatestPayment, payTransaction, getLatestTransaction, confirmPayment } = usePayment();
  const [webViewHeight, setWebViewHeight] = useState<number>(400);
  const [methods, setMethods] = useState<PaymentMethods>({});
  const [method, setMethod] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [qrRatio, setQrRatio] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [canCreatePayment, setCanCreatePayment] = useState(false);
  const [isPaymentError, setIsPaymentError] = useState(false);
  const [isOngoingPayment, setIsOngoingPayment] = useState(false);
  const [isInstallmentTime, setIsInstallmentTime] = useState(false);

  const webviewRef = useRef<WebView>(null);

  const handleFormChange = (new_method: PaymentMethod, field: keyof FormData, value: string) => {
    if (new_method !== method) {
      resetForm();
    }
    setMethod(new_method);
    setFormData(prev=>({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      bank: null,
      cardNumber: null,
      expiry_month: null,
      expiry_year: null,
      cvc: null,
      provider: null,
      pin: null
    });
  }

  const getQrAspectRatio = (url: string) => {
    Image.getSize(url, (width, height) => {
      setQrRatio(width / height)
    });
  }

  const toastConfig = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true
  };

  const handleSubmit = async () => {
    if (!method) { return; }
    let error = null;
    let payload = {
      method: method,
      price_type: transaction.price_type
    } as PaymentForm;

    switch (method) {
      case 'VIRTUAL_ACCOUNT':
        if (!formData.bank) { 
          error = 'Select a bank of your choice';
        }
        payload.provider = formData.bank;
        break;
      case 'EWALLET':
        if (!formData.provider) { 
          error = 'Select e-wallet provider of your choice';
        }
        payload.provider = formData.provider;
        break;
    }

    if (error) {
      Toast.show(error, toastConfig);
    }

    //send api
    setIsLoading(true);
    let payment = await payTransaction(payload);
    setIsLoading(false);

    if (payment.status === 'success') {
      setPayment(payment.data);
    } else {
      Toast.show('Error during processing, please contact the administrator', toastConfig);
      return;
    }
  };

  const encryptAndConfirm = async () => {
    //can't progress without encryption key
    if (!payment?.response_key) { return; }

    //validate data
    let error:string|null = null;

    //null validation
    if (!formData.expiry_month || !formData.expiry_year || !formData.cardNumber || !formData.name || !formData.cvc) { error = 'Mohon isi semua kolom data kartu kredit'; }

    //type validation
    if (!/^\d{13,19}$/.test(formData.cardNumber!)) { error = t("card_validation_number"); }
    if (!/^[A-Za-z ]{2,}$/.test(formData.name!)) { error = t("card_validation_name"); }
    if (!/^\d{3}$/.test(formData.cvc!)) { error = t("card_validation_cvc"); }
    if (!/^(0?[1-9]|1[0-2])$/.test(formData.expiry_month!)) { error = t("card_validation_expiry_month"); }
    if (!/^\d{1,2}$/.test(formData.expiry_year!)) { error = t("card_validation_expiry_year"); }

    //expiry validation
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const expYear = parseInt(formData.expiry_year! + 2000, 10);
    const expMonth = parseInt(formData.expiry_month!, 10);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      error = t("card_validation_expiry");
    }

    if (error) {
      Toast.show(error, toastConfig);
      return;
    }

    //setting up payload
    const ipAddress = await DeviceInfo.getIpAddress();
    // const userAgent = await DeviceInfo.getUserAgent();
    // const deviceId = await DeviceInfo.getUniqueId();
    // const country = await DeviceInfo.getCarrier();
    // const { width, height } = Dimensions.get('window');

    const encrypt_data:CardData = {
      payment_id: payment?.number_ref!,
      card: {
        cvc: formData.cvc!,
        number: formData.cardNumber!,
        nameOnCard: formData.name!,
        expiryMonth: formData.expiry_month!,
        expiryYear: formData.expiry_year!
      },
      deviceInformations: {
        // type: "MOBILE",
        // userAgent: userAgent,
        ipAddress: ipAddress,
        // acceptLanguage: null,
        // cookieToken: null,
        // deviceId: deviceId,
        // browserWidth: width,
        // browserHeight: height,
        // country: country
      }
    };

    setIsLoading(true);
    const response = await confirmPayment(encrypt_data);
    if(response.status === 'success') {
      setPayment(response.data);
    }
    setIsLoading(false);
  }

  const checkStatus = async () => {
    //get latest payment
    setIsLoading(true);
    let data = await getLatestPayment({ price_type: transaction.price_type });
    getLatestTransaction({ price_type: transaction.price_type });
    setPayment(data.data);
    setIsLoading(false);
  }

  const getBankName = (channel: string | undefined):string => {
    if (channel == undefined) { return ''; }
    let result = 'Bank ' + channel;
    switch(channel) {
      case 'SMBC': result = 'Bank SMBC (Sumitomo Mitsui Banking Corporation)'; break;
      case 'BCA': result = 'Bank BCA (Bank Central Asia)'; break;
      case 'BSI': result = 'Bank BSI (Bank Syariah Indonesia)'; break;
      case 'BNC': result = 'Bank BNC (Bank Neo Commerce)'; break;
      case 'BNI': result = 'Bank BNI (Bank Negara Indonesia)'; break;
      case 'CIMB': result = 'Bank CIMB Niaga'; break;
      case 'BRI': result = 'Bank BRI (Bank Rakyat Indonesia)'; break;
    }
    return result;
  };

  const fetchMethods = async () => {
    const data = await getPaymentMethods();
    if (data.status === "success" && data.data) {
      setMethods(data.data);
    } else {
      console.error("Failed to fetch methods:", data.message);
    }
  };

  const openUrl = (url: string | null) => {
    if (!url) { return; }
    Linking.openURL(url).catch(err => 
      Toast.show("Failed to open URL:", toastConfig)
    );
  }

  const initPage = async () => {
    //make sure transaction exists
    if (!transaction || Object.keys(transaction).length <= 0) { return; }

    //get latest payment
    setIsLoading(true);
    let data = await getLatestPayment({ price_type: transaction.price_type });
    setPayment(data.data);

    //fetch payment methods
    await fetchMethods();

    setIsLoading(false);
  }

  const isNextInstallment = ():boolean => {
    return true;
  }

  const injectResizeScript = `
    (function() {
      function sendHeight() {
        var height = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(height);
      }
      window.addEventListener("load", sendHeight);
      window.addEventListener("resize", sendHeight);
      setTimeout(sendHeight, 1000);
    })();
  `;

  const handleWebviewResize = (event: WebViewMessageEvent) => {
    const newHeight = Number(event.nativeEvent.data);
    if (!isNaN(newHeight) && newHeight > 100) {
      setWebViewHeight(
        Math.min(newHeight, Dimensions.get("window").height - 100)
      );
    }
  };

  useEffect(() => {
    if (payment) {
      setMethod(payment.response_method!);

      //update qr code image aspect ratio
      if (payment.qr_url) {
        getQrAspectRatio(payment.qr_url);
      }

      setIsOngoingPayment(true);
      setCanCreatePayment(false);

      //check existing payment status
      if (payment.status === 3 || payment.status === 4) {
        setIsOngoingPayment(false);
      } else {
        setIsOngoingPayment(true);
      }

      //check if previous payment has error
      if (payment.status === 4) {
        setIsPaymentError(true);
        setCanCreatePayment(true);
        if (isNextInstallment()) {
          setIsInstallmentTime(true);
        } else {
          setIsInstallmentTime(false);
        }
      } else if (payment.status === 3) {
        setCanCreatePayment(false);
        if (isNextInstallment()) {
          setIsInstallmentTime(true);
        } else {
          setIsInstallmentTime(false);
        }
      }
    } else {
      setCanCreatePayment(true);
      setIsInstallmentTime(true);
    }
  }, [payment]);

  useEffect(() => {
    initPage();
  }, []);

  const SelectButton = ({ label, logo, onPress, selected }: { label: string, logo: string, onPress: () => void, selected: boolean }) => (
    <TouchableOpacity onPress={onPress} style={{
      width: "48%",
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: scaledHorizontal(8)
      }}>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={styles.logoImage}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {Object.keys(transaction).length == 0 && (
        <View>
          <Text style={{
            fontSize:14
          }}>{t("pivot_invalid_invoice")}</Text>
        </View>
      )}
      {Object.keys(transaction).length > 0 && (
      <View style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          paddingHorizontal: scaledHorizontal(25),
        }}>
        <Card style={{ 
          width: '100%'
        }}>
          {isLoading && (
          <View>
              <ActivityIndicator
                size="small"
                color={colors.accent}
                style={{ marginVertical: scaledVertical(15) }}
              />
          </View>
          )}
          {(isOngoingPayment || canCreatePayment) && !isLoading && (
          <View>
            <Text style={{
              fontSize:14
            }}>{t("pivot_due_amount")}</Text>
            <Text style={{
              fontSize:24,
              marginBottom:16,
              fontWeight: "700"
            }}>Rp. {payment && payment.status === 1 ? numberToRupiah(payment.total) : amount ? numberToRupiah(amount) : numberToRupiah(transaction?.total_amount)}</Text>
          </View>
          )}
          {canCreatePayment && (
          <View>
            {!isLoading && (
              <Text style={{
                fontSize:14,
                marginBottom:16
              }}>{t("pivot_select_payment_method")}</Text>
            )}
            {isPaymentError && !isLoading && (
              <View style={{
                backgroundColor: '#FFECEC',   // light red background
                borderColor: '#FF4D4F',       // darker red border
                borderWidth: 1,
                borderRadius: 10,             // rounded corners
                paddingVertical: 12,          // top and bottom padding
                paddingHorizontal: 14,
                alignItems: 'center',         // center contents horizontally
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Text style={{
                  fontSize:14
                }}>{t("pivot_failed_past_payment")}</Text>
              </View>
            )}
            {!isLoading && methods.qr && methods.qr.enabled === true && (
            <View>
              <View
                style={{
                  backgroundColor: colors.stone100,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 7,
                  marginBottom:16,
                  marginTop:8
                }}
              >
                <Text
                  size={12}
                  color={colors.black}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ fontWeight: "400" }}
                >
                  {t("pivot_method_qr")}
                </Text>
              </View>
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                flex: 1,
                marginBottom: 8
              }}>
                <SelectButton label="QRIS" logo={images.logoQris} onPress={() => handleFormChange('QRIS', 'provider', 'QRIS')} selected={method === 'QRIS'} />
              </View>
            </View>
            )}
            {!isLoading && methods.virtualAccount && methods.virtualAccount.enabled === true && (
            <View>
              <View
                style={{
                  backgroundColor: colors.stone100,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 7,
                  marginBottom:16,
                  marginTop:8
                }}
              >
                <Text
                  size={12}
                  color={colors.black}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ fontWeight: "400" }}
                >
                  {t("pivot_method_va")}
                </Text>
              </View>
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                flex: 1,
                marginBottom: 8
              }}>
              {methods.virtualAccount.acceptedChannels.includes("SMBC") && (
                <SelectButton label="Virtual Account" logo={images.logoSmbc} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'SMBC')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'SMBC'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("BCA") && (
                <SelectButton label="Virtual Account" logo={images.logoBca} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'BCA')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'BCA'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("BSI") && (
                <SelectButton label="Virtual Account" logo={images.logoBsi} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'BSI')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'BSI'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("BNC") && (
                <SelectButton label="Virtual Account" logo={images.logoBnc} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'BNC')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'BNC'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("BNI") && (
                <SelectButton label="Virtual Account" logo={images.logoBni} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'BNI')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'BNI'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("CIMB") && (
                <SelectButton label="Virtual Account" logo={images.logoCimb} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'CIMB')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'CIMB'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("MANDIRI") && (
                <SelectButton label="Virtual Account" logo={images.logoMandiri} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'MANDIRI')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'MANDIRI'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("PERMATA") && (
                <SelectButton label="Virtual Account" logo={images.logoPermata} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'PERMATA')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'PERMATA'} />
              )}
              {methods.virtualAccount.acceptedChannels.includes("BRI") && (
                <SelectButton label="Virtual Account" logo={images.logoBri} onPress={() => handleFormChange('VIRTUAL_ACCOUNT', 'bank', 'BRI')} selected={method === 'VIRTUAL_ACCOUNT' && formData.bank === 'BRI'} />
              )}
              </View>
            </View>
            )}
            {!isLoading && methods.ewallet && methods.ewallet.enabled === true && (
            <View>
              <View
                style={{
                  backgroundColor: colors.stone100,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 7,
                  marginBottom:16,
                  marginTop:8
                }}
              >
                <Text
                  size={12}
                  color={colors.black}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ fontWeight: "400" }}
                >
                  {t("pivot_method_ewallet")}
                </Text>
              </View>
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                flex: 1,
                marginBottom: 8
              }}>
              {methods.ewallet.acceptedChannels.includes("DANA") && (
                <SelectButton label="E-Wallet" logo={images.logoDana} onPress={() => handleFormChange('EWALLET', 'provider', 'DANA')} selected={method === 'EWALLET' && formData.provider === 'DANA'} />
              )}
              {methods.ewallet.acceptedChannels.includes("OVO") && (
                <SelectButton label="E-Wallet" logo={images.logoOvo} onPress={() => handleFormChange('EWALLET', 'provider', 'OVO')} selected={method === 'EWALLET' && formData.provider === 'OVO'} />
              )}
              {methods.ewallet.acceptedChannels.includes("SHOPEEPAY") && (
                <SelectButton label="E-Wallet" logo={images.logoShopeepay} onPress={() => handleFormChange('EWALLET', 'provider', 'SHOPEEPAY')} selected={method === 'EWALLET' && formData.provider === 'SHOPEEPAY'} />
              )}
              </View>
            </View>
            )}
            {!isLoading && methods.card && methods.card.enabled === true && (
            <View>
              <View
                style={{
                  backgroundColor: colors.stone100,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 7,
                  marginBottom:16,
                  marginTop:8
                }}
              >
                <Text
                  size={12}
                  color={colors.black}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ fontWeight: "400" }}
                >
                  {t("pivot_method_card")}
                </Text>
              </View>
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                flex: 1,
                marginBottom: 8
              }}>
              {methods.card.acceptedChannels.includes("VISA") && ( 
                <SelectButton label="Credit Card" logo={images.logoVisa} onPress={() => handleFormChange('CARD', 'provider', 'VISA')} selected={method === 'CARD' && formData.provider === 'VISA'} />
              )}
              {methods.card.acceptedChannels.includes("MASTERCARD") && ( 
                <SelectButton label="Credit Card" logo={images.logoMastercard} onPress={() => handleFormChange('CARD', 'provider', 'MASTERCARD')} selected={method === 'CARD' && formData.provider === 'MASTERCARD'} />
              )}
              {methods.card.acceptedChannels.includes("JCB") && ( 
                <SelectButton label="Credit Card" logo={images.logoJcb} onPress={() => handleFormChange('CARD', 'provider', 'JCB')} selected={method === 'CARD' && formData.provider === 'JCB'} />
              )}
              </View>
            </View>
            )}
              {!isLoading && (
              <Button 
                style={{ 
                  paddingVertical: scaledVertical(25),
                  marginTop: 32
                }} 
                title="Pilih" 
                textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
                disabled={!method}
                onPress={() => {handleSubmit()}} />
              )}
            </View>
          )}
          {isOngoingPayment && !isLoading && (
            <View>
              {/* VIRTUAL ACCOUNT DETAILS */}
              {method === 'VIRTUAL_ACCOUNT' && (
              <View>
                <Text style={{
                  fontSize:14,
                  marginBottom:16
                }}>{t("pivot_method_va_description")}</Text>
                <View>
                  <View style={{
                    flex:1,
                    flexDirection:"row",
                    marginBottom:16
                  }}>
                    <Text style={{
                      fontSize:14,
                      flexBasis:80,
                    }}>{t("pivot_method_va_form_bank")}</Text>
                    <View>
                      <Text style={{
                        fontSize:14,
                        fontWeight:"700"
                      }}>{getBankName(payment?.va_channel)}</Text>
                    </View>
                  </View>
                  <View style={{
                    flex:1,
                    flexDirection:"row",
                    marginBottom:16
                  }}>
                    <Text style={{
                      fontSize:14,
                      flexBasis:80
                    }}>{t("pivot_method_va_form_number")}</Text>
                    <View>
                      <Text style={{
                        fontSize:14,
                        fontWeight:"700"
                      }}>{payment?.va_number}</Text>
                    </View>
                  </View>
                  <View style={{
                    flex:1,
                    flexDirection:"row",
                    marginBottom:16
                  }}>
                    <Text style={{
                      fontSize:14,
                      flexBasis:80
                    }}>{t("pivot_method_va_form_name")}</Text>
                    <View>
                      <Text style={{
                        fontSize:14,
                        fontWeight:"700"
                      }}>{payment?.va_name}</Text>
                    </View>
                  </View>
                </View>
              </View>
              )}
              {/* CREDIT CARD DETAILS */}
              {method === 'CARD' && (
              <View>
                { !payment?.response_url && (
                <View>
                  <Text style={{
                    fontSize:14,
                    marginBottom:16
                  }}>{t("pivot_method_card_description")}</Text>
                  <View>
                    <View style={styles.formInput}>
                      <TextInput placeholderTextColor={colors.grey500} style={styles.formInputColor} placeholder={t("pivot_method_card_form_name")} onChangeText={(text) => handleFormChange('CARD', 'name', text)} />
                    </View>
                    <View style={styles.formInput}>
                      <TextInput placeholderTextColor={colors.grey500} style={styles.formInputColor} placeholder={t("pivot_method_card_form_number")} onChangeText={(text) => handleFormChange('CARD', 'cardNumber', text)} />
                    </View>
                    <View style={{
                      flex: 1,
                      flexDirection:"row",
                      gap: 8
                    }}>
                      <View style={[styles.formInput, styles.formInputOneThird]}>
                        <TextInput placeholderTextColor={colors.grey500} style={styles.formInputColor} inputMode='numeric' maxLength={12} placeholder="MM" onChangeText={(text) => handleFormChange('CARD', 'expiry_month', text)} />
                      </View>
                      <View style={[styles.formInput, styles.formInputOneThird]}>
                        <TextInput placeholderTextColor={colors.grey500} style={styles.formInputColor} inputMode='numeric' maxLength={99} placeholder="YY" onChangeText={(text) => handleFormChange('CARD', 'expiry_year', text)} />
                      </View>
                      <View style={[styles.formInput, styles.formInputOneThird]}>
                        <TextInput placeholderTextColor={colors.grey500} style={styles.formInputColor} placeholder="CVC" secureTextEntry onChangeText={(text) => handleFormChange('CARD', 'cvc', text)} />
                      </View>
                    </View>
                  </View>
                </View>
                )}
                { payment && payment.response_url && payment.response_url && payment.charge_status && !['FAILED', 'EXPIRED', 'SUCCESS'].includes(payment.charge_status) && (
                <View style={{
                  height: webViewHeight + 40
                }}>
                  <WebView
                    ref={webviewRef}
                    androidLayerType="software"
                    androidHardwareAccelerationDisabled={true}
                    // onLoad={() => setIsLoading(false)}
                    onMessage={handleWebviewResize}
                    injectedJavaScript={injectResizeScript}
                    source={{ uri: payment.response_url }}
                    onNavigationStateChange={(navState:WebViewNavigation) => {
                      if (navState.url.includes(payment?.response_redirect_success!)) {
                        checkStatus();
                      } else if (navState.url.includes(payment?.response_redirect_failed!)) {
                        checkStatus();
                      } else if (navState.url.includes(payment?.response_redirect_expired!)) {
                        checkStatus();
                      }
                    }}
                    style={{ flex: 1 }}
                    originWhitelist={[
                      "http://",
                      "https://",
                      "intent://",
                      "itms-appss://",
                    ]}
                  />
                </View>
                )}
              </View>
              )}
              {/* E-WALLET DETAILS */}
              {method === 'EWALLET' && (
              <Text style={{
                fontSize:14,
                marginBottom:16
              }}>{t("pivot_method_ewallet_description")}</Text>
              )}
              {/* QRIS DETAILS */}
              {method === 'QR' && (
              <View>
                <Text style={{
                  fontSize:14,
                  marginBottom:16
                }}>{t("pivot_method_qr_description")}</Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <QRCode
                    value={payment?.qr_content}
                    size={240}
                  />
                </View>
                {/* <View style={{
                    width: "100%",
                    backgroundColor: "#eee",
                  }}>
                  <Image
                    source={{ uri: payment?.qr_url }}
                    style={[styles.qrImage, { aspectRatio: qrRatio }]}
                    resizeMode="contain"
                  />
                </View> */}
              </View>
              )}

              {/* DISCLAIMERS/NOTES */}
              {/* {method === 'CARD' && (
              <Text style={{
                fontSize:12,
                marginBottom:16,
                fontStyle:"italic"
              }}>Biaya tambahan mungkin akan dikenakan oleh penyedia kartu kredit anda*</Text>
              )}
              {method === 'VIRTUAL_ACCOUNT' && (
              <Text style={{
                fontSize:12,
                marginBottom:16,
                fontStyle:"italic"
              }}>Biaya transfer mungkin akan dikenakan apabila anda transfer dari bank lain*</Text>
              )} */}

              {/* BUTTONS */}
              <View style={{
                flex:1,
                flexDirection:"column",
                gap:8,
                marginTop: 32
              }}>
                {method === 'CARD' && payment?.response_key && !payment?.response_url && (
                <Button 
                  style={{ paddingVertical: scaledVertical(25) }} 
                  title={t("pivot_button_pay")}
                  textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
                  onPress={() => {encryptAndConfirm()}} />
                )}
                {(method !== 'CARD' || (method === 'CARD' && payment?.response_url)) && (
                <Button 
                  style={{ paddingVertical: scaledVertical(25) }} 
                  title={t("pivot_button_status")}
                  textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
                  onPress={() => {checkStatus()}} />
                )}
                {payment && payment.simulation && (
                <Button 
                  style={{ paddingVertical: scaledVertical(25) }} 
                  title={t("pivot_button_simulation")}
                  textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
                  onPress={() => {openUrl(payment.simulation ?? null)}} />
                )}
              </View>
            </View>
          )}
          {transaction.total_left_amount == 0 && !isLoading && (
            <View>
              <CardPaymentPaid
                type={
                  transaction?.price_type === 2 ? "Pelatihan" : "Administrasi"
                }
              />
            </View>
          )}

          {/* <View>
            <Text style={{fontSize:12}}>method: {method}</Text>
            <Text style={{fontSize:12}}>create payment: {JSON.stringify(canCreatePayment, null, 2)}</Text>
            <Text style={{fontSize:12}}>installment time: {JSON.stringify(isInstallmentTime, null, 2)}</Text>
            <Text style={{fontSize:12}}>ongoing payment: {JSON.stringify(isOngoingPayment, null, 2)}</Text>
            <Text style={{fontSize:12}}>payment error: {JSON.stringify(isPaymentError, null, 2)}</Text>
            <Text style={{fontSize:12}}>payment: {JSON.stringify(payment, null, 2)}</Text>
          </View> */}
        </Card>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formInput: {
    borderWidth: 1,
    borderColor: colors.grey500, 
    borderRadius: 4,
    paddingHorizontal: scaledHorizontal(8),
    marginBottom: 8
  },
  formInputColor: {
    color: '#333333'
  },
  formInputOneThird: {
    width:"31.7%"
  },
  logoContainer: {
    height: 30, // or whatever fixed height you want
    width: 100, // or any max width you prefer
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoText: {
    textAlign: "center"
  },
  selectButton: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    width: 100,
  },
  selectedButton: {
    borderColor: 'blue',
    backgroundColor: '#eef',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: 'blue',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'blue',
  },
  qrImage: {
    width: "100%",
    height: undefined,
  }
});

export default PaymentScreen;
