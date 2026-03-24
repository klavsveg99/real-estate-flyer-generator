'use client';

import { ListingData } from '@/app/types';

interface ListingFormProps {
  data: ListingData;
  onChange: (data: ListingData) => void;
}

export default function ListingForm({ data, onChange }: ListingFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
        <input type="text" name="title" value={data.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Luxury Beachfront Villa" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
        <input type="text" name="address" value={data.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input type="text" name="price" value={data.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per m²</label>
          <input type="text" name="pricePerSqm" value={data.pricePerSqm} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area Size (m²)</label>
          <input type="text" name="areaSize" value={data.areaSize} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listing ID *</label>
          <input type="text" name="listingId" value={data.listingId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Date</label>
        <input type="text" name="listingDate" value={data.listingDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
        <textarea name="description" value={data.description} onChange={handleChange} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" />
        <p className="mt-1 text-xs text-gray-500">Separate paragraphs with a blank line</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
        <input type="text" name="ctaText" value={data.ctaText} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
    </div>
  );
}
