import { ListingData } from '@/app/types';

export const CACHE_BUST = 'v=17';

export function formatPrice(value: string): string {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '$' + value;
  return '$' + num.toLocaleString('en-US');
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function isFormValid(listing: ListingData): boolean {
  const required: (keyof ListingData)[] = ['title', 'address', 'price', 'listingId', 'agentName'];
  return required.every((field) => listing[field].trim() !== '');
}

export function getMissingFields(listing: ListingData): string[] {
  const required: (keyof ListingData)[] = ['title', 'address', 'price', 'listingId', 'agentName'];
  return required.filter((field) => listing[field].trim() === '');
}

export function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    title: 'Nosaukums',
    address: 'Adrese',
    price: 'Cena',
    listingId: 'Sludinājuma ID',
    agentName: 'Aģenta vārds',
  };
  return fieldNames[field] || field;
}

export function generatePdfFilename(listingId: string): string {
  const sanitizedId = listingId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `listing-${sanitizedId}.pdf`;
}
