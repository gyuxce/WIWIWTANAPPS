import { Payment } from "./PaymentTypes";

export interface Transaction {
  id: string;
  issued_at: string;
  expired_at: string;
  number: string;
  price_type: number;
  currency_code: string;
  total_amount: number;
  total_left_amount: number;
  status: number;
  installment?: any;
  payments?: Payment[];
  payment_proofs?: any[];
}