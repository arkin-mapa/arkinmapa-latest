import React, { useState } from 'react';
import { ClientWallet } from '../components/ClientWallet';
import { PlanCard } from '../components/PlanCard';
import { PurchaseModal } from '../components/PurchaseModal';
import { PendingRequests } from '../components/PendingRequests';
import { useStore } from '../store';
import { Plan } from '../types';

export function ClientDashboard() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const { plans, createPurchaseRequest } = useStore();

  const handlePurchase = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePurchaseSubmit = (data: { 
    name: string; 
    paymentMethod: 'gcash' | 'bank-transfer'; 
    quantity: number; 
  }) => {
    if (!selectedPlan) return;

    createPurchaseRequest({
      planId: selectedPlan.id,
      customerName: data.name,
      quantity: data.quantity,
      paymentMethod: data.paymentMethod,
    });

    setSelectedPlan(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PendingRequests />
      <ClientWallet />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-8">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onPurchase={() => handlePurchase(plan)}
            />
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PurchaseModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSubmit={handlePurchaseSubmit}
        />
      )}
    </div>
  );
}