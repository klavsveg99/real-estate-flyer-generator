'use client';

import { FormState, parseDescription } from '@/app/types';
import { formatPrice } from '@/app/lib/utils';

interface FlyerPreviewProps {
  formState: FormState;
}

export default function FlyerPreview({ formState }: FlyerPreviewProps) {
  const { listing, logo, mapImage, galleryImages } = formState;
  const paragraphs = parseDescription(listing.description);

  return (
    <div 
      id="flyer-template"
      className="bg-white shadow-lg"
      style={{ 
        width: '210mm',
        minHeight: '297mm',
        padding: '12mm',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: '2px', marginBottom: '12px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '140px', maxHeight: '40px' }}>
          {logo?.preview ? (
            <img src={logo.preview} alt="Logo" style={{ maxWidth: '100%', maxHeight: '40px', objectFit: 'contain' }} />
          ) : (
            <div className="bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400" style={{ width: '120px', height: '32px' }}>Logo</div>
          )}
        </div>
        <span className="bg-purple-600 text-white rounded text-xs font-semibold" style={{ padding: '4px 10px' }}>{listing.listingId}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <h1 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '18px', marginBottom: '4px' }}>{listing.title || 'Property Title'}</h1>
          <p className="text-gray-500 mb-3" style={{ fontSize: '11px' }}>{listing.address || 'Property Address'}</p>

          <div className="bg-gray-50 rounded-lg border border-gray-200 mb-3" style={{ padding: '10px' }}>
            <div className="font-bold text-gray-900" style={{ fontSize: '24px' }}>{formatPrice(listing.price) || '$0'}</div>
            <div className="text-gray-500 mt-1" style={{ fontSize: '11px' }}>
              {listing.areaSize && `${parseFloat(listing.areaSize).toLocaleString()} m²`}
              {listing.areaSize && listing.pricePerSqm && ' • '}
              {listing.pricePerSqm && `${formatPrice(listing.pricePerSqm)}/m²`}
            </div>
          </div>

          <div className="mb-3">
            {paragraphs.slice(0, 3).map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-2" style={{ fontSize: '10px' }}>{para}</p>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold uppercase text-center shadow-lg" style={{ padding: '8px 16px', fontSize: '10px', display: 'inline-block', letterSpacing: '0.5px' }}>
            {listing.ctaText || 'Contact Agent'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200" style={{ height: '90px' }}>
            {mapImage?.preview ? (
              <img src={mapImage.preview} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ fontSize: '10px' }}>Map Image</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', flex: 1 }}>
            {galleryImages.slice(0, 6).map((img, i) => (
              <div key={img.id} className="bg-gray-200 rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: '1' }}>
                <img src={img.preview} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
            {Array.from({ length: Math.max(0, 6 - galleryImages.length) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center" style={{ aspectRatio: '1' }}>
                <span className="text-gray-400" style={{ fontSize: '8px' }}>Image {galleryImages.length + i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '10px' }}>
            <p className="font-semibold text-gray-900">{listing.agentName || 'Agent Name'}</p>
            <p className="text-gray-500">{listing.agentTitle}</p>
            <p className="text-gray-500">{listing.mobile}</p>
            <p className="text-gray-500">{listing.phone}</p>
            <p className="text-gray-500">{listing.email}</p>
          </div>
          <div className="text-right text-gray-500" style={{ fontSize: '9px' }}>
            {listing.websiteText && <p className="text-purple-600 font-medium">{listing.websiteText}</p>}
            <p>{listing.agentAddress}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
          <span className="text-gray-400" style={{ fontSize: '8px' }}>{listing.listingDate}</span>
          <span className="text-gray-400" style={{ fontSize: '8px' }}>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
