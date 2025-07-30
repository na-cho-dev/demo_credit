export enum TRANSACTION_TYPE {
  FUND = "FUND",
  TRANSFER = "TRANSFER",
  WITHDRAW = "WITHDRAW",
}

export enum TRANSACTION_STATUS {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum TRANSACTION_METHOD {
  MANUAL_FUND = "manual-fund",
  MANUAL_WITHDRAWAL = "manual-withdrawal",
  MANUAL_TRANSFER = "manual-transfer",
  // REVERSAL = "reversal",
  // ADJUSTMENT = "adjustment",
}

export interface TransactionMetadata {
  method: TRANSACTION_METHOD;
  error?: string;
  description?: string;
  initiatedBy?: string;
  ipAddress?: string;
  device?: string;
  externalReference?: string;
  notes?: string;
}

export interface AuditMetadata {
  initiatedBy?: string;
  ipAddress?: string;
  device?: string;
}

export interface TransactionDto {
  wallet_id: string;
  sender_id?: string | null;
  receiver_id?: string | null;
  type: TRANSACTION_TYPE;
  amount: number;
  reference: string;
  status: TRANSACTION_STATUS;
  balance_before: number;
  balance_after: number;
  metadata?: TransactionMetadata;
}

export interface FundWalletDto {
  amount: number;
}

export interface TransferToWalletDto {
  receiverUserId?: string;
  receiverEmail?: string;
  amount: number;
}

export interface WithdrawFromWalletDto extends FundWalletDto {}
