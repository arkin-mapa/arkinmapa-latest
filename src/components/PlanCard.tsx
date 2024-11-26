import React from 'react';
import { Wifi, Users, Clock } from 'lucide-react';
import { Plan } from '../types';

interface Props {
  plan: Plan;
  onPurchase: (plan: Plan) => void;
}

export function PlanCard({ plan, onPurchase }: Props) {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{plan.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-sm text-emerald-700">
            <Wifi size={16} />
            <span>{plan.bandwidth === 'unlimited' ? '∞' : `${plan.bandwidth}M`}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-sm text-emerald-700">
            <Users size={16} />
            <span>{plan.deviceLimit}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-sm text-emerald-700">
            <Clock size={16} />
            <span>{plan.duration}h</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Price</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              ₱{plan.price}
            </span>
          </div>
          <button
            onClick={() => onPurchase(plan)}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full font-medium shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Purchase
          </button>
        </div>
      </div>

      {/* 3D effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}