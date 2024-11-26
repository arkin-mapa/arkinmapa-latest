import React from 'react';
import { Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useStore } from '../../store';

export function RequestList() {
  const { purchaseRequests, plans, updatePurchaseStatus, deletePurchaseRequest } = useStore();

  return (
    <div className="space-y-4">
      {purchaseRequests.map((request) => {
        const plan = plans.find(p => p.id === request.planId);
        if (!plan) return null;

        return (
          <div key={request.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-medium">{plan.name}</h3>
                <p className="text-xs text-gray-500">
                  ₱{plan.price} × {request.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {request.status === 'pending' ? (
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Clock size={14} />
                    Pending
                  </span>
                ) : request.status === 'confirmed' ? (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={14} />
                    Confirmed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-600">
                    <XCircle size={14} />
                    Rejected
                  </span>
                )}
                <button
                  onClick={() => deletePurchaseRequest(request.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{request.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{request.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(request.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Amount</p>
                <p className="font-medium">₱{plan.price * request.quantity}</p>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updatePurchaseStatus(request.id, 'confirmed')}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-md text-sm hover:bg-emerald-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updatePurchaseStatus(request.id, 'rejected')}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        );
      })}

      {purchaseRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No purchase requests yet
        </div>
      )}
    </div>
  );
}