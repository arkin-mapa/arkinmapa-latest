import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { PaymentInstructions } from '../types';

function PaymentDetails({ method, instructions }: { 
  method: 'gcash' | 'bank-transfer';
  instructions: PaymentInstructions;
}) {
  if (method === 'gcash') {
    return (
      <div className="bg-white/50 p-2 rounded">
        <p className="font-medium mb-1">GCash</p>
        <p className="text-xs">Send to: {instructions.gcash.number}</p>
        <p className="text-xs">Name: {instructions.gcash.name}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 p-2 rounded">
      <p className="font-medium mb-1">{instructions.bankTransfer.bankName}</p>
      <p className="text-xs">Account: {instructions.bankTransfer.accountNumber}</p>
      <p className="text-xs">Name: {instructions.bankTransfer.accountName}</p>
    </div>
  );
}

export function PendingRequests() {
  const { purchaseRequests, plans, paymentInstructions } = useStore();
  const pendingRequests = purchaseRequests.filter(r => r.status === 'pending');
  
  if (pendingRequests.length === 0) return null;

  // Group requests by payment method
  const groupedRequests = pendingRequests.reduce((acc, request) => {
    const method = request.paymentMethod;
    if (!acc[method]) acc[method] = [];
    acc[method].push(request);
    return acc;
  }, {} as Record<string, typeof pendingRequests>);

  return (
    <div className="mb-6">
      {Object.entries(groupedRequests).map(([method, requests]) => (
        <div key={method} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2 last:mb-0">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Payment Instructions ({method === 'gcash' ? 'GCash' : 'Bank Transfer'})
              </h3>
              <PaymentDetails 
                method={method as 'gcash' | 'bank-transfer'} 
                instructions={paymentInstructions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {requests.map(request => {
              const plan = plans.find(p => p.id === request.planId);
              if (!plan) return null;

              return (
                <div key={request.id} className="bg-white rounded shadow-sm p-2">
                  <div className="flex items-center gap-1 text-yellow-600 mb-1">
                    <Clock size={12} />
                    <span className="text-xs">Awaiting Payment</span>
                  </div>
                  <h4 className="text-xs font-medium mb-1">{plan.name}</h4>
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>Qty: {request.quantity}</span>
                    <span className="font-medium">₱{plan.price * request.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}