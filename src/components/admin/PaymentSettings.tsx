import React, { useState } from 'react';
import { useStore } from '../../store';
import { PaymentInstructions } from '../../types';

export function PaymentSettings() {
  const { paymentInstructions, updatePaymentInstructions } = useStore();
  const [instructions, setInstructions] = useState<PaymentInstructions>(paymentInstructions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentInstructions(instructions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">GCash Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number</label>
            <input
              type="text"
              value={instructions.gcash.number}
              onChange={(e) => setInstructions({
                ...instructions,
                gcash: { ...instructions.gcash, number: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={instructions.gcash.name}
              onChange={(e) => setInstructions({
                ...instructions,
                gcash: { ...instructions.gcash, name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Bank Transfer Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              value={instructions.bankTransfer.bankName}
              onChange={(e) => setInstructions({
                ...instructions,
                bankTransfer: { ...instructions.bankTransfer, bankName: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              value={instructions.bankTransfer.accountNumber}
              onChange={(e) => setInstructions({
                ...instructions,
                bankTransfer: { ...instructions.bankTransfer, accountNumber: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              value={instructions.bankTransfer.accountName}
              onChange={(e) => setInstructions({
                ...instructions,
                bankTransfer: { ...instructions.bankTransfer, accountName: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}