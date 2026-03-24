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
  title: 'Ekskluzivs dzivoklis ar skatu uz juru',
  address: '',
  description: `Piedavatam Jums ekskluzivu dzivokli moderna jaunbuve ar brinishku skatu uz Rigas lici. Shis apraksts aizstaves ar savu ipashuma detalizetu aprakstu.\n\nDzivoklis atrodas toposha projektā ar augstas kvalitates apdari un muzdienigiem risinajumiem. Visi materiali ir rupegi izveleti, lai raditu komfortablu un elegantu dzives telpu.\n\nIpushums ir piemerots gan gimeinei, gan investoriem, kas mekle kvalitativu ipashumu ar labu atdevi.`,
  price: '295,000',
  pricePerSqm: '2,450',
  areaSize: '120',
  listingId: 'JR-4521',
  listingDate: 'Marts 2026',
  agentName: 'Roberts Evarsons',
  agentTitle: 'Nekustamo ipashumu konsultants',
  mobile: '+371 2492 2942',
  phone: '',
  email: 'info@pardodlaimigs.lv',
  agentAddress: '',
  websiteText: 'www.pardodlaimigs.lv',
  ctaText: 'Sazinaties ar agentu',
};

export function parseDescription(description: string): string[] {
  return description.split('\n\n').filter((p) => p.trim() !== '');
}
