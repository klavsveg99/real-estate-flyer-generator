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
  title: 'Ekskluzīvs公寓 ar skatu uz jūru',
  address: 'Jūras iela 15, Jūrmala, LV-2011',
  description: `Piedāvājam Jums ekskluzīvu dzīvokli modernā jaunbūvē ar brīnišķīgu skatu uz Rīgas līci. Šis apraksts aizstājiet ar sava īpašuma detalizētu aprakstu.\n\nDzīvoklis atrodas topošā projektā ar augstas kvalitātes apdari un mūsdienīgiem risinājumiem. Visi materiāli ir rūpīgi izvēlēti, lai radītu komfortablu un elegantu dzīves telpu.\n\nĪpašums ir piemērots gan ģimenei, gan investoriem, kas meklē kvalitatīvu īpašumu ar labu atdevi.`,
  price: '295,000',
  pricePerSqm: '2,450',
  areaSize: '120',
  listingId: 'JR-4521',
  listingDate: 'Marts 2026',
  agentName: 'Jānis Bērziņš',
  agentTitle: 'Nekustamo īpašumu konsultants',
  mobile: '+371 20000000',
  phone: '+371 67890000',
  email: 'janis@pardodlaimigs.lv',
  agentAddress: 'Brīvības iela 100, Rīga, LV-1234',
  websiteText: 'www.pardodlaimigs.lv',
  ctaText: 'Sazināties ar aģentu',
};

export function parseDescription(description: string): string[] {
  return description.split('\n\n').filter((p) => p.trim() !== '');
}
