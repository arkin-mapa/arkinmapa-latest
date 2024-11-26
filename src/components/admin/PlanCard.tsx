import React, { useState } from 'react';
import { Trash2, Upload, Wifi, Users, Clock } from 'lucide-react';
import { Plan } from '../../types';
import { useStore } from '../../store';
import { FileUploader } from '../FileUploader';

interface Props {
  plan: Plan;
}

export function PlanCard({ plan }: Props) {
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const deletePlan = useStore((state) => state.deletePlan);
  const addVoucher = useStore((state) => state.addVoucher);
  const getAvailableVouchers = useStore((state) => state.getAvailableVouchers);

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVoucherCode.trim()) {
      addVoucher(plan.id, newVoucherCode.trim());
      setNewVoucherCode('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
          <p className="text-emerald-600 font-bold">₱{plan.price}</p>
        </div>
        <button
          onClick={() => deletePlan(plan.id)}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {plan.duration}h
        </span>
        <span className="flex items-center gap-1">
          <Wifi className="h-4 w-4" />
          {plan.bandwidth === 'unlimited' ? '∞' : `${plan.bandwidth}M`}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {plan.deviceLimit}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Available Vouchers</span>
            <span className="font-medium">{getAvailableVouchers(plan.id)}</span>
          </div>
          <form onSubmit={handleAddVoucher} className="flex gap-2">
            <input
              type="text"
              value={newVoucherCode}
              onChange={(e) => setNewVoucherCode(e.target.value)}
              placeholder="Enter voucher code"
              className="flex-1 px-3 py-1.5 text-sm border rounded-md focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700"
            >
              Add
            </button>
          </form>
        </div>

        <FileUploader
          planId={plan.id}
          onVouchersExtracted={(vouchers) => {
            vouchers.forEach(code => addVoucher(plan.id, code));
          }}
        />
      </div>
    </div>
  );
}