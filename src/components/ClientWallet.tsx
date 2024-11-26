import React, { useState } from 'react';
import { Wifi, Users, Trash2, Send } from 'lucide-react';
import { useStore } from '../store';
import { TransferVoucherModal } from './TransferVoucherModal';
import { Voucher } from '../types';

export function ClientWallet() {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const plans = useStore((state) => state.plans);
  const clientVouchers = useStore((state) => state.getClientVouchers());
  const deleteClientVoucher = useStore((state) => state.deleteClientVoucher);
  const transferVoucher = useStore((state) => state.transferVoucher);

  const getPlan = (planId: string) => plans.find((p) => p.id === planId);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Your Voucher Wallet
        </h2>
        <span className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
          {clientVouchers.length} voucher{clientVouchers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientVouchers.map((voucher) => {
          const plan = getPlan(voucher.planId);
          if (!plan) return null;

          return (
            <div 
              key={voucher.id} 
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">{plan.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVoucher(voucher)}
                      className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Transfer voucher"
                    >
                      <Send size={14} />
                    </button>
                    <button
                      onClick={() => deleteClientVoucher(voucher.id)}
                      className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Remove voucher"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-lg mb-3">
                  <p className="font-mono text-center text-lg font-bold tracking-wider text-gray-800 select-all">
                    {voucher.code}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-600">
                  <div className="flex gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Wifi size={12} className="text-emerald-600" />
                      {plan.bandwidth === 'unlimited' ? '∞' : `${plan.bandwidth}M`}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={12} className="text-emerald-600" />
                      {plan.deviceLimit}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                    {plan.duration}h
                  </span>
                </div>
              </div>

              {/* 3D hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}

        {clientVouchers.length === 0 && (
          <div className="col-span-full">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center">
                  <Wifi size={32} className="text-emerald-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Vouchers Yet</h3>
              <p className="text-sm text-gray-600">
                Purchase a WiFi voucher to get started with our high-speed internet service.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedVoucher && (
        <TransferVoucherModal
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
          onTransfer={transferVoucher}
        />
      )}
    </div>
  );
}