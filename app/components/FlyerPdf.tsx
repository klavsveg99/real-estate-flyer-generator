import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
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
  purpleBar: { height: 8, backgroundColor: '#285854', borderRadius: 2, marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  listingId: { backgroundColor: '#285854', color: '#ffffff', paddingVertical: 5, paddingHorizontal: 10, fontSize: 10, fontWeight: 'bold', borderRadius: 4 },
  contentRow: { flexDirection: 'row', marginBottom: 20 },
  leftCol: { flex: 1, marginRight: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  address: { fontSize: 14, color: '#6b7280', marginBottom: 15 },
  priceBox: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, padding: 15, marginBottom: 15 },
  price: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  priceSubtext: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  description: { marginBottom: 15 },
  descriptionText: { fontSize: 11, color: '#4b5563', lineHeight: 1.5, marginBottom: 8 },
  cta: { backgroundColor: '#285854', color: '#ffffff', paddingVertical: 12, paddingHorizontal: 24, fontSize: 13, fontWeight: 'bold', textAlign: 'center', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  rightCol: { width: 200 },
  mapWrapper: { width: '100%', height: 100, backgroundColor: '#f3f4f6', borderRadius: 6, marginBottom: 12 },
  mapText: { fontSize: 12, color: '#9ca3af' },
  galleryRow: { flexDirection: 'row', marginBottom: 6 },
  galleryItemHalf: { width: 95, height: 62, marginRight: 6 },
  galleryItemFull: { width: 196, height: 62 },
  footer: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 15, marginTop: 'auto' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  agentInfo: { fontSize: 11 },
  agentName: { fontWeight: 'bold', color: '#111827' },
  agentDetail: { color: '#6b7280', marginTop: 1 },
  rightInfo: { textAlign: 'right', fontSize: 10, color: '#6b7280' },
  website: { color: '#285854', fontWeight: 'bold' },
  footerBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  footerText: { fontSize: 10, color: '#9ca3af' },
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
            <Image src={img.preview} style={isFullRow ? styles.galleryItemHalf : styles.galleryItemFull} />
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
            <Image src="/images/favicon.jpg" style={{ width: 50, height: 50, objectFit: 'contain', objectPosition: 'left center' }} />
            <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: '#000000' }}>Pardodlaimigs.lv</Text>
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

            <Text style={styles.cta}>{listing.ctaText || 'Sazināties ar aģentu'}</Text>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.mapWrapper}>
              {mapImage?.preview ? (
                <Image src={mapImage.preview} style={{ width: '100%', height: 100 }} />
              ) : (
                <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
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
          <View style={styles.footerRow}>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{listing.agentName || 'Aģenta vārds'}</Text>
              {listing.agentTitle && <Text style={styles.agentDetail}>{listing.agentTitle}</Text>}
              {listing.mobile && <Text style={styles.agentDetail}>{listing.mobile}</Text>}
              {listing.email && <Text style={styles.agentDetail}>{listing.email}</Text>}
            </View>
            <View style={styles.rightInfo}>
              {listing.websiteText && <Text style={styles.website}>{listing.websiteText}</Text>}
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
