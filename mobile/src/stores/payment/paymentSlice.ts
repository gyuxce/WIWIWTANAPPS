import { createSlice } from "@reduxjs/toolkit";
import { FileType } from "types/ExamTypes";
import { Transaction } from "types/TransactionTypes";
import { Payment } from "types/PaymentTypes";
import { PaymentStatusType } from "types/PaymentStatusTypes";

export type PaymentState = {
  detailPrice: {
    administration: string;
    training: string;
    file_training: FileType;
    file_installment: FileType;
  };
  paymentStatusType: PaymentStatusType;
  paymentContent: any;
  paymentDocStatus: {
    isCompleteTrainingLetterRequirement: boolean;
    isCompleteTrainingInstallmentDocsRequirement: boolean;
  };
  transaction: Transaction;
  paymentLatest: Payment;
  payments: Payment[];
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    detailPrice: { administration: "0", training: "0" },
    paymentStatusType: {
      administration_payment_type: "",
      administration_payment_type_label: "",
      is_administration_payment_completed: false,
      training_payment_type: "",
      training_payment_type_label: "",
      is_training_payment_completed: false,
    },
    paymentContent: {},
    paymentDocStatus: {
      isCompleteTrainingLetterRequirement: false,
      isCompleteTrainingInstallmentDocsRequirement: false,
    },
    transaction: {},
    paymentLatest: {},
    payments: [] as Payment[],
  } as PaymentState,
  reducers: {
    onGetDetailPrice: (
      state,
      action: {
        payload: {
          administration: string;
          training: string;
          file_training: FileType;
          file_installment: FileType;
        };
      },
    ) => {
      state.detailPrice = action.payload;
    },
    onGetStatusPaymentType: (state, action: { payload: PaymentStatusType }) => {
      state.paymentStatusType = action.payload;
    },
    onGetPaymentContent: (state, action: { payload: any }) => {
      state.paymentContent = action.payload;
    },
    onGetPaymentDocStatus: (
      state,
      action: {
        payload: {
          isCompleteTrainingLetterRequirement: boolean;
          isCompleteTrainingInstallmentDocsRequirement: boolean;
        };
      },
    ) => {
      state.paymentDocStatus = action.payload;
    },
    onInitiateTransaction: (
      state,
      action: {
        payload: Transaction;
      }
    ) => {
      state.transaction = action.payload;
    },
    onLatestPayment: (
      state,
      action: {
        payload: Payment;
      }
    ) => {
      state.paymentLatest = action.payload;
    },
  },
});

export const {
  onGetDetailPrice,
  onGetStatusPaymentType,
  onGetPaymentContent,
  onGetPaymentDocStatus,
  onInitiateTransaction,
  onLatestPayment
} = paymentSlice.actions;

export default paymentSlice.reducer;
