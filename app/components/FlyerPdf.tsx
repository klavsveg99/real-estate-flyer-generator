import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { ListingData, ImageFile } from '@/app/types';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  purpleBar: { height: 10, backgroundColor: '#7C3AED', borderRadius: 2, marginBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  logoWrapper: { width: 160, height: 45 },
  logoImage: { width: 160, height: 45 },
  logoPlaceholder: { width: 160, height: 45, backgroundColor: '#f3f4f6', borderRadius: 4 },
  listingId: { backgroundColor: '#7C3AED', color: '#ffffff', paddingVertical: 6, paddingHorizontal: 12, fontSize: 11, fontWeight: 'bold', borderRadius: 4 },
  contentRow: { flexDirection: 'row', marginBottom: 20 },
  leftCol: { flex: 1, marginRight: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  address: { fontSize: 14, color: '#6b7280', marginBottom: 15 },
  priceBox: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, padding: 15, marginBottom: 15 },
  price: { fontSize: 36, fontWeight: 'bold', color: '#111827' },
  priceSubtext: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  description: { marginBottom: 15 },
  descriptionText: { fontSize: 11, color: '#4b5563', lineHeight: 1.5, marginBottom: 8 },
  cta: { backgroundColor: '#7C3AED', color: '#ffffff', paddingVertical: 12, paddingHorizontal: 24, fontSize: 13, fontWeight: 'bold', textAlign: 'center', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  rightCol: { width: 200 },
  mapWrapper: { width: '100%', height: 100, marginBottom: 12 },
  mapImage: { width: '100%', height: 100 },
  mapPlaceholder: { width: '100%', height: 100, backgroundColor: '#f3f4f6', borderRadius: 6, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
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
  website: { color: '#7C3AED', fontWeight: 'bold' },
  footerBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  footerText: { fontSize: 10, color: '#9ca3af' },
});

interface FlyerPdfProps {
  listing: ListingData;
  logo: ImageFile | null;
  mapImage: ImageFile | null;
  galleryImages: ImageFile[];
}

const formatPrice = (value: string) => {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '$' + value;
  return '$' + num.toLocaleString();
};

function GalleryImage({ src, style }: { src: string; style: any }) {
  return <Image src={src} style={style} />;
}

export function FlyerPdfDocument({ listing, logo, mapImage, galleryImages }: FlyerPdfProps) {
  const paragraphs = listing.description.split('\n\n').filter(p => p.trim());
  const priceSubtext = [
    listing.areaSize && `${parseFloat(listing.areaSize).toLocaleString()} m²`,
    listing.pricePerSqm && `${formatPrice(listing.pricePerSqm)}/m²`,
  ].filter(Boolean).join(' • ');

  const galleryItems = galleryImages.slice(0, 6);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.purpleBar} />

        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            {logo?.preview ? (
              <Image src={logo.preview} style={styles.logoImage} />
            ) : (
              <View style={styles.logoPlaceholder} />
            )}
          </View>
          <Text style={styles.listingId}>{listing.listingId}</Text>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.leftCol}>
            <Text style={styles.title}>{listing.title || 'Property Title'}</Text>
            <Text style={styles.address}>{listing.address || 'Property Address'}</Text>

            <View style={styles.priceBox}>
              <Text style={styles.price}>{formatPrice(listing.price) || '$0'}</Text>
              {priceSubtext && <Text style={styles.priceSubtext}>{priceSubtext}</Text>}
            </View>

            <View style={styles.description}>
              {paragraphs.slice(0, 3).map((para, i) => (
                <Text key={i} style={styles.descriptionText}>{para}</Text>
              ))}
            </View>

            <Text style={styles.cta}>{listing.ctaText || 'Contact Agent'}</Text>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.mapWrapper}>
              {mapImage?.preview ? (
                <Image src={mapImage.preview} style={styles.mapImage} />
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapText}>Map Image</Text>
                </View>
              )}
            </View>

            <View>
              {[...Array(3)].map((_, rowIndex) => {
                const rowImages = galleryItems.slice(rowIndex * 2, rowIndex * 2 + 2);
                const hasTwo = rowImages.length === 2;
                return (
                  <View key={`row-${rowIndex}`} style={[styles.galleryRow, rowIndex === 2 ? { marginBottom: 0 } : {}]}>
                    {rowImages.map((img, colIndex) => (
                      <GalleryImage key={img.id} src={img.preview} style={hasTwo ? styles.galleryItemHalf : styles.galleryItemFull} />
                    ))}
                    {!hasTwo && <View style={styles.galleryItemFull} />}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{listing.agentName || 'Agent Name'}</Text>
              {listing.agentTitle && <Text style={styles.agentDetail}>{listing.agentTitle}</Text>}
              {listing.mobile && <Text style={styles.agentDetail}>{listing.mobile}</Text>}
              {listing.phone && <Text style={styles.agentDetail}>{listing.phone}</Text>}
              {listing.email && <Text style={styles.agentDetail}>{listing.email}</Text>}
            </View>
            <View style={styles.rightInfo}>
              {listing.websiteText && <Text style={styles.website}>{listing.websiteText}</Text>}
              {listing.agentAddress && <Text>{listing.agentAddress}</Text>}
            </View>
          </View>
          <View style={styles.footerBar}>
            <Text style={styles.footerText}>{listing.listingDate}</Text>
            <Text style={styles.footerText}>copyright pardodlaimigs.lv</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
