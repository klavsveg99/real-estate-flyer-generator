import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ListingData, ImageFile } from '@/app/types';

Font.register({
  family: 'DejaVuSans',
  fonts: [
    { src: '/fonts/DejaVuSans.ttf' },
    { src: '/fonts/DejaVuSans-Bold.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'DejaVuSans', backgroundColor: '#ffffff' },
  purpleBar: { height: 6, backgroundColor: '#285854', borderRadius: 6, marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  listingId: { backgroundColor: '#285854', color: '#ffffff', paddingVertical: 4, paddingHorizontal: 8, fontSize: 9, fontWeight: 'bold', borderRadius: 6 },
  contentRow: { flexDirection: 'row', marginBottom: 15 },
  leftCol: { width: 283, marginRight: 30 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  address: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
  priceBox: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, padding: 10, marginBottom: 10 },
  price: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  priceSubtext: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  description: { marginBottom: 10 },
  descriptionText: { fontSize: 10, color: '#4b5563', lineHeight: 1.4, marginBottom: 6 },
  cta: { backgroundColor: '#285854', color: '#ffffff', paddingVertical: 10, paddingHorizontal: 20, fontSize: 12, fontWeight: 'bold', textAlign: 'center', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  rightCol: { width: 202 },
  mapWrapper: { width: '100%', height: 150, backgroundColor: '#f3f4f6', borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
  mapText: { fontSize: 12, color: '#9ca3af' },
  galleryRow: { flexDirection: 'row', marginBottom: 6 },
  galleryItemHalf: { width: 95, height: 62, marginRight: 6, borderRadius: 6, overflow: 'hidden' },
  galleryItemFull: { width: 196, height: 70, borderRadius: 6, overflow: 'hidden' },
  footer: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, marginTop: 'auto' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  agentBox: { backgroundColor: '#285854', padding: 10, borderRadius: 6 },
  agentName: { fontWeight: 'bold', color: '#ffffff', fontSize: 11 },
  agentTitle: { color: '#ffffff', fontSize: 9, marginTop: 1 },
  agentPhone: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', marginTop: 3 },
  agentEmail: { color: '#ffffff', fontSize: 9, marginTop: 1 },
  rightInfo: { textAlign: 'right', fontSize: 10 },
  website: { color: '#285854', fontWeight: 'bold' },
  footerBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  footerText: { fontSize: 9, color: '#9ca3af' },
});

interface FlyerPdfProps {
  listing: ListingData;
  mapImage: ImageFile | null;
  galleryImages: ImageFile[];
}

const formatPrice = (value: string) => {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '€' + value;
  return '€' + num.toLocaleString();
};

export function FlyerPdfDocument({ listing, mapImage, galleryImages }: FlyerPdfProps) {
  const paragraphs = listing.description.split('\n\n').filter(p => p.trim());
  const priceSubtext = [
    listing.areaSize && `${parseFloat(listing.areaSize).toLocaleString()} m²`,
    listing.pricePerSqm && `${formatPrice(listing.pricePerSqm)}/m²`,
  ].filter(Boolean).join(' • ');

  const galleryItems = galleryImages.slice(0, 6);

  const renderGalleryRow = (items: ImageFile[], startIndex: number) => {
    if (items.length === 0) return null;
    const isFullRow = items.length === 2;
    
    return (
      <View key={`gallery-row-${startIndex}`} style={[styles.galleryRow, startIndex === 4 ? { marginBottom: 0 } : {}]}>
        {items.map((img, idx) => (
          <View key={img.id} style={isFullRow ? styles.galleryItemHalf : styles.galleryItemFull}>
            <Image src={img.preview} style={[isFullRow ? styles.galleryItemHalf : styles.galleryItemFull, { objectFit: 'cover' }]} />
          </View>
        ))}
        {!isFullRow && <View style={styles.galleryItemFull} />}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.purpleBar} />

        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src="/images/favicon.jpg" style={{ width: 40, height: 40 }} />
            <Text style={{ marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: '#000000' }}>Pardodlaimigs.lv</Text>
          </View>
          <Text style={styles.listingId}>{listing.listingId}</Text>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.leftCol}>
            <Text style={styles.title}>{listing.title || 'Īpašuma nosaukums'}</Text>
            <Text style={styles.address}>{listing.address || 'Īpašuma adrese'}</Text>

            <View style={styles.priceBox}>
              <Text style={styles.price}>{formatPrice(listing.price) || '€0'}</Text>
              {priceSubtext && <Text style={styles.priceSubtext}>{priceSubtext}</Text>}
            </View>

            <View style={styles.description}>
              {paragraphs.slice(0, 3).map((para, i) => (
                <Text key={i} style={styles.descriptionText}>{para}</Text>
              ))}
            </View>

            <Link src={`mailto:info@pardodlaimigs.lv?subject=${encodeURIComponent('Par īpašumu: ' + listing.title)}`}>
              <Text style={styles.cta}>{listing.ctaText || 'Sazināties ar aģentu'}</Text>
            </Link>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.mapWrapper}>
              {mapImage?.preview ? (
                <Image src={mapImage.preview} style={{ width: 202, height: 150, objectFit: 'cover' }} />
              ) : (
                <View style={{ width: 202, height: 150, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.mapText}>Karte</Text>
                </View>
              )}
            </View>

            <View>
              {renderGalleryRow(galleryItems.slice(0, 2), 0)}
              {renderGalleryRow(galleryItems.slice(2, 4), 2)}
              {renderGalleryRow(galleryItems.slice(4, 6), 4)}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.agentBox, { width: '100%', flexDirection: 'row', gap: 40 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.agentName}>{listing.agentName || 'Agent Name'}</Text>
              {listing.agentTitle && <Text style={styles.agentTitle}>{listing.agentTitle}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              {listing.mobile && <Text style={styles.agentPhone}>{listing.mobile}</Text>}
              {listing.email && <Text style={styles.agentEmail}>{listing.email}</Text>}
            </View>
          </View>
          <View style={styles.footerBar}>
            <Text style={styles.footerText}>{listing.listingDate}</Text>
            <Text style={styles.footerText}>© pardodlaimigs.lv</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
