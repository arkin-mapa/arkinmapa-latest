import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PlanForm } from '../components/admin/PlanForm';
import { PlanCard } from '../components/admin/PlanCard';
import { RequestList } from '../components/admin/RequestList';
import { PaymentSettings } from '../components/admin/PaymentSettings';
import { VoucherPool } from '../components/admin/VoucherPool';
import { useStore } from '../store';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('plans');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const plans = useStore((state) => state.plans);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['Plans', 'Vouchers', 'Requests', 'Settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`${
                activeTab === tab.toLowerCase()
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'plans' && (
        <div className="space-y-6">
          {!showPlanForm && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowPlanForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Plan
              </button>
            </div>
          )}

          {showPlanForm ? (
            <PlanForm onSuccess={() => setShowPlanForm(false)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
              {plans.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No plans created yet
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'vouchers' && <VoucherPool />}

      {activeTab === 'requests' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Purchase Requests</h2>
          <RequestList />
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Settings</h2>
          <PaymentSettings />
        </div>
      )}
    </div>
  );
}