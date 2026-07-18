export interface PaymentStatusType {
  administration_payment_type: string | number;
  administration_payment_type_label: string;
  administration_payment_xendit_link?: string | null;
  administration_payment_xendit_status?: string | null;
  administration_payment_due_date?: string | null;
  is_administration_payment_completed: boolean;
  training_payment_type: string | number;
  training_payment_type_label: string;
  training_payment_xendit_link?: string | null;
  training_payment_xendit_status?: string | null;
  training_payment_due_date?: string | null;
  is_training_payment_completed: boolean;
}
