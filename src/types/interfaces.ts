export interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  bandwidth: 'unlimited' | number;
  deviceLimit: number;
  description: string;
}

export interface Voucher {
  id: string;
  code: string;
  planId: string;
  status: 'available' | 'used';
  userId?: string;
}

export interface PurchaseRequest {
  id: string;
  planId: string;
  customerName: string;
  quantity: number;
  paymentMethod: 'gcash' | 'bank-transfer';
  status: 'pending' | 'confirmed' | 'rejected';
  timestamp: Date;
}