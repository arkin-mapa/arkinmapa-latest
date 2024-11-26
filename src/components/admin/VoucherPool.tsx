import React from 'react';
import { Trash2, Wifi, Users } from 'lucide-react';
import { useStore } from '../../store';

export function VoucherPool() {
  const { vouchers, plans, deleteVoucher } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Voucher Pool</h2>
        <span className="text-sm text-gray-600">
          {vouchers.filter(v => v.status === 'available').length} available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {vouchers.map((voucher) => {
          const plan = plans.find(p => p.id === voucher.planId);
          if (!plan) return null;

          return (
            <div 
              key={voucher.id} 
              className={`bg-white rounded-lg shadow-sm p-3 ${
                voucher.status === 'used' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-lg font-bold">{voucher.code}</p>
                  <p className="text-sm text-gray-600">{plan.name}</p>
                </div>
                <button
                  onClick={() => deleteVoucher(voucher.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Wifi size={12} />
                    {plan.bandwidth === 'unlimited' ? '∞' : `${plan.bandwidth}M`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {plan.deviceLimit}
                  </span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  voucher.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {voucher.status}
                </span>
              </div>
            </div>
          );
        })}

        {vouchers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No vouchers in the pool
          </div>
        )}
      </div>
    </div>
  );
}