import React from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../store';

interface Props {
  onSuccess: () => void;
}

export function PlanForm({ onSuccess }: Props) {
  const addPlan = useStore((state) => state.addPlan);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addPlan({
      name: formData.get('name') as string,
      duration: Number(formData.get('duration')),
      price: Number(formData.get('price')),
      bandwidth: formData.get('bandwidth') as 'unlimited' | number,
      deviceLimit: Number(formData.get('deviceLimit')),
      description: formData.get('description') as string,
    });

    onSuccess();
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Plan Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
          <input
            type="number"
            name="duration"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₱)</label>
          <input
            type="number"
            name="price"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bandwidth</label>
          <select
            name="bandwidth"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="unlimited">Unlimited</option>
            <option value="5">5 Mbps</option>
            <option value="10">10 Mbps</option>
            <option value="20">20 Mbps</option>
            <option value="50">50 Mbps</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Device Limit</label>
          <input
            type="number"
            name="deviceLimit"
            required
            min="1"
            defaultValue="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Plan
        </button>
      </div>
    </form>
  );
}