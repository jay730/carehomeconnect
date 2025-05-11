
export type BankDetails = {
  id: string;
  user_id: string;
  account_name: string;
  account_number: string;
  routing_number: string;
  bank_name: string;
  use_for_both: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};
