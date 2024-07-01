export interface CreateTransactionRequest {
  fromAccountNo: string;
  instructionType: 'Immediate' | 'Standing';
  transferDate?: string;
  transferTime?: string;
  totalRecord: number;
  totalAmount: number;
  transactions: {
    toBankName: string;
    toAccountNo: string;
    toAccountName: string;
    transferAmount: number;
    description: string;
  }[];
}

export interface AuditTransactionRequest {
  action: 'Approve' | 'Reject';
}