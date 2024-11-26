import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { VoucherPlan } from '../types';
import { useStore } from '../store';

interface VoucherCardProps {
  plan: VoucherPlan;
}

export function VoucherCard({ plan }: VoucherCardProps) {
  const user = useStore((state) => state.user);
  const createPurchaseRequest = useStore((state) => state.createPurchaseRequest);

  const handlePurchase = () => {
    if (user) {
      createPurchaseRequest(user.id, plan.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
      <div className="flex items-center space-x-2 text-gray-600 mb-2">
        <Clock className="h-5 w-5" />
        <span>{plan.duration} days</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-600 mb-4">
        <DollarSign className="h-5 w-5" />
        <span>${plan.price}</span>
      </div>
      <p className="text-gray-600 mb-6">{plan.description}</p>
      <button
        onClick={handlePurchase}
        className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Purchase
      </button>
    </div>
  );
}