'use client';

import { ListingData } from '@/app/types';

interface AgentFormProps {
  data: ListingData;
  onChange: (data: ListingData) => void;
}

export default function AgentForm({ data, onChange }: AgentFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name *</label>
        <input type="text" name="agentName" value={data.agentName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Agent Title</label>
        <input type="text" name="agentTitle" value={data.agentTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input type="text" name="mobile" value={data.mobile} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" name="phone" value={data.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={data.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
        <input type="text" name="agentAddress" value={data.agentAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input type="text" name="websiteText" value={data.websiteText} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
    </div>
  );
}
