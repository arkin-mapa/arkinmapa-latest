import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Plan, Voucher, PurchaseRequest, PaymentInstructions } from '../types';

interface StoreState {
  plans: Plan[];
  vouchers: Voucher[];
  purchaseRequests: PurchaseRequest[];
  paymentInstructions: PaymentInstructions;
  loading: boolean;
  
  fetchPlans: () => Promise<void>;
  fetchVouchers: () => Promise<void>;
  fetchPurchaseRequests: () => Promise<void>;
  
  addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  addVoucher: (planId: string, code: string) => Promise<void>;
  deleteVoucher: (id: string) => Promise<void>;
  getAvailableVouchers: (planId: string) => number;
  createPurchaseRequest: (request: Omit<PurchaseRequest, 'id' | 'status' | 'timestamp'>) => Promise<void>;
  updatePurchaseStatus: (id: string, status: 'confirmed' | 'rejected') => Promise<void>;
  deletePurchaseRequest: (id: string) => Promise<void>;
  updatePaymentInstructions: (instructions: PaymentInstructions) => void;
  getClientVouchers: (userId: string) => Promise<Voucher[]>;
  deleteClientVoucher: (id: string) => Promise<void>;
  transferVoucher: (voucherId: string, recipientEmail: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  plans: [],
  vouchers: [],
  purchaseRequests: [],
  loading: false,
  paymentInstructions: {
    gcash: {
      number: '09123456789',
      name: 'John Doe'
    },
    bankTransfer: {
      accountNumber: '1234 5678 9012',
      bankName: 'BDO',
      accountName: 'John Doe'
    }
  },

  fetchPlans: async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ plans: data });
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans');
    }
  },

  fetchVouchers: async () => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ vouchers: data });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to fetch vouchers');
    }
  },

  fetchPurchaseRequests: async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ purchaseRequests: data });
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      toast.error('Failed to fetch purchase requests');
    }
  },

  addPlan: async (plan) => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .insert([plan])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ plans: [data, ...state.plans] }));
      toast.success('Plan created successfully');
    } catch (error) {
      console.error('Error adding plan:', error);
      toast.error('Failed to create plan');
    }
  },

  deletePlan: async (id) => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        plans: state.plans.filter((p) => p.id !== id)
      }));
      toast.success('Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  },

  addVoucher: async (planId, code) => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .insert([{ plan_id: planId, code }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ vouchers: [data, ...state.vouchers] }));
      toast.success('Voucher added successfully');
    } catch (error) {
      console.error('Error adding voucher:', error);
      toast.error('Failed to add voucher');
    }
  },

  deleteVoucher: async (id) => {
    try {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        vouchers: state.vouchers.filter((v) => v.id !== id)
      }));
      toast.success('Voucher deleted successfully');
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('Failed to delete voucher');
    }
  },

  getAvailableVouchers: (planId) => {
    return get().vouchers.filter(
      (v) => v.planId === planId && v.status === 'available'
    ).length;
  },

  createPurchaseRequest: async (request) => {
    try {
      const { data, error } = await supabase
        .from('purchase_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        purchaseRequests: [data, ...state.purchaseRequests]
      }));
      toast.success('Purchase request submitted');
    } catch (error) {
      console.error('Error creating purchase request:', error);
      toast.error('Failed to submit purchase request');
    }
  },

  updatePurchaseStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('purchase_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      if (status === 'confirmed') {
        const request = get().purchaseRequests.find(r => r.id === id);
        if (!request) return;

        const availableVouchers = get().vouchers.filter(
          v => v.planId === request.planId && v.status === 'available'
        ).slice(0, request.quantity);

        if (availableVouchers.length < request.quantity) {
          toast.error('Not enough vouchers available');
          return;
        }

        // Update vouchers status and assign to user
        const { error: voucherError } = await supabase
          .from('vouchers')
          .update({ 
            status: 'used',
            user_id: request.userId 
          })
          .in('id', availableVouchers.map(v => v.id));

        if (voucherError) throw voucherError;
      }

      set((state) => ({
        purchaseRequests: state.purchaseRequests.map(r =>
          r.id === id ? { ...r, status } : r
        )
      }));
      
      toast.success(`Purchase request ${status}`);
    } catch (error) {
      console.error('Error updating purchase request:', error);
      toast.error('Failed to update purchase request');
    }
  },

  deletePurchaseRequest: async (id) => {
    try {
      const { error } = await supabase
        .from('purchase_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        purchaseRequests: state.purchaseRequests.filter((r) => r.id !== id)
      }));
      toast.success('Purchase request deleted');
    } catch (error) {
      console.error('Error deleting purchase request:', error);
      toast.error('Failed to delete purchase request');
    }
  },

  updatePaymentInstructions: (instructions) => {
    set({ paymentInstructions: instructions });
    toast.success('Payment instructions updated');
  },

  getClientVouchers: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'used');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client vouchers:', error);
      toast.error('Failed to fetch vouchers');
      return [];
    }
  },

  deleteClientVoucher: async (id) => {
    try {
      const { error } = await supabase
        .from('vouchers')
        .update({ user_id: null, status: 'available' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Voucher removed from wallet');
    } catch (error) {
      console.error('Error removing voucher:', error);
      toast.error('Failed to remove voucher');
    }
  },

  transferVoucher: async (voucherId, recipientEmail) => {
    try {
      // Get recipient user ID
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', recipientEmail)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('Recipient not found');

      // Transfer voucher
      const { error } = await supabase
        .from('vouchers')
        .update({ user_id: userData.id })
        .eq('id', voucherId);

      if (error) throw error;
      toast.success('Voucher transferred successfully');
    } catch (error) {
      console.error('Error transferring voucher:', error);
      toast.error('Failed to transfer voucher');
    }
  }
}));