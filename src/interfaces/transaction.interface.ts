export interface CreateTransactionDto {
  wallet_id: string;
  sender_id?: string | null;
  receiver_id?: string | null;
  type: "FUND" | "TRANSFER" | "WITHDRAW";
  amount: number;
  reference: string;
  status: "SUCCESS" | "FAILED";
  metadata?: any;
}

export interface FundWalletDto {
  amount: number;
}

export interface TransferToWalletDto {
  receiverUserId: string;
  amount: number;
}

export interface WithdrawFromWalletDto extends FundWalletDto {}
