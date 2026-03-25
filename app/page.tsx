'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { FormState, defaultListing, ImageFile, ListingData } from '@/app/types';
import { isFormValid, generatePdfFilename } from '@/app/lib/utils';
import { pdf } from '@react-pdf/renderer';
import { FlyerPdfDocument } from './components/FlyerPdf';

function PreviewSection({ formState, windowWidth = 1024 }: { formState: FormState; windowWidth?: number }) {
  const { listing, mapImage, galleryImages, agentImage } = formState;
  const paragraphs = listing.description.split('\n\n').filter(p => p.trim());

  const isMobile = windowWidth < 767;

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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <img src="/images/favicon.jpg" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', objectPosition: 'left center', flexShrink: 0 }} />
          <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 700, color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>PardodLaimigs.lv</span>
        </div>
        <span style={{ backgroundColor: '#285854', color: 'white', padding: '6px 12px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{listing.listingId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: windowWidth >= 768 ? '1fr 1fr' : '1fr', gap: windowWidth >= 768 ? '30px' : '20px', marginBottom: windowWidth >= 768 ? '45px' : '30px', flex: 1 }}>
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

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {galleryImages.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={`placeholder-${i}`} style={{ width: 'calc(50% - 3px)', height: '75px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
              ))
            ) : (
              galleryImages.map((img, i) => {
                const isLast = i === galleryImages.length - 1;
                const isOdd = galleryImages.length % 2 === 1;
                const isFullWidth = isLast && isOdd;
                return (
                  <div key={img.id} style={{ width: isFullWidth ? '100%' : 'calc(50% - 3px)', height: '75px' }}>
                    <img src={img.preview} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', marginTop: 'auto' }}>
        <div style={{ backgroundColor: '#285854', padding: '16px', borderRadius: '6px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '12px' : '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={agentImage?.preview || '/images/favicon.jpg'} alt="Agent" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <p className="font-semibold text-white">{listing.agentName || 'Agent Name'}</p>
              <p className="text-white text-sm">{listing.agentTitle}</p>
            </div>
          </div>
          <div style={{ flex: 1, alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
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
  const [formState, setFormState] = useState<FormState>({ listing: defaultListing, mapImage: null, galleryImages: [], agentImage: { id: 'agent', file: null, preview: 'data:image/jpeg;base64,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', name: 'roberts.jpg' } });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'images' | 'agent'>('property');
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-0 md:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <img src="/images/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg flex-shrink-0" />
            <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate md:truncate-none">PDF mārketinga ģenerators</h1>
          </div>
          <button onClick={handleGeneratePdf} disabled={!isFormValid(formState.listing) || isGenerating} className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap ${isFormValid(formState.listing) && !isGenerating ? '' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`} style={isFormValid(formState.listing) && !isGenerating ? { background: '#285854', color: 'white' } : {}}>
            {isGenerating ? 'Veidojas...' : 'Lejupielādēt PDF'}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div style={{ display: 'grid', gridTemplateColumns: windowWidth >= 1024 ? '1fr 1fr' : '1fr', gap: windowWidth >= 1024 ? '32px' : '24px' }}>
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
          <div style={{ position: windowWidth >= 1024 ? 'sticky' : 'static', top: windowWidth >= 1024 ? '96px' : 'auto' }}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-2 md:p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Priekšskats</span>
                <span className="text-xs text-gray-400">A4</span>
              </div>
              <div className="p-2 md:p-4 bg-gray-100 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="flex justify-center">
                  <PreviewSection formState={formState} windowWidth={windowWidth} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
