export interface PaymentStatusType {
  administration_payment_type: string | number;
  administration_payment_type_label: string;
  is_administration_payment_completed: boolean;
  training_payment_type: string | number;
  training_payment_type_label: string;
  training_payment_due_date: string;
  is_training_payment_completed: boolean;
}