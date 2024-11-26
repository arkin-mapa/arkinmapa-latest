import React from 'react';
import { Trash2 } from 'lucide-react';
import { PurchaseRequest } from '../../types';
import { useStore } from '../../store';

interface RequestCardProps {
  request: PurchaseRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const voucherPlans = useStore((state) => state.voucherPlans);
  const vouchers = useStore((state) => state.vouchers);
  const approvePurchaseRequest = useStore((state) => state.approvePurchaseRequest);

  const plan = voucherPlans.find((p) => p.id === request.planId);
  
  const handleApprove = () => {
    const availableVoucher = vouchers.find(
      (v) => !v.isAssigned && v.planId === request.planId
    );
    if (availableVoucher) {
      approvePurchaseRequest(request.id, availableVoucher.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{plan?.duration} hrs</h3>
          <p className="text-sm text-gray-500">₱{plan?.price} × 1</p>
        </div>
        <div className="flex items-center space-x-2">
          {request.status === 'pending' ? (
            <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
              Pending
            </span>
          ) : (
            <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
              Confirmed
            </span>
          )}
          <button className="text-red-500 hover:text-red-700">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Customer</p>
          <p className="font-medium">{request.userId}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment</p>
          <p className="font-medium">Gcash</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {request.status === 'pending' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={handleApprove}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}