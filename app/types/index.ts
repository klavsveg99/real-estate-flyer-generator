export interface ListingData {
  title: string;
  address: string;
  description: string;
  price: string;
  pricePerSqm: string;
  areaSize: string;
  listingId: string;
  listingDate: string;
  agentName: string;
  agentTitle: string;
  mobile: string;
  phone: string;
  email: string;
  agentAddress: string;
  websiteText: string;
  ctaText: string;
}

export interface ImageFile {
  id: string;
  file: File | null;
  preview: string;
  name: string;
}

export interface FormState {
  listing: ListingData;
  mapImage: ImageFile | null;
  galleryImages: ImageFile[];
}

export const defaultListing: ListingData = {
  title: 'Luxurious Waterfront Villa',
  address: '123 Oceanview Drive, Malibu, CA 90265',
  description: `Experience unparalleled luxury in this stunning contemporary villa overlooking the Pacific Ocean. This architectural masterpiece features floor-to-ceiling windows that frame breathtaking ocean views from every room.\n\nThe open-concept living space flows seamlessly to a resort-style infinity pool and outdoor entertaining area, perfect for hosting memorable gatherings. The gourmet kitchen is equipped with top-of-the-line appliances and a massive island perfect for casual dining.\n\nThe primary suite is a true retreat with its own private balcony, spa-like bathroom with a soaking tub, and custom walk-in closets. Additional bedrooms each have en-suite bathrooms and stunning views.`,
  price: '4,250,000',
  pricePerSqm: '1,850',
  areaSize: '2,297',
  listingId: 'ML-2847',
  listingDate: 'March 2026',
  agentName: 'Sarah Mitchell',
  agentTitle: 'Senior Real Estate Consultant',
  mobile: '+1 (310) 555-0147',
  phone: '+1 (310) 555-0100',
  email: 'sarah.mitchell@luxuryrealty.com',
  agentAddress: '400 Pacific Coast Highway, Malibu, CA 90265',
  websiteText: 'www.luxuryrealty.com',
  ctaText: 'Schedule a Private Viewing',
};

export function parseDescription(description: string): string[] {
  return description.split('\n\n').filter((p) => p.trim() !== '');
}
