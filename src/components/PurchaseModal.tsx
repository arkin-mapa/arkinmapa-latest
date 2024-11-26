import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Plan } from '../types';

interface Props {
  plan: Plan;
  onClose: () => void;
  onSubmit: (data: { 
    name: string;
    paymentMethod: 'gcash' | 'bank-transfer';
    quantity: number;
  }) => void;
}

export function PurchaseModal({ plan, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    paymentMethod: 'gcash' as const,
    quantity: 1
  });

  const updateQuantity = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-3 sm:p-4 relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        
        <h2 className="text-base sm:text-lg font-bold mb-2">Purchase Voucher</h2>
        <div className="mb-3">
          <h3 className="text-xs sm:text-sm font-medium">{plan.name}</h3>
          <p className="text-emerald-600 font-bold text-xs sm:text-sm">₱{plan.price} each</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <label className="block text-[10px] sm:text-xs font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-2 py-1.5 text-xs sm:text-sm border rounded focus:ring-1 focus:ring-emerald-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-medium mb-1">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(-1)}
                className="p-1 rounded border hover:bg-gray-50"
              >
                <Minus size={14} className="sm:w-4 sm:h-4" />
              </button>
              <span className="text-sm sm:text-base font-medium w-6 sm:w-8 text-center">
                {formData.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(1)}
                className="p-1 rounded border hover:bg-gray-50"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-medium mb-1">Payment Method</label>
            <select
              className="w-full px-2 py-1.5 text-xs sm:text-sm border rounded focus:ring-1 focus:ring-emerald-500"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ 
                ...formData, 
                paymentMethod: e.target.value as 'gcash' | 'bank-transfer' 
              })}
            >
              <option value="gcash">GCash</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="pt-2 border-t mt-3">
            <div className="flex justify-between mb-2 text-xs sm:text-sm">
              <span>Total Amount:</span>
              <span className="font-bold">₱{plan.price * formData.quantity}</span>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-1.5 sm:py-2 rounded hover:bg-emerald-700 transition-colors text-xs sm:text-sm font-medium"
            >
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}