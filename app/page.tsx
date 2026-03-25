'use client';

import React, { useState, useCallback } from 'react';
import { FormState, defaultListing, ImageFile, ListingData } from '@/app/types';
import { isFormValid, generatePdfFilename } from '@/app/lib/utils';
import { pdf } from '@react-pdf/renderer';
import { FlyerPdfDocument } from './components/FlyerPdf';

function PreviewSection({ formState }: { formState: FormState }) {
  const { listing, mapImage, galleryImages, agentImage } = formState;
  const paragraphs = listing.description.split('\n\n').filter(p => p.trim());

  const formatPrice = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '€' + value;
    return '€' + num.toLocaleString();
  };

  return (
    <div
      id="flyer-template"
      className="bg-white shadow-lg"
      style={{ padding: '45px', fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ height: '11px', background: 'linear-gradient(90deg, #2d6b66 0%, #285854 100%)', borderRadius: '2px', marginBottom: '45px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/favicon.jpg" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain', objectPosition: 'left center' }} />
          <span style={{ marginLeft: '10px', fontSize: '16px', fontWeight: 700, color: '#000000' }}>PardodLaimigs.lv</span>
        </div>
        <span style={{ backgroundColor: '#285854', color: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}>{listing.listingId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px', flex: 1 }} className="md:grid-cols-2 md:gap-[30px] md:mb-[45px]">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 className="font-bold text-gray-900" style={{ fontSize: '32px', marginBottom: '8px', lineHeight: 1.2 }}>{listing.title || 'Īpašuma nosaukums'}</h1>
          <p className="text-gray-500" style={{ fontSize: '18px', marginBottom: '20px' }}>{listing.address || 'Īpašuma adrese'}</p>
          <div className="bg-gray-50 rounded-lg border border-gray-200" style={{ padding: '12px', marginBottom: '15px' }}>
            <div className="font-bold text-gray-900" style={{ fontSize: '32px' }}>{formatPrice(listing.price) || '€0'}</div>
            <div className="text-gray-500" style={{ fontSize: '14px', marginTop: '4px' }}>
              {listing.areaSize && `${parseFloat(listing.areaSize).toLocaleString()} m²`}
              {listing.areaSize && listing.pricePerSqm && ' • '}
              {listing.pricePerSqm && `${formatPrice(listing.pricePerSqm)}/m²`}
            </div>
          </div>
          <div style={{ flex: 1, marginBottom: '20px', overflow: 'hidden' }}>
            {paragraphs.slice(0, 3).map((para, i) => (
              <p key={i} className="text-gray-600" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>{para}</p>
            ))}
          </div>
          <a
            href="https://pardodlaimigs.lv"
            style={{ background: '#285854', color: 'white', borderRadius: '6px', padding: '16px', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.5px', display: 'block', textDecoration: 'none' }}
          >
            {listing.ctaText || 'Sazināties'}
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: '150px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
            {mapImage?.preview ? (
              <img src={mapImage.preview} alt="Map" style={{ width: '100%', height: '150px', objectFit: 'cover', maxWidth: '100%' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ fontSize: '14px' }}>Map Image</div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {galleryImages.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={`placeholder-${i}`} style={{ width: 'calc(50% - 8px)', height: '75px', marginRight: i % 2 === 0 ? '15px' : '0', marginTop: i >= 2 ? '6px' : '0', marginBottom: '6px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
              ))
            ) : (
              galleryImages.map((img, i) => {
                const isFirstInPair = i % 2 === 0;
                const hasPair = i + 1 < galleryImages.length;
                const isFullWidth = !hasPair;
                return (
                  <div key={img.id} style={{ width: hasPair ? 'calc(50% - 8px)' : '100%', marginRight: isFirstInPair ? '15px' : '0', marginTop: isFullWidth ? '6px' : '0', marginBottom: '6px', height: '75px' }}>
                    <img src={img.preview} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', marginTop: 'auto' }}>
        <div style={{ backgroundColor: '#285854', padding: '16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {agentImage && (
              <img src={agentImage.preview} alt="Agent" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
            )}
            <div>
              <p className="font-semibold text-white">{listing.agentName || 'Agent Name'}</p>
              <p className="text-white text-sm">{listing.agentTitle}</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-white font-medium">{listing.mobile}</p>
            <p className="text-white text-sm">{listing.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
          <span className="text-gray-400" style={{ fontSize: '11px' }}>{listing.listingDate}</span>
          <span className="text-gray-400" style={{ fontSize: '11px' }}>© pardodlaimigs.lv</span>
        </div>
      </div>
    </div>
  );
}

function PropertyForm({ data, onChange }: { data: ListingData; onChange: (d: ListingData) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Nosaukums *</label><input type="text" name="title" value={data.title} onChange={handleChange} placeholder="Piemēram: Moderns dzīvoklis Centrā" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Adrese *</label><input type="text" name="address" value={data.address} onChange={handleChange} placeholder="Piemēram: Brīvības iela 15, Rīga" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Cena *</label><input type="text" name="price" value={data.price} onChange={handleChange} placeholder="Piemēram: 150,000" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Cena par m²</label><input type="text" name="pricePerSqm" value={data.pricePerSqm} onChange={handleChange} placeholder="Piemēram: 1,500" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Platība (m²)</label><input type="text" name="areaSize" value={data.areaSize} onChange={handleChange} placeholder="Piemēram: 85" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Sludinājuma ID *</label><input type="text" name="listingId" value={data.listingId} onChange={handleChange} placeholder="Piemēram: ML-2847" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Datums</label><input type="text" name="listingDate" value={data.listingDate} onChange={handleChange} placeholder="Piemēram: Marts 2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Apraksts</label><textarea name="description" value={data.description} onChange={handleChange} rows={6} placeholder="Ievadiet īpašuma aprakstu..." className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">CTA Poga</label><input type="text" name="ctaText" value={data.ctaText} onChange={handleChange} placeholder="Sazināties" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
    </div>
  );
}

function AgentForm({ data, onChange, agentImage, updateAgentImage }: { data: ListingData; onChange: (d: ListingData) => void; agentImage: ImageFile | null; updateAgentImage: (img: ImageFile | null) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Aģenta foto</label>
        <div className="flex gap-3">
          <div className="relative">
            <label className="border-2 border-dashed border-gray-300 rounded-lg w-20 h-20 flex flex-col items-center justify-center cursor-pointer hover:border-[#285854] hover:bg-[#285854]/10 transition-colors overflow-hidden">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    updateAgentImage({ id: 'agent', file, preview: reader.result as string, name: file.name });
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              {agentImage ? (
                <img src={agentImage.preview} alt="Agent" className="w-full h-full object-cover" />
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="text-gray-400 text-xs mt-1">Foto</span>
                </>
              )}
            </label>
            {agentImage && (
              <button onClick={() => updateAgentImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600">×</button>
            )}
          </div>
        </div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Aģenta vārds *</label><input type="text" name="agentName" value={data.agentName} onChange={handleChange} placeholder="Piemēram: Roberts Evarsons" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Aģenta amats</label><input type="text" name="agentTitle" value={data.agentTitle} onChange={handleChange} placeholder="Piemēram: Nekustamo īpašumu konsultants" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Tālrunis</label><input type="text" name="mobile" value={data.mobile} onChange={handleChange} placeholder="Piemēram: +371 2492 2942" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">E-pasts</label><input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Piemēram: info@pardodlaimigs.lv" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Mājaslapa</label><input type="text" name="websiteText" value={data.websiteText} onChange={handleChange} placeholder="Piemēram: www.pardodlaimigs.lv" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
    </div>
  );
}

function ImageSection({ formState, updateMapImage, updateGalleryImages }: { formState: FormState; updateMapImage: (img: ImageFile | null) => void; updateGalleryImages: (imgs: ImageFile[]) => void }) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [mapAddress, setMapAddress] = React.useState(formState.listing.address);
  const [isLoadingMap, setIsLoadingMap] = React.useState(false);

  const convertToPng = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.includes('webp')) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = URL.createObjectURL(file);
    });
  };

  const fetchMapImage = async () => {
    if (!mapAddress.trim()) return;
    setIsLoadingMap(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
      if (!apiKey) {
        alert('Lūdzu, iestatiet NEXT_PUBLIC_GOOGLE_MAPS_API_KEY vides mainīgajos.');
        return;
      }
      const encodedAddress = encodeURIComponent(mapAddress);
      const mapUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
      
      const response = await fetch(mapUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&scale=2&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
        
        const mapResponse = await fetch(staticMapUrl);
        const blob = await mapResponse.blob();
        const reader = new FileReader();
        reader.onload = () => {
          updateMapImage({ id: '2', file: null, preview: reader.result as string, name: 'map' });
        };
        reader.readAsDataURL(blob);
      } else {
        alert('Adrese nav atrasta. Lūdzu, mēģiniet citu adresi.');
      }
    } catch (error) {
      console.error('Error fetching map:', error);
      alert('Neizdevās iegūt karti. Lūdzu, pārbaudiet API atslēgu un mēģiniet vēlreiz.');
    } finally {
      setIsLoadingMap(false);
    }
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 6 - formState.galleryImages.length;
    const filesToAdd = files.slice(0, remaining);
    
    let loadedCount = 0;
    const newImages: ImageFile[] = [];
    
    for (const file of filesToAdd) {
      const preview = await convertToPng(file);
      newImages.push({ id: Date.now() + Math.random().toString(), file, preview, name: file.name });
      loadedCount++;
      if (loadedCount === filesToAdd.length) {
        updateGalleryImages([...formState.galleryImages, ...newImages]);
      }
    }
  };

  const handleSortStart = (index: number) => {
    setDragIndex(index);
  };

  const handleSortDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    
    const newImages = [...formState.galleryImages];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    updateGalleryImages(newImages);
    setDragIndex(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Karte (Google Maps)</label>
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={mapAddress}
              onChange={(e) => setMapAddress(e.target.value)}
              placeholder="Ievadiet īpašuma adresi"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={fetchMapImage}
              disabled={isLoadingMap || !mapAddress.trim()}
              style={{ background: '#285854', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500 }}
            >
              {isLoadingMap ? 'Loading...' : 'Iegūt karti'}
            </button>
          </div>
          {formState.mapImage && (
            <div className="relative">
              <img src={formState.mapImage.preview} alt="Map" className="w-full h-40 object-cover rounded-lg" />
              <button
                onClick={() => updateMapImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          {!formState.mapImage && (
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Ievadiet adresi un klikšķiniet "Iegūt karti"
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Attēli (līdz 6) - Velciet, lai mainītu kārtību</label>
        <div className="grid grid-cols-3 gap-3">
          {formState.galleryImages.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleSortStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleSortDrop(i)}
              onDragEnd={() => setDragIndex(null)}
              className={`relative border-2 border-dashed rounded-lg aspect-square flex items-center justify-center cursor-move bg-gray-50 hover:bg-gray-100 ${dragIndex === i ? 'border-[#285854] bg-[#285854]/10' : 'border-gray-300'}`}
            >
              <img src={img.preview} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded" />
              <button onClick={() => updateGalleryImages(formState.galleryImages.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600">×</button>
              <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">{i + 1}</span>
            </div>
          ))}
          {formState.galleryImages.length < 6 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#285854] hover:bg-[#285854]/10 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFiles} />
              <div style={{ color: '#285854' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <span className="text-gray-400 text-xs mt-1">{formState.galleryImages.length + 1}</span>
            </label>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-400">{formState.galleryImages.length}/6 attēlu augšupielādēts</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [formState, setFormState] = useState<FormState>({ listing: defaultListing, mapImage: null, galleryImages: [], agentImage: { id: 'agent', file: null, preview: '/images/roberts.jpg', name: 'roberts.jpg' } });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'images' | 'agent'>('property');

  const updateListing = useCallback((listing: ListingData) => setFormState(prev => ({ ...prev, listing })), []);
  const updateMapImage = useCallback((mapImage: ImageFile | null) => setFormState(prev => ({ ...prev, mapImage })), []);
  const updateGalleryImages = useCallback((galleryImages: ImageFile[]) => setFormState(prev => ({ ...prev, galleryImages })), []);
  const updateAgentImage = useCallback((agentImage: ImageFile | null) => setFormState(prev => ({ ...prev, agentImage })), []);

  const handleGeneratePdf = async () => {
    if (!isFormValid(formState.listing)) { alert('Lūdzu, aizpildiet visus obligātos laukus.'); return; }
    setIsGenerating(true);
    try {
      const doc = <FlyerPdfDocument listing={formState.listing} mapImage={formState.mapImage} galleryImages={formState.galleryImages} agentImage={formState.agentImage} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generatePdfFilename(formState.listing.listingId);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Neizdevās izveidot PDF: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg" />
            <h1 className="text-xl font-bold text-gray-900">PDF mārketinga ģenerators</h1>
          </div>
          <button onClick={handleGeneratePdf} disabled={!isFormValid(formState.listing) || isGenerating} className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 ${isFormValid(formState.listing) && !isGenerating ? '' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`} style={isFormValid(formState.listing) && !isGenerating ? { background: '#285854', color: 'white' } : {}}>
            {isGenerating ? 'Veidojas...' : 'Lejupielādēt PDF'}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex min-w-max">
                  {(['property', 'images', 'agent'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-[#285854] text-[#285854]' : 'border-transparent text-gray-500'}`}>
                      {tab === 'property' && 'Īpašums'}
                      {tab === 'images' && 'Attēli'}
                      {tab === 'agent' && 'Aģents'}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-4 md:p-6">
                {activeTab === 'property' && <PropertyForm data={formState.listing} onChange={updateListing} />}
                {activeTab === 'images' && <ImageSection formState={formState} updateMapImage={updateMapImage} updateGalleryImages={updateGalleryImages} />}
                {activeTab === 'agent' && <AgentForm data={formState.listing} onChange={updateListing} agentImage={formState.agentImage} updateAgentImage={updateAgentImage} />}
              </div>
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-2 md:p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Priekšskats</span>
                <span className="text-xs text-gray-400">A4</span>
              </div>
              <div className="p-2 md:p-4 bg-gray-100 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="flex justify-center">
                  <PreviewSection formState={formState} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
