'use client';

import { useState, useCallback } from 'react';
import { FormState, defaultListing, ImageFile, ListingData } from '@/app/types';
import { isFormValid, generatePdfFilename } from '@/app/lib/utils';
import ListingForm from './components/ListingForm';
import AgentForm from './components/AgentForm';
import ImageUpload from './components/ImageUpload';
import GalleryUpload from './components/GalleryUpload';

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
      style={{
        width: '100%',
        maxWidth: '595px',
        aspectRatio: '595 / 842',
        padding: '6%',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div 
        style={{ 
          height: '1.5%',
          background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)', 
          borderRadius: '2px', 
          marginBottom: '6%' 
        }} 
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6%', paddingBottom: '6%', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ width: '30%', maxHeight: '10%' }}>
          {logo?.preview ? (
            <img src={logo.preview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div className="bg-gray-200 rounded flex items-center justify-center text-gray-400" style={{ width: '100%', aspectRatio: '180 / 50', fontSize: '1vw' }}>Logo</div>
          )}
        </div>
        <span className="bg-purple-600 text-white rounded font-semibold" style={{ padding: '1% 2%', fontSize: '1.5vw' }}>{listing.listingId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6%', marginBottom: '6%', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h1 className="font-bold text-gray-900" style={{ fontSize: '4vw', marginBottom: '1%', lineHeight: 1.2 }}>{listing.title || 'Property Title'}</h1>
          <p className="text-gray-500" style={{ fontSize: '2vw', marginBottom: '5%' }}>{listing.address || 'Property Address'}</p>

          <div className="bg-gray-50 rounded-lg border border-gray-200" style={{ padding: '4%', marginBottom: '5%' }}>
            <div className="font-bold text-gray-900" style={{ fontSize: '5vw' }}>{formatPrice(listing.price) || '$0'}</div>
            <div className="text-gray-500" style={{ fontSize: '2vw', marginTop: '2%' }}>
              {listing.areaSize && `${parseFloat(listing.areaSize).toLocaleString()} m²`}
              {listing.areaSize && listing.pricePerSqm && ' • '}
              {listing.pricePerSqm && `${formatPrice(listing.pricePerSqm)}/m²`}
            </div>
          </div>

          <div style={{ flex: 1, marginBottom: '5%', overflow: 'hidden' }}>
            {paragraphs.slice(0, 3).map((para, i) => (
              <p key={i} className="text-gray-600" style={{ fontSize: '1.8vw', lineHeight: 1.5, marginBottom: '3%' }}>{para}</p>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded font-semibold uppercase text-center" style={{ padding: '4% 8%', fontSize: '2vw', display: 'inline-block', letterSpacing: '0.5px', width: 'fit-content' }}>
            {listing.ctaText || 'Contact Agent'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3%', overflow: 'hidden' }}>
          <div className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200" style={{ width: '100%', aspectRatio: '2 / 1' }}>
            {mapImage?.preview ? (
              <img src={mapImage.preview} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ fontSize: '2vw' }}>Map Image</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2%', width: '100%', overflow: 'hidden' }}>
            {[...Array(6)].map((_, i) => {
              const img = galleryImages[i];
              return (
                <div 
                  key={img?.id || `placeholder-${i}`} 
                  className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200"
                  style={{ 
                    aspectRatio: '1',
                    width: '100%',
                    maxWidth: '100%',
                  }}
                >
                  {img?.preview ? (
                    <img src={img.preview} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400" style={{ fontSize: '1.5vw' }}>Image</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '3%', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.8vw' }}>
            <p className="font-semibold text-gray-900">{listing.agentName || 'Agent Name'}</p>
            <p className="text-gray-500">{listing.agentTitle}</p>
            <p className="text-gray-500">{listing.mobile}</p>
            <p className="text-gray-500">{listing.phone}</p>
            <p className="text-gray-500">{listing.email}</p>
          </div>
          <div className="text-right text-gray-500" style={{ fontSize: '1.5vw' }}>
            {listing.websiteText && <p className="text-purple-600 font-medium">{listing.websiteText}</p>}
            <p>{listing.agentAddress}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2%', paddingTop: '2%', borderTop: '1px solid #f3f4f6' }}>
          <span className="text-gray-400" style={{ fontSize: '1.4vw' }}>{listing.listingDate}</span>
          <span className="text-gray-400" style={{ fontSize: '1.4vw' }}>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [formState, setFormState] = useState<FormState>({
    listing: defaultListing,
    logo: null,
    mapImage: null,
    galleryImages: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'images' | 'agent'>('property');

  const updateListing = useCallback((listing: ListingData) => {
    setFormState(prev => ({ ...prev, listing }));
  }, []);

  const updateLogo = useCallback((logo: ImageFile | null) => {
    setFormState(prev => ({ ...prev, logo }));
  }, []);

  const updateMapImage = useCallback((mapImage: ImageFile | null) => {
    setFormState(prev => ({ ...prev, mapImage }));
  }, []);

  const updateGalleryImages = useCallback((galleryImages: ImageFile[]) => {
    setFormState(prev => ({ ...prev, galleryImages }));
  }, []);

  const handleGeneratePdf = async () => {
    if (!isFormValid(formState.listing)) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing: formState.listing,
          logo: formState.logo?.preview || null,
          mapImage: formState.mapImage?.preview || null,
          galleryImages: formState.galleryImages.map(img => img.preview),
        }),
      });
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generatePdfFilename(formState.listing.listingId);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Real Estate Flyer Generator</h1>
          </div>
          <button
            onClick={handleGeneratePdf}
            disabled={!isFormValid(formState.listing) || isGenerating}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 ${isFormValid(formState.listing) && !isGenerating ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
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
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
                    >
                      {tab === 'property' && 'Property Details'}
                      {tab === 'images' && 'Images'}
                      {tab === 'agent' && 'Agent Info'}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">
                {activeTab === 'property' && <ListingForm data={formState.listing} onChange={updateListing} />}
                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <ImageUpload image={formState.logo} onImageChange={updateLogo} label="Company Logo" />
                    <ImageUpload image={formState.mapImage} onImageChange={updateMapImage} label="Location Map" />
                    <GalleryUpload images={formState.galleryImages} onImagesChange={updateGalleryImages} maxImages={6} label="Gallery Images" />
                  </div>
                )}
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
