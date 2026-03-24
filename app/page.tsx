'use client';

import { useState, useCallback } from 'react';
import { FormState, defaultListing, ImageFile, ListingData } from '@/app/types';
import { isFormValid, generatePdfFilename } from '@/app/lib/utils';
import { pdf } from '@react-pdf/renderer';
import { FlyerPdfDocument } from './components/FlyerPdf';

function PreviewSection({ formState }: { formState: FormState }) {
  const { listing, logo, mapImage, galleryImages } = formState;
  const paragraphs = listing.description.split('\n\n').filter(p => p.trim());

  const formatPrice = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '$' + value;
    return '$' + num.toLocaleString();
  };

  return (
    <div
      id="flyer-template"
      className="bg-white shadow-lg"
      style={{ width: '595px', height: '842px', padding: '45px', fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ height: '11px', background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: '2px', marginBottom: '45px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '45px', paddingBottom: '45px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ width: '180px', height: '50px' }}>
          {logo?.preview ? (
            <img src={logo.preview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div className="bg-gray-200 rounded flex items-center justify-center text-gray-400" style={{ width: '100%', height: '100%', fontSize: '12px' }}>Logo</div>
          )}
        </div>
        <span className="bg-purple-600 text-white rounded font-semibold" style={{ padding: '8px 16px', fontSize: '12px' }}>{listing.listingId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '45px', marginBottom: '45px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 className="font-bold text-gray-900" style={{ fontSize: '32px', marginBottom: '8px', lineHeight: 1.2 }}>{listing.title || 'Property Title'}</h1>
          <p className="text-gray-500" style={{ fontSize: '18px', marginBottom: '20px' }}>{listing.address || 'Property Address'}</p>
          <div className="bg-gray-50 rounded-lg border border-gray-200" style={{ padding: '20px', marginBottom: '20px' }}>
            <div className="font-bold text-gray-900" style={{ fontSize: '42px' }}>{formatPrice(listing.price) || '$0'}</div>
            <div className="text-gray-500" style={{ fontSize: '16px', marginTop: '8px' }}>
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
            href={`mailto:info@pardodlaimigs.lv?subject=${encodeURIComponent('Par īpašumu: ' + listing.title)}&body=${encodeURIComponent('Sveicināti,\n\nEs iepazinos ar Jūsu sludinājumu par īpašumu "' + listing.title + '" (' + listing.listingId + ').\n\nĪpašuma adrese: ' + listing.address + '\nCena: ' + listing.price + ' EUR' + (listing.areaSize ? '\nPlatība: ' + listing.areaSize + ' m²' : '') + '\n\nLūdzu, sazinieties ar mani, lai uzzinātu vairāk.\n\nAr cieņu,\n' + listing.agentName)}`}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded font-semibold uppercase text-center cursor-pointer no-underline"
            style={{ padding: '16px 32px', fontSize: '16px', display: 'inline-block', letterSpacing: '0.5px', width: 'fit-content' }}
          >
            {listing.ctaText || 'Contact Agent'}
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200" style={{ width: '100%', height: '120px', marginBottom: '12px' }}>
            {mapImage?.preview ? (
              <img src={mapImage.preview} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ fontSize: '14px' }}>Map Image</div>
            )}
          </div>

          <div>
            {[...Array(3)].map((_, rowIndex) => {
              const rowImages = galleryImages.slice(rowIndex * 2, rowIndex * 2 + 2);
              const hasTwo = rowImages.length === 2;
              return (
                <div key={`row-${rowIndex}`} style={{ display: 'flex', marginBottom: rowIndex < 2 ? '6px' : '0' }}>
                  {rowImages.map((img, colIndex) => (
                    <div key={img?.id || `empty-${rowIndex}-${colIndex}`} className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200" style={{ width: hasTwo ? '50%' : '100%', aspectRatio: hasTwo ? '1' : '2', marginRight: hasTwo && colIndex === 0 ? '6px' : '0' }}>
                      {img?.preview ? (
                        <img src={img.preview} alt={`Gallery ${rowIndex * 2 + colIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400" style={{ fontSize: '12px' }}>Image</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {!hasTwo && (
                    <div className="bg-gray-200 rounded-lg border border-gray-200" style={{ width: '0', visibility: 'hidden' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '14px' }}>
            <p className="font-semibold text-gray-900">{listing.agentName || 'Agent Name'}</p>
            <p className="text-gray-500">{listing.agentTitle}</p>
            <p className="text-gray-500">{listing.mobile}</p>
            <p className="text-gray-500">{listing.phone}</p>
            <p className="text-gray-500">{listing.email}</p>
          </div>
          <div className="text-right text-gray-500" style={{ fontSize: '12px' }}>
            {listing.websiteText && <p className="text-purple-600 font-medium">{listing.websiteText}</p>}
            <p>{listing.agentAddress}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
          <span className="text-gray-400" style={{ fontSize: '11px' }}>{listing.listingDate}</span>
          <span className="text-gray-400" style={{ fontSize: '11px' }}>copyright pardodlaimigs.lv</span>
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
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label><input type="text" name="title" value={data.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Address *</label><input type="text" name="address" value={data.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Price *</label><input type="text" name="price" value={data.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Price per m²</label><input type="text" name="pricePerSqm" value={data.pricePerSqm} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Area Size (m²)</label><input type="text" name="areaSize" value={data.areaSize} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Listing ID *</label><input type="text" name="listingId" value={data.listingId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Listing Date</label><input type="text" name="listingDate" value={data.listingDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={data.description} onChange={handleChange} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label><input type="text" name="ctaText" value={data.ctaText} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
    </div>
  );
}

function AgentForm({ data, onChange }: { data: ListingData; onChange: (d: ListingData) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Agent Name *</label><input type="text" name="agentName" value={data.agentName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Agent Title</label><input type="text" name="agentTitle" value={data.agentTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label><input type="text" name="mobile" value={data.mobile} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" name="phone" value={data.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={data.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label><input type="text" name="agentAddress" value={data.agentAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input type="text" name="websiteText" value={data.websiteText} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
    </div>
  );
}

function ImageSection({ formState, updateLogo, updateMapImage, updateGalleryImages }: { formState: FormState; updateLogo: (img: ImageFile | null) => void; updateMapImage: (img: ImageFile | null) => void; updateGalleryImages: (imgs: ImageFile[]) => void }) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateLogo({ id: '1', file, preview: reader.result as string, name: file.name });
    reader.readAsDataURL(file);
  };

  const handleMapFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateMapImage({ id: '2', file, preview: reader.result as string, name: file.name });
    reader.readAsDataURL(file);
  };

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 6 - formState.galleryImages.length;
    const filesToAdd = files.slice(0, remaining);
    
    let loadedCount = 0;
    const newImages: ImageFile[] = [];
    
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({ id: Date.now() + Math.random().toString(), file, preview: reader.result as string, name: file.name });
        loadedCount++;
        if (loadedCount === filesToAdd.length) {
          updateGalleryImages([...formState.galleryImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {formState.logo ? (
            <div className="relative"><img src={formState.logo.preview} alt="Logo" className="h-20 mx-auto object-contain" /><button onClick={() => updateLogo(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button></div>
          ) : (
            <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={handleLogoFile} /><div className="text-gray-500">Click to upload logo</div></label>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location Map</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {formState.mapImage ? (
            <div className="relative"><img src={formState.mapImage.preview} alt="Map" className="h-20 mx-auto object-cover" /><button onClick={() => updateMapImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button></div>
          ) : (
            <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={handleMapFile} /><div className="text-gray-500">Click to upload map</div></label>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (up to 6) - Drag to reorder</label>
        {formState.galleryImages.length < 6 && (
          <div className="mb-3">
            <label className="cursor-pointer inline-block">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFiles} />
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">Upload Multiple Images</span>
            </label>
            <span className="ml-3 text-sm text-gray-500">{formState.galleryImages.length}/6</span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {formState.galleryImages.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleSortStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleSortDrop(i)}
              onDragEnd={() => setDragIndex(null)}
              className={`relative border-2 border-dashed rounded-lg p-2 aspect-square flex items-center justify-center cursor-move bg-gray-50 hover:bg-gray-100 ${dragIndex === i ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
            >
              <img src={img.preview} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded" />
              <button onClick={() => updateGalleryImages(formState.galleryImages.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
              <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">{i + 1}</span>
            </div>
          ))}
          {[...Array(Math.max(0, 6 - formState.galleryImages.length))].map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center">
              <span className="text-gray-400 text-xs">{formState.galleryImages.length + i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [formState, setFormState] = useState<FormState>({ listing: defaultListing, logo: null, mapImage: null, galleryImages: [] });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'images' | 'agent'>('property');

  const updateListing = useCallback((listing: ListingData) => setFormState(prev => ({ ...prev, listing })), []);
  const updateLogo = useCallback((logo: ImageFile | null) => setFormState(prev => ({ ...prev, logo })), []);
  const updateMapImage = useCallback((mapImage: ImageFile | null) => setFormState(prev => ({ ...prev, mapImage })), []);
  const updateGalleryImages = useCallback((galleryImages: ImageFile[]) => setFormState(prev => ({ ...prev, galleryImages })), []);

  const handleGeneratePdf = async () => {
    if (!isFormValid(formState.listing)) { alert('Please fill in all required fields.'); return; }
    setIsGenerating(true);
    try {
      const doc = <FlyerPdfDocument listing={formState.listing} logo={formState.logo} mapImage={formState.mapImage} galleryImages={formState.galleryImages} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generatePdfFilename(formState.listing.listingId);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate PDF: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Real Estate Flyer Generator</h1>
          </div>
          <button onClick={handleGeneratePdf} disabled={!isFormValid(formState.listing) || isGenerating} className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 ${isFormValid(formState.listing) && !isGenerating ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {(['property', 'images', 'agent'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>
                      {tab === 'property' && 'Property Details'}
                      {tab === 'images' && 'Images'}
                      {tab === 'agent' && 'Agent Info'}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">
                {activeTab === 'property' && <PropertyForm data={formState.listing} onChange={updateListing} />}
                {activeTab === 'images' && <ImageSection formState={formState} updateLogo={updateLogo} updateMapImage={updateMapImage} updateGalleryImages={updateGalleryImages} />}
                {activeTab === 'agent' && <AgentForm data={formState.listing} onChange={updateListing} />}
              </div>
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Flyer Preview</span>
                <span className="text-xs text-gray-400">A4</span>
              </div>
              <div className="p-4 bg-gray-100 overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
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
