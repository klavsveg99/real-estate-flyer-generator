import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ListingData, ImageFile } from '@/app/types';
import { CACHE_BUST } from '@/app/lib/utils';

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
  contentRow: { flexDirection: 'row', marginBottom: 15, gap: 18 },
  leftCol: { width: 248 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  address: { fontSize: 14, color: '#6b7280', marginBottom: 14 },
  priceBox: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, padding: 14, marginBottom: 14 },
  price: { fontSize: 30, fontWeight: 'bold', color: '#111827' },
  priceSubtext: { fontSize: 12, color: '#6b7280', marginTop: 3 },
  description: { marginBottom: 14 },
  descriptionText: { fontSize: 12, color: '#4b5563', lineHeight: 1.5, marginBottom: 8 },
  cta: { backgroundColor: '#285854', color: '#ffffff', paddingVertical: 14, paddingHorizontal: 24, fontSize: 14, fontWeight: 'bold', textAlign: 'center', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5, textDecoration: 'none' },
  rightCol: { width: 249 },
  mapWrapper: { width: '100%', height: 150, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 12, overflow: 'hidden' },
  mapText: { fontSize: 12, color: '#9ca3af' },
  galleryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  galleryItemHalf: { width: 121, height: 62, borderRadius: 4, overflow: 'hidden' },
  galleryItemFull: { width: 249, height: 70, borderRadius: 4, overflow: 'hidden' },
  galvenaisFotoWrapper: { width: '100%', height: 150, borderRadius: 4, overflow: 'hidden', marginTop: 10 },
  footer: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, marginTop: 'auto' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  agentBox: { backgroundColor: '#285854', padding: 16, borderRadius: 6 },
  agentName: { fontWeight: 'bold', color: '#ffffff', fontSize: 12 },
  agentTitle: { color: '#ffffff', fontSize: 10, marginTop: 2 },
  agentPhone: { color: '#ffffff', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  agentEmail: { color: '#ffffff', fontSize: 10, marginTop: 2 },
  rightInfo: { textAlign: 'right', fontSize: 10 },
  website: { color: '#285854', fontWeight: 'bold' },
  footerBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  footerText: { fontSize: 9, color: '#9ca3af' },
});

interface FlyerPdfProps {
  listing: ListingData;
  mapImage: ImageFile | null;
  galleryImages: ImageFile[];
  galvenaisFoto: ImageFile | null;
  agentImage: ImageFile | null;
  baseUrl?: string;
}

const formatPrice = (value: string) => {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '€' + value;
  return '€' + num.toLocaleString();
};

const stripHtml = (html: string): string => {
  let text = html.split('<br>').join('\n');
  text = text.split('</p>').join('\n\n');
  text = text.split(/<[^>]+>/g).join('');
  return text.trim();
};

export function FlyerPdfDocument({ listing, mapImage, galleryImages, galvenaisFoto, agentImage, baseUrl = '' }: FlyerPdfProps) {
  const plainText = stripHtml(listing.description);
  const paragraphs = plainText.split('\n\n').filter(p => p.trim());
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src={`/images/favicon.jpg?${CACHE_BUST}`} style={{ width: 40, height: 40 }} />
            <Text style={{ marginLeft: 8, fontSize: 12, fontWeight: 'bold', color: '#000000' }}>PardodLaimigs.lv</Text>
          </View>
          <Text style={styles.listingId}>{listing.listingId}</Text>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.leftCol} wrap={false}>
            <View style={{ width: 248 }}>
              <Text style={styles.title}>{listing.title || 'Īpašuma nosaukums'}</Text>
            </View>
            <Text style={styles.address}>{listing.address || 'Īpašuma adrese'}</Text>

            <View style={styles.priceBox}>
              <Text style={styles.price}>{formatPrice(listing.price) || '€0'}</Text>
              {priceSubtext && <Text style={styles.priceSubtext}>{priceSubtext}</Text>}
            </View>

            <View style={styles.description}>
              {paragraphs.map((para, i) => (
                <Text key={i} style={styles.descriptionText}>{para}</Text>
              ))}
            </View>

            <Link src="https://pardodlaimigs.lv" style={{ textDecoration: 'none' }}>
              <Text style={styles.cta}>{listing.ctaText || 'Sazināties'}</Text>
            </Link>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.mapWrapper}>
              {mapImage?.preview ? (
                <Image src={mapImage.preview} style={{ width: 249, height: 150, objectFit: 'cover' }} />
              ) : (
                <View style={{ width: 249, height: 150, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.mapText}>Karte</Text>
                </View>
              )}
            </View>

            {galleryItems.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {galleryItems.map((img, i) => {
                  const isLast = i === galleryItems.length - 1;
                  const isOdd = galleryItems.length % 2 === 1;
                  const isFullWidth = isLast && isOdd;
                  const itemStyle = isFullWidth 
                    ? styles.galleryItemFull 
                    : styles.galleryItemHalf;
                  const imgStyle = isFullWidth 
                    ? { width: 249, height: 70, objectFit: 'cover' as const }
                    : { width: 121, height: 62, objectFit: 'cover' as const };
                  return (
                    <View key={img.id} style={itemStyle}>
                      <Image src={img.preview} style={imgStyle} />
                    </View>
                  );
                })}
              </View>
            )}

            {galvenaisFoto && (
              <View style={styles.galvenaisFotoWrapper}>
                <Image src={galvenaisFoto.preview} style={{ width: 249, height: 150, objectFit: 'cover' }} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer} wrap={false}>
          <View style={[styles.agentBox, { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', marginRight: 10 }}>
                <Image src={agentImage?.preview ? (agentImage.preview.startsWith('/') ? baseUrl + agentImage.preview + '?' + CACHE_BUST : agentImage.preview + '?' + CACHE_BUST) : baseUrl + '/images/favicon.jpg?' + CACHE_BUST} style={{ width: 40, height: 40 }} />
              </View>
              <View>
                <Text style={styles.agentName}>{listing.agentName || 'Agent Name'}</Text>
                {listing.agentTitle && <Text style={styles.agentTitle}>{listing.agentTitle}</Text>}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', paddingTop: 2 }}>
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
